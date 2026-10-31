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

/** Placeholder logo: coloured mark, name and a "SAMPLE PARTNER" line, as an SVG data: URL. */
const sampleLogo = (mark: string, label: string, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="140" viewBox="0 0 520 140">` +
      `<rect x="10" y="20" width="100" height="100" rx="26" fill="${color}"/>` +
      `<text x="60" y="73" fill="#fff" font-family="Inter,Segoe UI,system-ui,sans-serif" font-size="58" font-weight="700" text-anchor="middle" dominant-baseline="central">${mark}</text>` +
      `<text x="132" y="72" fill="#0b1730" font-family="Inter,Segoe UI,system-ui,sans-serif" font-size="44" font-weight="700">${label}</text>` +
      `<text x="134" y="108" fill="#6b7789" font-family="Inter,Segoe UI,system-ui,sans-serif" font-size="26" font-weight="500" letter-spacing="1">SAMPLE PARTNER</text>` +
      `</svg>`,
  )}`;

const sample = (id: string, name: string, type: string, mark: string, label: string, color: string, description: string, order: number): Partner => ({
  id,
  name,
  logo: sampleLogo(mark, label, color),
  type,
  description,
  details: 'This is a sample entry that shows how partners appear here. It disappears automatically once a real partner is added in Admin → Partners.',
  url: '',
  order,
  active: true,
});

/**
 * Shown on the Home page only while the database has no active partners, so the section can be
 * seen before real partners are added. Names start with "Sample" so they are clearly placeholders.
 */
export const samplePartners: Partner[] = [
  sample('sample-technology', 'Sample Technology Partner', 'Technology Partner', 'T', 'Technology', '#2563eb', 'Cloud infrastructure and platform services that power the applications we build for our clients.', 10),
  sample('sample-training', 'Sample Training Institute', 'Training Partner', 'A', 'Training', '#0f9d76', 'Certified courses and workshops that keep our engineers current with modern tools and practices.', 20),
  sample('sample-business', 'Sample Business Group', 'Business Partner', 'B', 'Business', '#c2410c', 'Joint go-to-market work bringing digital solutions to retail and distribution businesses.', 30),
  sample('sample-development', 'Sample Development Studio', 'Development Partner', 'D', 'Development', '#7c3aed', 'Shared delivery capacity for large projects, from UI/UX design through to quality assurance.', 40),
];

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
