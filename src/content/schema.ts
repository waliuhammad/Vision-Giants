import { services, serviceIcons, type Service, type ServiceIconName } from '../data/services';
import { projects, categoryLabels, previewKinds, type Project, type ProjectCategory, type PreviewKind } from '../data/portfolio';
import { openPositions, type Position } from '../data/careers';
import type { PageTexts } from './pages';
import { defaultProfile, type CompanyProfile, type ProfileAward, type ProfileFact } from '../data/profile';

/** Content that can be managed from the admin dashboard. */
export interface SiteContent {
  services: Service[];
  projects: Project[];
  positions: Position[];
  /** Company profile on the Portfolio page (a single document, not a collection). */
  profile: CompanyProfile;
  /** Edited page text from Admin → Site pages; missing fields use the defaults in ./pages.ts. */
  pages: PageTexts;
}

/** Built-in content from src/data, used until content is imported into Firestore. */
export const defaultContent: SiteContent = { services, projects, positions: openPositions, profile: defaultProfile, pages: {} };

export type ContentCollection = 'services' | 'projects' | 'positions';

type Data = Record<string, unknown>;

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const strList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

/**
 * Convert Firestore documents to typed content. Only known fields are copied, so the result is
 * plain JSON (safe to embed in prerendered pages) and unexpected data can't break rendering.
 */
export const fromDoc = {
  services: (id: string, d: Data): Service => ({
    id,
    title: str(d.title),
    short: str(d.short),
    description: str(d.description),
    deliverables: strList(d.deliverables),
    icon: oneOf(d.icon, Object.keys(serviceIcons) as ServiceIconName[], 'code'),
  }),
  projects: (id: string, d: Data): Project => ({
    id,
    title: str(d.title),
    category: oneOf(d.category, Object.keys(categoryLabels) as ProjectCategory[], 'web'),
    ...(str(d.industry) ? { industry: str(d.industry) } : {}),
    summary: str(d.summary),
    details: str(d.details),
    features: strList(d.features),
    tech: strList(d.tech),
    ...(str(d.url) ? { url: str(d.url) } : {}),
    ...(strList(d.images).length ? { images: strList(d.images) } : {}),
    preview: oneOf<PreviewKind>(d.preview, previewKinds, 'dashboard'),
    ...(str(d.imageUrl) ? { imageUrl: str(d.imageUrl) } : {}),
    isDemo: d.isDemo === true,
  }),
  positions: (id: string, d: Data): Position => ({
    id,
    title: str(d.title),
    type: str(d.type),
    location: str(d.location),
    summary: str(d.summary),
    ...(str(d.description) ? { description: str(d.description) } : {}),
  }),
} satisfies { [K in ContentCollection]: (id: string, d: Data) => SiteContent[K][number] };

const records = (v: unknown): Data[] =>
  Array.isArray(v) ? v.filter((x): x is Data => typeof x === 'object' && x !== null) : [];

const awards = (v: unknown): ProfileAward[] =>
  records(v)
    .map((a) => ({ title: str(a.title), issuer: str(a.issuer), year: str(a.year), ...(a.placeholder === true ? { placeholder: true } : {}) }))
    .filter((a) => a.title);

/** Converts the `pages/portfolio` document; missing text fields fall back to the built-in profile. */
export function profileFromDoc(d: Data): CompanyProfile {
  const text = (key: keyof CompanyProfile) => str(d[key]) || (defaultProfile[key] as string);
  return {
    bio: text('bio'),
    introTitle: text('introTitle'),
    introText: text('introText'),
    facts: records(d.facts)
      .map((f): ProfileFact => ({ label: str(f.label), value: str(f.value) }))
      .filter((f) => f.label && f.value),
    whoWeAre: text('whoWeAre'),
    whatWeDo: text('whatWeDo'),
    mission: text('mission'),
    vision: text('vision'),
    certifications: awards(d.certifications),
    honours: awards(d.honours),
  };
}
