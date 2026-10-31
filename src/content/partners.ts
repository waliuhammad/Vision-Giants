import { getDb, isFirebaseConfigured } from '../config/firebase';

/**
 * Strategic partners shown on the Home page, managed in Admin → Partners and stored in the Firestore
 * `partners` collection. Nothing is built in: the section stays hidden until a partner is added.
 *
 * Logos are stored on the document itself as a small data: URL (resized in the browser before
 * saving), because the project is on the Spark plan and has no Cloud Storage bucket.
 * firestore.rules enforces the same field limits as below.
 */
export interface Partner {
  id: string;
  name: string;
  /** data:image/(png|jpeg|webp);base64,… */
  logo: string;
  type: string;
  description: string;
  details: string;
  /** http(s) link or ''. */
  url: string;
  order: number;
  active: boolean;
}

export const partnershipTypes = [
  'Strategic Partner',
  'Technology Partner',
  'Business Partner',
  'Training Partner',
  'Development Partner',
] as const;

export const PARTNER_LIMITS = { name: 120, type: 60, description: 300, details: 2000, url: 500, logo: 400_000 } as const;

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/**
 * True for an absolute http(s) URL with a real domain name. The hostname is checked explicitly
 * because Chrome's URL parser accepts hosts like "not a url" (it percent-encodes the spaces).
 */
export function isWebUrl(value: string) {
  try {
    const u = new URL(value);
    return (u.protocol === 'https:' || u.protocol === 'http:') && /^([a-z0-9](-*[a-z0-9])*\.)+[a-z][a-z0-9-]*[a-z0-9]$/i.test(u.hostname);
  } catch {
    return false;
  }
}

export const isLogoData = (v: string) => /^data:image\/(png|jpeg|webp);base64,/.test(v);

export function partnerFromDoc(id: string, d: Record<string, unknown>): Partner {
  const logo = str(d.logo);
  const url = str(d.url);
  return {
    id,
    name: str(d.name),
    logo: isLogoData(logo) ? logo : '',
    type: str(d.type),
    description: str(d.description),
    details: str(d.details),
    url: isWebUrl(url) ? url : '',
    order: Number(d.order) || 0,
    active: d.active === true,
  };
}

export const byOrder = (a: Partner, b: Partner) => a.order - b.order || a.name.localeCompare(b.name);

/** Active partners for the public site, in display order. Inactive ones are never readable publicly. */
export async function loadActivePartners(): Promise<Partner[]> {
  if (!isFirebaseConfigured) return [];
  const [db, { collection, getDocs, query, where }] = await Promise.all([getDb(), import('firebase/firestore/lite')]);
  const snap = await getDocs(query(collection(db, 'partners'), where('active', '==', true)));
  return snap.docs
    .map((d) => partnerFromDoc(d.id, d.data()))
    .filter((p) => p.name && p.logo)
    .sort(byOrder);
}
