export interface HomeCapability {
  id: string;
  icon: 'code' | 'smartphone' | 'palette' | 'cloud' | 'cpu' | 'shield' | 'headset' | 'zap';
  title: string;
  subtitle?: string;
}

export interface HomeTrustBrand {
  name: string;
  logo?: string;
}

export interface HomePageHeroData {
  // Pill badge above headline
  badgeText: string;
  // Main title in two lines
  titleLine1: string;
  titleLine2: string;
  // Paragraph lead
  lead: string;
  // CTAs
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  // Background image (dark IT office with developers)
  backgroundImage: string;
  // Right side floating developer stats badge
  expertBadgeCount: string;
  expertBadgeLabel: string;
  // Right floating holographic services menu
  menuItems: { label: string; icon: 'code' | 'smartphone' | 'palette' | 'cloud' }[];
  // Bottom capabilities (3 items)
  capabilities: HomeCapability[];
  // Trusted by banner
  trustHeading: string;
  trustBrands: string[];
}

export const defaultHomePageHeroData: HomePageHeroData = {
  badgeText: 'INNOVATE • BUILD • SCALE',
  titleLine1: 'We Build Software That Powers',
  titleLine2: 'Business Growth.',
  lead: 'CodeCraft Solutions is a software development company that helps startups, businesses, and enterprises turn ideas into powerful digital products.',
  primaryCtaText: 'Explore Our Services',
  primaryCtaLink: '/services/',
  secondaryCtaText: 'Get a Free Consultation',
  secondaryCtaLink: '/contact/',
  backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80',
  expertBadgeCount: '50+',
  expertBadgeLabel: 'Expert Developers',
  menuItems: [
    { label: 'Web Development', icon: 'code' },
    { label: 'Mobile Applications', icon: 'smartphone' },
    { label: 'UI/UX Design', icon: 'palette' },
    { label: 'Cloud Solutions', icon: 'cloud' },
  ],
  capabilities: [
    {
      id: 'cap-1',
      icon: 'code',
      title: 'Custom Software',
      subtitle: 'Development',
    },
    {
      id: 'cap-2',
      icon: 'zap',
      title: 'Agile & Scalable',
      subtitle: 'Solutions',
    },
    {
      id: 'cap-3',
      icon: 'headset',
      title: 'Dedicated',
      subtitle: 'Support',
    },
  ],
  trustHeading: 'TRUSTED BY BUSINESSES WORLDWIDE',
  trustBrands: [
    'GREENOVA TECHNOLOGIES',
    'BrightPath SOLUTIONS',
    'PixelForge STUDIO',
    'NextWave SYSTEMS',
    'softino DIGITAL',
    'CloudCraft TECHNOLOGIES',
  ],
};

type Data = Record<string, unknown>;
const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

export function homePageHeroDataFromDoc(d: Data): HomePageHeroData {
  return {
    badgeText: str(d.badgeText, defaultHomePageHeroData.badgeText),
    titleLine1: str(d.titleLine1, defaultHomePageHeroData.titleLine1),
    titleLine2: str(d.titleLine2, defaultHomePageHeroData.titleLine2),
    lead: str(d.lead, defaultHomePageHeroData.lead),
    primaryCtaText: str(d.primaryCtaText, defaultHomePageHeroData.primaryCtaText),
    primaryCtaLink: str(d.primaryCtaLink, defaultHomePageHeroData.primaryCtaLink),
    secondaryCtaText: str(d.secondaryCtaText, defaultHomePageHeroData.secondaryCtaText),
    secondaryCtaLink: str(d.secondaryCtaLink, defaultHomePageHeroData.secondaryCtaLink),
    backgroundImage: str(d.backgroundImage, defaultHomePageHeroData.backgroundImage),
    expertBadgeCount: str(d.expertBadgeCount, defaultHomePageHeroData.expertBadgeCount),
    expertBadgeLabel: str(d.expertBadgeLabel, defaultHomePageHeroData.expertBadgeLabel),
    menuItems: Array.isArray(d.menuItems) && d.menuItems.length > 0
      ? (d.menuItems as HomePageHeroData['menuItems'])
      : defaultHomePageHeroData.menuItems,
    capabilities: Array.isArray(d.capabilities) && d.capabilities.length > 0
      ? (d.capabilities as HomeCapability[])
      : defaultHomePageHeroData.capabilities,
    trustHeading: str(d.trustHeading, defaultHomePageHeroData.trustHeading),
    trustBrands: Array.isArray(d.trustBrands) && d.trustBrands.length > 0
      ? (d.trustBrands as string[])
      : defaultHomePageHeroData.trustBrands,
  };
}
