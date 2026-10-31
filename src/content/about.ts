import { teamMembers, type TeamMember } from '../data/team';

export interface AboutCoreValue {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutWhyReason {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutSectionVisibility {
  hero: boolean;
  whoWeAre: boolean;
  missionVision: boolean;
  values: boolean;
  whyChooseUs: boolean;
  team: boolean;
  cta: boolean;
}

export interface AboutPageData {
  // 1. Hero
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroCtaText: string;
  heroCtaLink: string;

  // 2. Who We Are
  whoWeAreEyebrow: string;
  whoWeAreHeading: string;
  whoWeAreText: string;
  whoWeAreBullets?: string[];

  // 3. Mission & Vision
  missionHeading: string;
  missionText: string;
  visionHeading: string;
  visionText: string;

  // 4. Core Values
  valuesEyebrow: string;
  valuesHeading: string;
  valuesLead?: string;
  valuesList: AboutCoreValue[];

  // 6. Why Choose Us
  whyEyebrow: string;
  whyHeading: string;
  whyLead?: string;
  whyList: AboutWhyReason[];

  // 7. Team
  teamEyebrow: string;
  teamHeading: string;
  teamLead?: string;
  teamMembers: TeamMember[];

  // 8. Final CTA
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;

  // Visibility toggles
  visibility: AboutSectionVisibility;
}

export const defaultAboutData: AboutPageData = {
  // 1. Hero
  heroEyebrow: 'About Us',
  heroHeadline: 'Building Digital Experiences That Drive Business Growth.',
  heroDescription:
    'We are a technology-driven software development company dedicated to helping businesses grow through innovative digital solutions. Our team combines creativity, technical expertise, and strategic thinking to develop reliable, scalable, and user-friendly software.',
  heroImage: '',
  heroImageAlt: 'Vision Giants software development team at work',
  heroCtaText: 'Contact Us',
  heroCtaLink: '/contact/',

  // 2. Who We Are
  whoWeAreEyebrow: 'Who We Are',
  whoWeAreHeading: 'Design, Engineering & Strategic Innovation Under One Roof',
  whoWeAreText:
    'We are a technology-driven software development company dedicated to helping businesses grow through innovative digital solutions. Our team combines creativity, technical expertise, and strategic thinking to develop reliable, scalable, and user-friendly software.\n\nFrom ambitious startups to established enterprises, we solve complex digital challenges with clean architecture, modern toolchains, and collaborative execution. We don’t just write code — we engineer long-term business assets designed to scale effortlessly.',
  whoWeAreBullets: [
    'Tailored solutions designed around your actual business workflows',
    'Agile development cycles with predictable milestones and zero surprise costs',
    'Senior engineers and product architects on every engagement',
    'End-to-end delivery: discovery, UI/UX, engineering, testing, and continuous support',
  ],

  // 3. Mission & Vision
  missionHeading: 'Our Mission',
  missionText:
    'To empower businesses through innovative technology, deliver exceptional software solutions, and help organizations achieve their digital goals.',
  visionHeading: 'Our Vision',
  visionText:
    'To become a trusted technology partner recognized for innovation, quality, reliability, and excellence in software development.',

  // 4. Core Values
  valuesEyebrow: 'Our Core Values',
  valuesHeading: 'The Principles That Drive Our Work Every Day',
  valuesLead: 'Our culture and work ethic are anchored in enduring standards of engineering and partnership.',
  valuesList: [
    {
      id: 'innovation',
      title: 'Innovation',
      description: 'We explore modern technologies, adopting modern tools when they deliver genuine competitive value.',
      icon: 'lightbulb',
    },
    {
      id: 'quality',
      title: 'Quality',
      description: 'We adhere to uncompromising standards of clean code, security, performance, and long-term maintainability.',
      icon: 'shield-check',
    },
    {
      id: 'integrity',
      title: 'Integrity',
      description: 'We communicate with radical honesty about timelines, scope trade-offs, and technical feasibility.',
      icon: 'check-circle',
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      description: 'We work hand-in-hand with clients and stakeholder teams, treating your objectives as our personal mission.',
      icon: 'users',
    },
    {
      id: 'customer-satisfaction',
      title: 'Customer Satisfaction',
      description: 'We measure success not by lines of code deployed, but by measurable impact and happy partners.',
      icon: 'heart-handshake',
    },
    {
      id: 'continuous-improvement',
      title: 'Continuous Improvement',
      description: 'We actively refine our skills, development methodologies, and internal processes on every project.',
      icon: 'trending-up',
    },
  ],

  // 6. Why Choose Us
  whyEyebrow: 'Why Choose Us',
  whyHeading: 'A Software Engineering Partner You Can Count On',
  whyLead: 'Six key pillars that set Vision Giants apart from traditional agencies and outsource vendors.',
  whyList: [
    {
      id: 'skilled-team',
      title: 'Skilled Development Team',
      description: 'Experienced engineers, UI/UX designers, and solution architects dedicated to your project success.',
      icon: 'code',
    },
    {
      id: 'quality-focused',
      title: 'Quality-Focused Development',
      description: 'Rigorous automated testing, architectural reviews, and best-in-class security standards on every deliverable.',
      icon: 'award',
    },
    {
      id: 'modern-technologies',
      title: 'Modern Technologies',
      description: 'Proven, battle-tested modern stacks that keep your product fast, scalable, and easy to maintain.',
      icon: 'cpu',
    },
    {
      id: 'transparent-communication',
      title: 'Transparent Communication',
      description: 'Regular demos, clear progress tracking, and open communication channels so you are always in the loop.',
      icon: 'message-square',
    },
    {
      id: 'on-time-delivery',
      title: 'On-Time Project Delivery',
      description: 'Strict adherence to project schedules, milestone commitments, and dependable delivery timelines.',
      icon: 'clock',
    },
    {
      id: 'long-term-support',
      title: 'Long-Term Technical Support',
      description: 'Reliable post-launch maintenance, performance monitoring, and continuous product enhancement.',
      icon: 'wrench',
    },
  ],

  // 7. Team
  teamEyebrow: 'Our Team',
  teamHeading: 'The Minds Behind Our Digital Products',
  teamLead: 'Meet the architects, engineers, and specialists building the future of software with us.',
  teamMembers: teamMembers,

  // 8. Final CTA
  ctaHeading: 'Ready to Turn Your Ideas Into Reality?',
  ctaDescription: 'Let’s work together to build innovative digital solutions that help your business grow.',
  ctaButtonText: 'Contact Us',
  ctaButtonLink: '/contact/',

  // Section Visibility
  visibility: {
    hero: true,
    whoWeAre: true,
    missionVision: true,
    values: true,
    whyChooseUs: true,
    team: true,
    cta: true,
  },
};

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);

/**
 * Converts Firestore `pages/about` document data to strongly-typed AboutPageData.
 * Falls back to defaultAboutData for any missing fields.
 */
export function aboutDataFromDoc(data: Record<string, unknown>): AboutPageData {
  const vis = (data.visibility && typeof data.visibility === 'object' ? data.visibility : {}) as Record<string, unknown>;

  const valuesList = Array.isArray(data.valuesList)
    ? data.valuesList.map((item, index) => {
        const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        return {
          id: str(row.id) || `val-${index}`,
          title: str(row.title),
          description: str(row.description),
          icon: str(row.icon) || undefined,
        };
      }).filter((v) => v.title)
    : defaultAboutData.valuesList;

  const whyList = Array.isArray(data.whyList)
    ? data.whyList.map((item, index) => {
        const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        return {
          id: str(row.id) || `why-${index}`,
          title: str(row.title),
          description: str(row.description),
          icon: str(row.icon) || undefined,
        };
      }).filter((w) => w.title)
    : defaultAboutData.whyList;

  const teamList = Array.isArray(data.teamMembers)
    ? data.teamMembers.map((item, index) => {
        const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        const socials = (row.socials && typeof row.socials === 'object' ? row.socials : {}) as Record<string, unknown>;
        return {
          id: str(row.id) || `tm-${index}`,
          name: str(row.name),
          role: str(row.role),
          bio: str(row.bio),
          image: str(row.image) || undefined,
          socials: {
            linkedin: str(socials.linkedin) || undefined,
            twitter: str(socials.twitter) || undefined,
            website: str(socials.website) || undefined,
            instagram: str(socials.instagram) || undefined,
            facebook: str(socials.facebook) || undefined,
            github: str(socials.github) || undefined,
          },
        } as TeamMember;
      }).filter((m) => m.name)
    : defaultAboutData.teamMembers;

  const whoWeAreBullets = Array.isArray(data.whoWeAreBullets)
    ? data.whoWeAreBullets.map((b) => str(b)).filter(Boolean)
    : defaultAboutData.whoWeAreBullets;

  return {
    heroEyebrow: str(data.heroEyebrow) || defaultAboutData.heroEyebrow,
    heroHeadline: str(data.heroHeadline) || defaultAboutData.heroHeadline,
    heroDescription: str(data.heroDescription) || defaultAboutData.heroDescription,
    heroImage: str(data.heroImage) || defaultAboutData.heroImage,
    heroImageAlt: str(data.heroImageAlt) || defaultAboutData.heroImageAlt,
    heroCtaText: str(data.heroCtaText) || defaultAboutData.heroCtaText,
    heroCtaLink: str(data.heroCtaLink) || defaultAboutData.heroCtaLink,

    whoWeAreEyebrow: str(data.whoWeAreEyebrow) || defaultAboutData.whoWeAreEyebrow,
    whoWeAreHeading: str(data.whoWeAreHeading) || defaultAboutData.whoWeAreHeading,
    whoWeAreText: str(data.whoWeAreText) || defaultAboutData.whoWeAreText,
    whoWeAreBullets,

    missionHeading: str(data.missionHeading) || defaultAboutData.missionHeading,
    missionText: str(data.missionText) || defaultAboutData.missionText,
    visionHeading: str(data.visionHeading) || defaultAboutData.visionHeading,
    visionText: str(data.visionText) || defaultAboutData.visionText,

    valuesEyebrow: str(data.valuesEyebrow) || defaultAboutData.valuesEyebrow,
    valuesHeading: str(data.valuesHeading) || defaultAboutData.valuesHeading,
    valuesLead: str(data.valuesLead) || defaultAboutData.valuesLead,
    valuesList: valuesList.length > 0 ? valuesList : defaultAboutData.valuesList,

    whyEyebrow: str(data.whyEyebrow) || defaultAboutData.whyEyebrow,
    whyHeading: str(data.whyHeading) || defaultAboutData.whyHeading,
    whyLead: str(data.whyLead) || defaultAboutData.whyLead,
    whyList: whyList.length > 0 ? whyList : defaultAboutData.whyList,

    teamEyebrow: str(data.teamEyebrow) || defaultAboutData.teamEyebrow,
    teamHeading: str(data.teamHeading) || defaultAboutData.teamHeading,
    teamLead: str(data.teamLead) || defaultAboutData.teamLead,
    teamMembers: teamList.length > 0 ? teamList : defaultAboutData.teamMembers,

    ctaHeading: str(data.ctaHeading) || defaultAboutData.ctaHeading,
    ctaDescription: str(data.ctaDescription) || defaultAboutData.ctaDescription,
    ctaButtonText: str(data.ctaButtonText) || defaultAboutData.ctaButtonText,
    ctaButtonLink: str(data.ctaButtonLink) || defaultAboutData.ctaButtonLink,

    visibility: {
      hero: bool(vis.hero, true),
      whoWeAre: bool(vis.whoWeAre, true),
      missionVision: bool(vis.missionVision, true),
      values: bool(vis.values, true),
      whyChooseUs: bool(vis.whyChooseUs, true),
      team: bool(vis.team, true),
      cta: bool(vis.cta, true),
    },
  };
}

