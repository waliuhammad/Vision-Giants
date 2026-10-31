export interface CareerWhyCard {
  id: string;
  icon: 'trending' | 'users' | 'lightbulb' | 'heart' | 'trophy';
  title: string;
  description: string;
}

export interface CareerPerkItem {
  id: string;
  icon: 'salary' | 'clock' | 'learning' | 'health' | 'outings' | 'bonus';
  label: string;
}

export interface CareersTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  photo: string;
  rating?: number;
}

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

export interface CareersPageData {
  // Hero (Dark Navy)
  heroBadgeText: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImage: string;
  heroSocialProofCount: string;
  heroSocialProofText: string;

  // Extended hero fields (for CareersPage backward-compat sections)
  heroEyebrow: string;
  heroExperienceBadgeYears: string;
  heroExperienceBadgeText: string;

  // Stats ribbon
  stats: CareersStat[];

  // Career Tracks
  tracksEyebrow: string;
  tracksHeading: string;
  tracks: CareersTrack[];

  // Why section extra fields
  whyImage: string;
  whyBadge: string;
  whyChecklist: string[];
  whyCtaText: string;
  whyCtaLink: string;

  testimonialsEyebrow?: string;
  testimonialsHeading?: string;
  ctaButtonLink?: string;

  // Why Work With Us (5 cards)
  whyEyebrow: string;
  whyHeading: string;
  whyDescription: string;
  whyCards: CareerWhyCard[];

  // Current Opportunities
  positionsEyebrow: string;
  positionsHeading: string;
  positionsLead: string;

  // Our Culture (4-photo bento grid + employee review card)
  cultureEyebrow: string;
  cultureHeading: string;
  cultureDescription: string;
  culturePhotos: [string, string, string, string];
  cultureTestimonials: CareersTestimonial[];

  // More Than A Job (Benefits & Perks ribbon)
  perksEyebrow: string;
  perksHeading: string;
  perksList: CareerPerkItem[];

  // Bottom CTA: Don't See the Right Fit?
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;

  // Alias for compatibility
  testimonials: CareersTestimonial[];
}

export const defaultCareersPageData: CareersPageData = {
  // Hero
  heroBadgeText: 'WE ARE HIRING',
  heroTitleLine1: 'Build Your Future',
  heroTitleLine2: 'With Us.',
  heroDescription:
    'Join a team of creative thinkers, developers, and innovators building technology that makes a difference.',
  heroPrimaryCtaText: 'Explore Opportunities',
  heroPrimaryCtaLink: '#open-positions',
  heroSecondaryCtaText: 'Submit Your CV',
  heroSecondaryCtaLink: '#submit-cv',
  heroImage:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  heroSocialProofCount: '50+',
  heroSocialProofText: 'Talented People Building the future together',

  // Extended hero fields (for CareersPage backward-compat sections)
  heroEyebrow: 'WE ARE HIRING',
  heroExperienceBadgeYears: '5+',
  heroExperienceBadgeText: 'YEARS OF EXCELLENCE',

  // Stats ribbon
  stats: [
    { icon: 'users', value: '50+', label: 'Talented People' },
    { icon: 'trophy', value: '95%+', label: 'Retention Rate' },
    { icon: 'briefcase', value: '30+', label: 'Open Roles' },
    { icon: 'globe', value: '10+', label: 'Global Clients' },
  ],

  // Career Tracks
  tracksEyebrow: 'CAREER TRACKS',
  tracksHeading: 'Find Your Path',
  tracks: [
    {
      id: 'tr-1',
      title: 'Frontend Development',
      description: 'Build beautiful, responsive UIs with React, TypeScript and modern CSS.',
      icon: 'code',
      accentColor: '#2563eb',
    },
    {
      id: 'tr-2',
      title: 'Mobile Development',
      description: 'Create cross-platform mobile apps with Flutter & React Native.',
      icon: 'smartphone',
      accentColor: '#10b981',
    },
    {
      id: 'tr-3',
      title: 'UI/UX Design',
      description: 'Design intuitive user experiences with Figma and research-driven methods.',
      icon: 'palette',
      accentColor: '#f59e0b',
    },
    {
      id: 'tr-4',
      title: 'Cloud & DevOps',
      description: 'Architect and automate cloud infrastructure at scale.',
      icon: 'cloud',
      accentColor: '#8b5cf6',
    },
    {
      id: 'tr-5',
      title: 'AI & Automation',
      description: 'Build intelligent pipelines and agent-based AI systems.',
      icon: 'cpu',
      accentColor: '#06b6d4',
    },
  ],

  // Why Work With Us
  whyEyebrow: 'WHY WORK WITH US',
  whyHeading: 'Great People. Great Culture. Great Opportunities.',
  whyDescription:
    'We believe happy people build amazing products. Our culture is built on trust, collaboration, innovation and a shared passion for excellence.',
  whyImage:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
  whyBadge: '100% Culture Driven',
  whyChecklist: [
    'Experienced & Qualified Industry Practitioners',
    'Regular Code Reviews & Challenging Projects',
    'Personalized Mentorship & Career Development',
    'Smart Workspaces & Flexible Working Modes',
  ],
  whyCtaText: 'Know More About Us',
  whyCtaLink: '/about',
  whyCards: [
    {
      id: 'why-1',
      icon: 'trending',
      title: 'Grow Your Career',
      description: 'We support your growth with mentorship, training and challenging opportunities.',
    },
    {
      id: 'why-2',
      icon: 'users',
      title: 'Collaborative Culture',
      description: 'Work with passionate people in an open, friendly and inclusive environment.',
    },
    {
      id: 'why-3',
      icon: 'lightbulb',
      title: 'Innovative Projects',
      description: 'Work on cutting-edge technologies and products that create real impact.',
    },
    {
      id: 'why-4',
      icon: 'heart',
      title: 'Wellness First',
      description: 'We care about your well-being with flexible schedules and health & wellness programs.',
    },
    {
      id: 'why-5',
      icon: 'trophy',
      title: 'Perks & Benefits',
      description: 'Competitive salary, bonuses, learning budget and many other exciting perks.',
    },
  ],

  // Current Opportunities
  positionsEyebrow: 'CURRENT OPPORTUNITIES',
  positionsHeading: 'Open Positions',
  positionsLead: 'Explore current job openings and find the perfect role for your skills and passion.',

  // Our Culture
  cultureEyebrow: 'OUR CULTURE',
  cultureHeading: 'A Place Where You Belong',
  cultureDescription:
    'We are more than just a team. We are a family that celebrates wins, learns together and supports each other every step of the way.',
  culturePhotos: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=800&q=80',
  ],
  cultureTestimonials: [
    {
      id: 't-1',
      name: 'Ayesha Khan',
      role: 'Senior Developer',
      quote:
        'Vision Giants has given me the platform to grow, take on new challenges and work on meaningful projects with an amazing team.',
      photo:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
    {
      id: 't-2',
      name: 'Rohit Gupta',
      role: 'Mobile Team Lead',
      quote:
        'The technical standards and supportive team spirit are incredible. Every day you are challenged and given the freedom to innovate.',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
    {
      id: 't-3',
      name: 'Sneha Patel',
      role: 'UI/UX Lead Designer',
      quote:
        'A culture that genuinely respects creativity and work-life balance. We design experiences that solve real customer problems.',
      photo:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
  ],

  // Benefits & Perks (6 items)
  perksEyebrow: 'MORE THAN A JOB',
  perksHeading: 'Benefits & Perks',
  perksList: [
    { id: 'p-1', icon: 'salary', label: 'Competitive Salary' },
    { id: 'p-2', icon: 'clock', label: 'Flexible Working Hours' },
    { id: 'p-3', icon: 'learning', label: 'Learning & Development' },
    { id: 'p-4', icon: 'health', label: 'Health Insurance & Wellness' },
    { id: 'p-5', icon: 'outings', label: 'Team Outings & Events' },
    { id: 'p-6', icon: 'bonus', label: 'Performance Bonuses' },
  ],

  // Bottom CTA
  ctaHeading: "Don't See the Right Fit?",
  ctaDescription:
    'We are always looking for talented and passionate people. Send us your CV and we will keep you in mind for future opportunities.',
  ctaButtonText: 'Submit Your CV',

  // Alias
  testimonials: [
    {
      id: 't-1',
      name: 'Ayesha Khan',
      role: 'Senior Developer',
      quote:
        'Vision Giants has given me the platform to grow, take on new challenges and work on meaningful projects with an amazing team.',
      photo:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
    {
      id: 't-2',
      name: 'Rohit Gupta',
      role: 'Mobile Team Lead',
      quote:
        'The technical standards and supportive team spirit are incredible. Every day you are challenged and given the freedom to innovate.',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
  ],
};

type Data = Record<string, unknown>;

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

export function careersPageDataFromDoc(d: Data): CareersPageData {
  const testimonials = Array.isArray(d.cultureTestimonials) && d.cultureTestimonials.length > 0
    ? (d.cultureTestimonials as CareersTestimonial[])
    : Array.isArray(d.testimonials) && d.testimonials.length > 0
    ? (d.testimonials as CareersTestimonial[])
    : defaultCareersPageData.cultureTestimonials;

  return {
    heroBadgeText: str(d.heroBadgeText, defaultCareersPageData.heroBadgeText),
    heroTitleLine1: str(d.heroTitleLine1, defaultCareersPageData.heroTitleLine1),
    heroTitleLine2: str(d.heroTitleLine2, defaultCareersPageData.heroTitleLine2),
    heroDescription: str(d.heroDescription, defaultCareersPageData.heroDescription),
    heroPrimaryCtaText: str(d.heroPrimaryCtaText, defaultCareersPageData.heroPrimaryCtaText),
    heroPrimaryCtaLink: str(d.heroPrimaryCtaLink, defaultCareersPageData.heroPrimaryCtaLink),
    heroSecondaryCtaText: str(d.heroSecondaryCtaText, defaultCareersPageData.heroSecondaryCtaText),
    heroSecondaryCtaLink: str(d.heroSecondaryCtaLink, defaultCareersPageData.heroSecondaryCtaLink),
    heroImage: str(d.heroImage, defaultCareersPageData.heroImage),
    heroSocialProofCount: str(d.heroSocialProofCount, defaultCareersPageData.heroSocialProofCount),
    heroSocialProofText: str(d.heroSocialProofText, defaultCareersPageData.heroSocialProofText),

    whyEyebrow: str(d.whyEyebrow, defaultCareersPageData.whyEyebrow),
    whyHeading: str(d.whyHeading, defaultCareersPageData.whyHeading),
    whyDescription: str(d.whyDescription, defaultCareersPageData.whyDescription),
    whyCards:
      Array.isArray(d.whyCards) && d.whyCards.length > 0
        ? (d.whyCards as CareerWhyCard[])
        : defaultCareersPageData.whyCards,

    positionsEyebrow: str(d.positionsEyebrow, defaultCareersPageData.positionsEyebrow),
    positionsHeading: str(d.positionsHeading, defaultCareersPageData.positionsHeading),
    positionsLead: str(d.positionsLead, defaultCareersPageData.positionsLead),

    cultureEyebrow: str(d.cultureEyebrow, defaultCareersPageData.cultureEyebrow),
    cultureHeading: str(d.cultureHeading, defaultCareersPageData.cultureHeading),
    cultureDescription: str(d.cultureDescription, defaultCareersPageData.cultureDescription),
    culturePhotos:
      Array.isArray(d.culturePhotos) && d.culturePhotos.length === 4
        ? (d.culturePhotos as [string, string, string, string])
        : defaultCareersPageData.culturePhotos,
    cultureTestimonials: testimonials,

    perksEyebrow: str(d.perksEyebrow, defaultCareersPageData.perksEyebrow),
    perksHeading: str(d.perksHeading, defaultCareersPageData.perksHeading),
    perksList:
      Array.isArray(d.perksList) && d.perksList.length > 0
        ? (d.perksList as CareerPerkItem[])
        : defaultCareersPageData.perksList,

    ctaHeading: str(d.ctaHeading, defaultCareersPageData.ctaHeading),
    ctaDescription: str(d.ctaDescription, defaultCareersPageData.ctaDescription),
    ctaButtonText: str(d.ctaButtonText, defaultCareersPageData.ctaButtonText),

    testimonials: testimonials,

    // Extended backward-compat fields
    heroEyebrow: str(d.heroEyebrow, defaultCareersPageData.heroEyebrow),
    heroExperienceBadgeYears: str(d.heroExperienceBadgeYears, defaultCareersPageData.heroExperienceBadgeYears),
    heroExperienceBadgeText: str(d.heroExperienceBadgeText, defaultCareersPageData.heroExperienceBadgeText),
    stats:
      Array.isArray(d.stats) && d.stats.length > 0
        ? (d.stats as CareersStat[])
        : defaultCareersPageData.stats,
    tracksEyebrow: str(d.tracksEyebrow, defaultCareersPageData.tracksEyebrow),
    tracksHeading: str(d.tracksHeading, defaultCareersPageData.tracksHeading),
    tracks:
      Array.isArray(d.tracks) && d.tracks.length > 0
        ? (d.tracks as CareersTrack[])
        : defaultCareersPageData.tracks,
    whyImage: str(d.whyImage, defaultCareersPageData.whyImage),
    whyBadge: str(d.whyBadge, defaultCareersPageData.whyBadge),
    whyChecklist:
      Array.isArray(d.whyChecklist) && d.whyChecklist.length > 0
        ? (d.whyChecklist as string[])
        : defaultCareersPageData.whyChecklist,
    whyCtaText: str(d.whyCtaText, defaultCareersPageData.whyCtaText),
    whyCtaLink: str(d.whyCtaLink, defaultCareersPageData.whyCtaLink),
  };
}
