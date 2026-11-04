import type { Technology } from '../data/technologies';

export interface GlobalSettings {
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  email: string;
  supportEmail?: string;
  phones: string[];
  address: string;
  whatsappNumber?: string;
  social: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    github?: string;
    youtube?: string;
  };
  branding: {
    logoUrl?: string;
    logoMarkUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    accentColor?: string;
  };
}

export interface NavigationSettings {
  headerNav: { label: string; to: string; active?: boolean }[];
  primaryCta: { label: string; to: string; active?: boolean };
  footerCompanyNav: { label: string; to: string; active?: boolean }[];
  footerServicesNav?: { label: string; to: string; active?: boolean }[];
}

export interface HeaderFooterSettings {
  header: {
    sticky: boolean;
    showCta: boolean;
    ctaText: string;
    ctaLink: string;
    noticeBarEnabled?: boolean;
    noticeBarText?: string;
  };
  footer: {
    description: string;
    copyright: string;
    showSocials: boolean;
    showContactInfo: boolean;
    showNewsletter: boolean;
    legalLinks: { label: string; to: string }[];
  };
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  category?: string;
  order?: number;
}

export interface ProcessStepItem {
  id: string;
  n: string;
  title: string;
  text: string;
  order?: number;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  role: string;
}

export interface ArchitectureTier {
  id: string;
  label: string;
  nodes: ArchitectureNode[];
}

export interface SupportingStackGroup {
  id: string;
  group: string;
  items: string[];
}

export interface TechnologiesContent {
  technologies: Technology[];
  architecture: ArchitectureTier[];
  supportingStack: SupportingStackGroup[];
}

export interface PageSeoItem {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export type SeoSettings = Record<string, PageSeoItem>;

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: string;
  altText?: string;
}

export interface SectionMeta {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
  order: number;
  data: Record<string, unknown>;
}

export interface PageSectionsConfig {
  pageId: string;
  sections: SectionMeta[];
}
