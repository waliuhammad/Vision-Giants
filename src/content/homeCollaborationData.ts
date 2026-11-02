export interface CollaborationPillar {
  id: string;
  icon: 'rocket' | 'users' | 'target' | 'zap' | 'shield' | 'award';
  title: string;
  subtitle: string;
}

export interface HomeCollaborationData {
  eyebrow: string;
  title: string;
  lead: string;
  badge: string;
  partnerName: string;
  partnerSubtitle?: string;
  partnerLogo?: string;
  description: string;
  pillars: CollaborationPillar[];
  buttonText: string;
  buttonUrl: string;
  footerQuote: string;
}

export const defaultHomeCollaborationData: HomeCollaborationData = {
  eyebrow: 'OUR COLLABORATION',
  title: 'Stronger Together, Greater Impact',
  lead: 'We collaborate with innovative organizations to combine our expertise, share knowledge, and deliver exceptional solutions.',
  badge: 'STRATEGIC PARTNER',
  partnerName: 'TechNova Solutions',
  partnerSubtitle: 'SOLUTIONS',
  partnerLogo: '', // When empty, an elegant isometric block / SVG monogram matching the image is rendered
  description: 'This collaboration enables us to deliver advanced technology solutions, drive innovation, and create greater value for our clients together.',
  pillars: [
    {
      id: 'p1',
      icon: 'rocket',
      title: 'Innovation',
      subtitle: 'Driven',
    },
    {
      id: 'p2',
      icon: 'users',
      title: 'Shared',
      subtitle: 'Expertise',
    },
    {
      id: 'p3',
      icon: 'target',
      title: 'Client Success',
      subtitle: 'Focused',
    },
  ],
  buttonText: 'Visit Partner Website',
  buttonUrl: 'https://technova.example.com',
  footerQuote: 'One goal. One vision. A better tomorrow.',
};

type Data = Record<string, unknown>;
const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

export function homeCollaborationDataFromDoc(d: Data): HomeCollaborationData {
  const pillarsRaw = Array.isArray(d.pillars) ? d.pillars : defaultHomeCollaborationData.pillars;
  const pillars: CollaborationPillar[] = pillarsRaw.map((p, idx) => ({
    id: str((p as Data)?.id, `pillar-${idx}`),
    icon: (str((p as Data)?.icon, 'rocket') as CollaborationPillar['icon']),
    title: str((p as Data)?.title, 'Innovation'),
    subtitle: str((p as Data)?.subtitle, 'Driven'),
  }));

  return {
    eyebrow: str(d.eyebrow, defaultHomeCollaborationData.eyebrow),
    title: str(d.title, defaultHomeCollaborationData.title),
    lead: str(d.lead, defaultHomeCollaborationData.lead),
    badge: str(d.badge, defaultHomeCollaborationData.badge),
    partnerName: str(d.partnerName, defaultHomeCollaborationData.partnerName),
    partnerSubtitle: str(d.partnerSubtitle, defaultHomeCollaborationData.partnerSubtitle),
    partnerLogo: str(d.partnerLogo, defaultHomeCollaborationData.partnerLogo),
    description: str(d.description, defaultHomeCollaborationData.description),
    pillars: pillars.length > 0 ? pillars : defaultHomeCollaborationData.pillars,
    buttonText: str(d.buttonText, defaultHomeCollaborationData.buttonText),
    buttonUrl: str(d.buttonUrl, defaultHomeCollaborationData.buttonUrl),
    footerQuote: str(d.footerQuote, defaultHomeCollaborationData.footerQuote),
  };
}
