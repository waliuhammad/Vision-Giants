export interface CareersStat {
  icon: 'users' | 'trophy' | 'briefcase' | 'globe';
  value: string;
  label: string;
}

export interface CareersTrack {
  id: string;
  title: string;
  description: string;
  icon: 'code' | 'smartphone' | 'palette' | 'cloud' | 'cpu';
  accentColor: string;
}

export interface CareersTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  photo: string;
}

export interface CareersPageData {
  // Hero
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImage: string;
  heroExperienceBadgeYears: string;
  heroExperienceBadgeText: string;
  heroSocialProofCount: string;
  heroSocialProofText: string;

  // Stats Ribbon
  stats: CareersStat[];

  // Tracks Section
  tracksEyebrow: string;
  tracksHeading: string;
  tracks: CareersTrack[];

  // Why Choose Us / Culture
  whyEyebrow: string;
  whyHeading: string;
  whyDescription: string;
  whyImage: string;
  whyBadge: string;
  whyChecklist: string[];
  whyCtaText: string;
  whyCtaLink: string;

  // Open Positions Section
  positionsEyebrow: string;
  positionsHeading: string;
  positionsLead: string;

  // Testimonials
  testimonialsEyebrow: string;
  testimonialsHeading: string;
  testimonials: CareersTestimonial[];

  // Bottom CTA Banner
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export const defaultCareersPageData: CareersPageData = {
  heroEyebrow: 'BUILD YOUR FUTURE',
  heroTitleLine1: 'Better Growth.',
  heroTitleLine2: 'Brighter Future.',
  heroDescription:
    'Join an elite team of engineers, designers, and innovators. Build high-stakes commercial systems with dedicated 1-on-1 mentorship, modern engineering standards, and rapid career progression.',
  heroPrimaryCtaText: 'Explore Openings',
  heroPrimaryCtaLink: '#open-positions',
  heroSecondaryCtaText: 'Life at Vision Giants',
  heroSecondaryCtaLink: '#why-us',
  heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  heroExperienceBadgeYears: '10+',
  heroExperienceBadgeText: 'YEARS OF EXCELLENCE',
  heroSocialProofCount: '50+',
  heroSocialProofText: 'Passionate Engineers & Creators',

  stats: [
    { icon: 'users', value: '50+', label: 'Specialist Engineers' },
    { icon: 'trophy', value: '98%', label: 'Team Retention Rate' },
    { icon: 'briefcase', value: '100+', label: 'Production Systems Shipped' },
    { icon: 'globe', value: '12+', label: 'Global Markets Served' },
  ],

  tracksEyebrow: 'OUR CAREER TRACKS',
  tracksHeading: 'Top Career Tracks',
  tracks: [
    {
      id: 'web',
      title: 'Full-Stack Web',
      description: 'Enterprise React, Next.js, TypeScript & Node.js cloud applications.',
      icon: 'code',
      accentColor: '#2563eb',
    },
    {
      id: 'mobile',
      title: 'Mobile Engineering',
      description: 'High-performance Flutter and React Native cross-platform apps.',
      icon: 'smartphone',
      accentColor: '#10b981',
    },
    {
      id: 'design',
      title: 'UI/UX & Product',
      description: 'Human-centric design systems, user journeys, wireframes & prototypes.',
      icon: 'palette',
      accentColor: '#f59e0b',
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps',
      description: 'Automated CI/CD pipelines, Docker, Kubernetes & resilient GCP/AWS infrastructure.',
      icon: 'cloud',
      accentColor: '#8b5cf6',
    },
    {
      id: 'ai',
      title: 'AI & Automation',
      description: 'LLM agents, practical neural workflows, and predictive analytics systems.',
      icon: 'cpu',
      accentColor: '#06b6d4',
    },
  ],

  whyEyebrow: 'WHY CHOOSE US',
  whyHeading: 'We Don’t Just Hire, We Build Futures',
  whyDescription:
    'At Vision Giants, we believe every engineer is unique. Our transparent engineering culture, dedicated 1-on-1 mentorship, and high-impact commercial client projects empower you to achieve your greatest professional potential.',
  whyImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  whyBadge: '100% Mentorship & Growth',
  whyChecklist: [
    'Experienced Engineering Leadership & Peer Code Reviews',
    'Real Production Architecture & Modern Tech Stacks',
    'Structured 1-on-1 Mentorship & Fast-Track Career Path',
    'Flexible Hybrid Work Culture & Health-First Atmosphere',
  ],
  whyCtaText: 'Know More About Us',
  whyCtaLink: '/about/',

  positionsEyebrow: 'CAREER OPPORTUNITIES',
  positionsHeading: 'Explore Open Positions',
  positionsLead: 'Find your next high-impact engineering role and build software that matters.',

  testimonialsEyebrow: 'STUDENT & TEAM STORIES',
  testimonialsHeading: 'What Our Team Says',
  testimonials: [
    {
      id: 't-1',
      name: 'Ananya Verma',
      role: 'Senior Frontend Engineer',
      quote:
        'The mentorship and engineering culture here helped me grow from building simple UI components to architecting mission-critical platforms. The autonomy is real.',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 't-2',
      name: 'Rohit Gupta',
      role: 'Mobile Team Lead',
      quote:
        'The technical standards are outstanding. You work alongside genuine problem solvers who support each other on complex state management and performance tuning.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 't-3',
      name: 'Sneha Patel',
      role: 'UI/UX Product Designer',
      quote:
        'Our design process is deeply collaborative. Designers work directly with developers and stakeholders to deliver interfaces that are both beautiful and functional.',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
  ],

  ctaHeading: 'Ready to Build Great Things? Drop Your CV',
  ctaDescription:
    'Don’t see a role that directly matches your current stack? We are always seeking ambitious engineers and creative thinkers for upcoming client teams.',
  ctaButtonText: 'Apply Now →',
  ctaButtonLink: '/careers/apply/',
};

type Data = Record<string, unknown>;

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);
const strList = (v: unknown, fallback: string[] = []) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : fallback;

export function careersPageDataFromDoc(d: Data): CareersPageData {
  return {
    heroEyebrow: str(d.heroEyebrow, defaultCareersPageData.heroEyebrow),
    heroTitleLine1: str(d.heroTitleLine1, defaultCareersPageData.heroTitleLine1),
    heroTitleLine2: str(d.heroTitleLine2, defaultCareersPageData.heroTitleLine2),
    heroDescription: str(d.heroDescription, defaultCareersPageData.heroDescription),
    heroPrimaryCtaText: str(d.heroPrimaryCtaText, defaultCareersPageData.heroPrimaryCtaText),
    heroPrimaryCtaLink: str(d.heroPrimaryCtaLink, defaultCareersPageData.heroPrimaryCtaLink),
    heroSecondaryCtaText: str(d.heroSecondaryCtaText, defaultCareersPageData.heroSecondaryCtaText),
    heroSecondaryCtaLink: str(d.heroSecondaryCtaLink, defaultCareersPageData.heroSecondaryCtaLink),
    heroImage: str(d.heroImage, defaultCareersPageData.heroImage),
    heroExperienceBadgeYears: str(d.heroExperienceBadgeYears, defaultCareersPageData.heroExperienceBadgeYears),
    heroExperienceBadgeText: str(d.heroExperienceBadgeText, defaultCareersPageData.heroExperienceBadgeText),
    heroSocialProofCount: str(d.heroSocialProofCount, defaultCareersPageData.heroSocialProofCount),
    heroSocialProofText: str(d.heroSocialProofText, defaultCareersPageData.heroSocialProofText),

    stats: Array.isArray(d.stats)
      ? (d.stats as CareersStat[])
      : defaultCareersPageData.stats,

    tracksEyebrow: str(d.tracksEyebrow, defaultCareersPageData.tracksEyebrow),
    tracksHeading: str(d.tracksHeading, defaultCareersPageData.tracksHeading),
    tracks: Array.isArray(d.tracks)
      ? (d.tracks as CareersTrack[])
      : defaultCareersPageData.tracks,

    whyEyebrow: str(d.whyEyebrow, defaultCareersPageData.whyEyebrow),
    whyHeading: str(d.whyHeading, defaultCareersPageData.whyHeading),
    whyDescription: str(d.whyDescription, defaultCareersPageData.whyDescription),
    whyImage: str(d.whyImage, defaultCareersPageData.whyImage),
    whyBadge: str(d.whyBadge, defaultCareersPageData.whyBadge),
    whyChecklist: strList(d.whyChecklist, defaultCareersPageData.whyChecklist),
    whyCtaText: str(d.whyCtaText, defaultCareersPageData.whyCtaText),
    whyCtaLink: str(d.whyCtaLink, defaultCareersPageData.whyCtaLink),

    positionsEyebrow: str(d.positionsEyebrow, defaultCareersPageData.positionsEyebrow),
    positionsHeading: str(d.positionsHeading, defaultCareersPageData.positionsHeading),
    positionsLead: str(d.positionsLead, defaultCareersPageData.positionsLead),

    testimonialsEyebrow: str(d.testimonialsEyebrow, defaultCareersPageData.testimonialsEyebrow),
    testimonialsHeading: str(d.testimonialsHeading, defaultCareersPageData.testimonialsHeading),
    testimonials: Array.isArray(d.testimonials)
      ? (d.testimonials as CareersTestimonial[])
      : defaultCareersPageData.testimonials,

    ctaHeading: str(d.ctaHeading, defaultCareersPageData.ctaHeading),
    ctaDescription: str(d.ctaDescription, defaultCareersPageData.ctaDescription),
    ctaButtonText: str(d.ctaButtonText, defaultCareersPageData.ctaButtonText),
    ctaButtonLink: str(d.ctaButtonLink, defaultCareersPageData.ctaButtonLink),
  };
}

