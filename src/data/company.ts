/**
 * Single source of truth for company identity and contact details.
 * Fields set to `null` are hidden across the site rather than faked.
 * The logo mark lives in public/logo-mark.png (favicon: public/favicon.png).
 */
export interface Company {
  /** Set to false once real branding has been entered. Gates Organization structured data. */
  isPlaceholder: boolean;
  name: string;
  /** Registered company name, used in the footer and structured data. */
  legalName: string;
  tagline: string;
  description: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  social: { label: string; href: string }[];
}

export const company: Company = {
  isPlaceholder: false,
  name: 'Vision Giants',
  legalName: 'Vision Giants Pvt Ltd',
  tagline: 'Software Development Studio',
  description:
    'We design and develop web applications, mobile apps and custom software that help businesses work better and grow.',
  email: null,
  phone: null,
  address: 'Chapter 2 Plaza, near Zavia School, Gulgasht, Multan, Pakistan',
  social: [],
};
