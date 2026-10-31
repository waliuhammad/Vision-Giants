import { teamMembers, type TeamMember } from '../data/team';
import { defaultClients, type ClientItem } from '../data/clients';

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
  expertise: boolean;
  whyChooseUs: boolean;
  clients: boolean;
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

  // 5. Expertise
  expertiseEyebrow: string;
  expertiseHeading: string;
  expertiseLead?: string;

  // 6. Why Choose Us
  whyEyebrow: string;
  whyHeading: string;
  whyLead?: string;
  whyList: AboutWhyReason[];

  // 6b. Our Clients (Directly above Our Team)
  clientsEyebrow: string;
  clientsHeading: string;
  clientsLead: string;
  clientsCtaText?: string;
  clientsCtaLink?: string;
  clientsList: ClientItem[];

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
  whoWeAreHeading: 'Engineers, Designers & Innovators Building Reliable Software',
  whoWeAreText:
    'We are a technology-driven software development company dedicated to helping businesses grow through innovative digital solutions. Our team combines creativity, technical expertise, and strategic thinking to develop reliable, scalable, and user-friendly software. From budding ventures to enterprise industry leaders, we architect software that solves real business challenges, drives revenue, and stands the test of scale.',
  whoWeAreBullets: [
    'Technology-driven team combining creative UI/UX with robust engineering.',
    'Serving dynamic startups, SMEs, and international brands across 6+ countries.',
    'Specializing in solving complex workflow, mobile, and web modernization bottlenecks.',
    'Agile delivery with transparent milestones and high engineering standards.',
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
  valuesHeading: 'The Principles That Guide Everything We Engineer',
  valuesLead:
    'Our core values form the foundation of our work culture, customer relationships, and architectural decisions.',
  valuesList: [
    {
      id: 'val-1',
      title: 'Innovation',
      description: 'Constantly exploring modern architectures, cutting-edge frameworks, and creative problem-solving.',
      icon: 'sparkles',
    },
    {
      id: 'val-2',
      title: 'Quality',
      description: 'Zero compromises on code quality, security standards, maintainability, and end-user delight.',
      icon: 'shield-check',
    },
    {
      id: 'val-3',
      title: 'Integrity',
      description: 'Transparent communication, honest timelines, intellectual honesty, and mutual trust.',
      icon: 'check-circle',
    },
    {
      id: 'val-4',
      title: 'Collaboration',
      description: 'Working side by side with clients as dedicated technology partners rather than distant vendors.',
      icon: 'users',
    },
    {
      id: 'val-5',
      title: 'Customer Satisfaction',
      description: 'Measuring our success by the tangible business growth and competitive edge we deliver to our partners.',
      icon: 'heart-handshake',
    },
    {
      id: 'val-6',
      title: 'Continuous Improvement',
      description: 'Iterative optimization, continuous learning, and constant refinement of our crafts and systems.',
      icon: 'trending-up',
    },
  ],

  // 5. Expertise
  expertiseEyebrow: 'Our Expertise',
  expertiseHeading: 'Full-Spectrum Technology Capabilities',
  expertiseLead:
    'We build production-ready digital solutions across web, mobile, cloud, design, and intelligent automation.',

  // 6. Why Choose Us
  whyEyebrow: 'Why Choose Us',
  whyHeading: 'Why Industry Leaders Trust Vision Giants',
  whyLead:
    'We combine technical excellence with strategic business thinking to deliver lasting software value.',
  whyList: [
    {
      id: 'why-1',
      title: 'Skilled Development Team',
      description: 'Senior engineers, full-stack specialists, and design architects experienced across modern stacks.',
      icon: 'code',
    },
    {
      id: 'why-2',
      title: 'Quality-Focused Development',
      description: 'Rigorous automated testing, clean code conventions, and high-performance standards from day one.',
      icon: 'check-circle-2',
    },
    {
      id: 'why-3',
      title: 'Modern Technologies',
      description: 'Leveraging React, Node.js, TypeScript, Flutter, Cloud, and AI for future-proof scalability.',
      icon: 'layers',
    },
    {
      id: 'why-4',
      title: 'Transparent Communication',
      description: 'Direct Slack channels, weekly demo sprints, transparent milestones, and zero hidden costs.',
      icon: 'message-square',
    },
    {
      id: 'why-5',
      title: 'On-Time Project Delivery',
      description: 'Disciplined agile sprint cycles ensuring predictive roadmaps and timely, stress-free launches.',
      icon: 'clock',
    },
    {
      id: 'why-6',
      title: 'Long-Term Technical Support',
      description: 'Reliable post-launch maintenance, performance monitoring, and continuous product enhancement.',
      icon: 'wrench',
    },
  ],

  // 6b. Our Clients (Directly above Our Team)
  clientsEyebrow: 'Our Clients',
  clientsHeading: 'Trusted by Our Clients',
  clientsLead:
    'Building lasting partnerships through technology, innovation, and exceptional digital solutions.',
  clientsCtaText: 'Become Our Client',
  clientsCtaLink: '/contact/',
  clientsList: defaultClients,

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
    expertise: true,
    whyChooseUs: true,
    clients: true,
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

  const clientsList = Array.isArray(data.clientsList)
    ? data.clientsList.map((item, index) => {
        const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        return {
          id: str(row.id) || `client-${index}`,
          name: str(row.name),
          logo: str(row.logo) || undefined,
          industry: str(row.industry) || 'Technology',
          description: str(row.description) || undefined,
          websiteUrl: str(row.websiteUrl) || undefined,
          order: typeof row.order === 'number' ? row.order : index + 1,
          active: row.active !== false,
        } as ClientItem;
      }).filter((c) => c.name)
    : defaultAboutData.clientsList;

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

    expertiseEyebrow: str(data.expertiseEyebrow) || defaultAboutData.expertiseEyebrow,
    expertiseHeading: str(data.expertiseHeading) || defaultAboutData.expertiseHeading,
    expertiseLead: str(data.expertiseLead) || defaultAboutData.expertiseLead,

    whyEyebrow: str(data.whyEyebrow) || defaultAboutData.whyEyebrow,
    whyHeading: str(data.whyHeading) || defaultAboutData.whyHeading,
    whyLead: str(data.whyLead) || defaultAboutData.whyLead,
    whyList: whyList.length > 0 ? whyList : defaultAboutData.whyList,

    clientsEyebrow: str(data.clientsEyebrow) || defaultAboutData.clientsEyebrow,
    clientsHeading: str(data.clientsHeading) || defaultAboutData.clientsHeading,
    clientsLead: str(data.clientsLead) || defaultAboutData.clientsLead,
    clientsCtaText: str(data.clientsCtaText) || defaultAboutData.clientsCtaText,
    clientsCtaLink: str(data.clientsCtaLink) || defaultAboutData.clientsCtaLink,
    clientsList: clientsList.length > 0 ? clientsList : defaultAboutData.clientsList,

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
      expertise: bool(vis.expertise, true),
      whyChooseUs: bool(vis.whyChooseUs, true),
      clients: bool(vis.clients, true),
      team: bool(vis.team, true),
      cta: bool(vis.cta, true),
    },
  };
}
