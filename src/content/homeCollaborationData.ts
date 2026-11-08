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
  title: 'Our Collaboration Partners',
  lead: 'Building stronger digital experiences through meaningful partnerships and collaboration.',
  partners: [
    {
      id: 'partner-1',
      name: 'Partner Software House 1',
      logo: '',
      websiteUrl: 'https://example.com',
      description: 'Specialized in enterprise web architecture, cloud infrastructure, and mission-critical software solutions.',
      tagline: 'Enterprise & Cloud',
    },
    {
      id: 'partner-2',
      name: 'Partner Software House 2',
      logo: '',
      websiteUrl: 'https://example.com',
      description: 'Experts in scalable mobile app development, cross-platform engineering, and intuitive UI/UX design.',
      tagline: 'Mobile & UI/UX',
    },
    {
      id: 'partner-3',
      name: 'Partner Software House 3',
      logo: '',
      websiteUrl: 'https://example.com',
      description: 'Pioneering artificial intelligence systems, predictive analytics, and automated workflow intelligence.',
      tagline: 'AI & Data Intelligence',
    },
    {
      id: 'partner-4',
      name: 'Partner Software House 4',
      logo: '',
      websiteUrl: 'https://example.com',
      description: 'Specialized in enterprise DevOps automation, cloud security hardening, and resilient infrastructure.',
      tagline: 'DevOps & Cloud Security',
    },
  ],
};

type Data = Record<string, unknown>;
const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

export function homeCollaborationDataFromDoc(d: Data): HomeCollaborationData {
  const partnersRaw = Array.isArray(d.partners) ? d.partners : [];
  const partners: CollaborationPartner[] = partnersRaw.map((p, idx) => {
    const item = typeof p === 'object' && p !== null ? (p as Data) : {};
    const fallback = defaultHomeCollaborationData.partners[idx] || defaultHomeCollaborationData.partners[0];
    return {
      id: str(item.id, `partner-${idx + 1}`),
      name: str(item.name, fallback.name),
      logo: str(item.logo, fallback.logo),
      websiteUrl: str(item.websiteUrl, fallback.websiteUrl),
      description: str(item.description, fallback.description),
      tagline: str(item.tagline, fallback.tagline),
    };
  });

  return {
    eyebrow: str(d.eyebrow, defaultHomeCollaborationData.eyebrow),
    title: str(d.title, defaultHomeCollaborationData.title),
    lead: str(d.lead, defaultHomeCollaborationData.lead),
    partners: partners.length > 0 ? partners : defaultHomeCollaborationData.partners,
  };
}
