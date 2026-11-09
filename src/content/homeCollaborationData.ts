import { partners as rawPartners, type Partner } from '../data/partners';

export interface CollaborationPartner {
  id: string;
  name: string;
  logo: string;
  websiteUrl: string;
  description: string;
  tagline?: string;
}

export interface HomeCollaborationData {
  eyebrow: string;
  title: string;
  lead: string;
  partners: CollaborationPartner[];
}

export const defaultHomeCollaborationData: HomeCollaborationData = {
  eyebrow: 'STRATEGIC PARTNERSHIPS',
  title: 'Our Collaboration',
  lead: 'Proud to work with partners who share our vision.',
  partners: rawPartners.map((p: Partner) => ({
    id: p.id,
    name: p.name,
    logo: p.logo || '',
    websiteUrl: p.website || '',
    description: p.description,
    tagline: p.type || '',
  })),
};

type Data = Record<string, unknown>;
const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

export function homeCollaborationDataFromDoc(d: Data): HomeCollaborationData {
  const partnersRaw = Array.isArray(d.partners) ? d.partners : [];
  const partners: CollaborationPartner[] = partnersRaw.map((p, idx) => {
    const item = typeof p === 'object' && p !== null ? (p as Data) : {};
    const fallback = defaultHomeCollaborationData.partners[idx] || defaultHomeCollaborationData.partners[0];
    return {
      id: str(item.id, fallback?.id || `partner-${idx + 1}`),
      name: str(item.name, fallback?.name || ''),
      logo: str(item.logo, fallback?.logo || ''),
      websiteUrl: str(item.websiteUrl, fallback?.websiteUrl || ''),
      description: str(item.description, fallback?.description || ''),
      tagline: str(item.tagline, fallback?.tagline || ''),
    };
  });

  return {
    eyebrow: str(d.eyebrow, defaultHomeCollaborationData.eyebrow),
    title: str(d.title, defaultHomeCollaborationData.title),
    lead: str(d.lead, defaultHomeCollaborationData.lead),
    partners: partners.length > 0 ? partners : defaultHomeCollaborationData.partners,
  };
}
