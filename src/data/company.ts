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
  /** `placeholder` links are shown but left out of search-engine data until replaced. */
  social: { label: string; href: string; placeholder?: boolean }[];
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
  // PLACEHOLDERS: replace each href with the real profile/number/address, then delete `placeholder: true`.
  // WhatsApp format: https://wa.me/923001234567 (country code + number, digits only).
  social: [
    { label: 'WhatsApp', href: 'https://wa.me/', placeholder: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', placeholder: true },
    { label: 'Instagram', href: 'https://www.instagram.com/', placeholder: true },
    { label: 'Email', href: 'mailto:', placeholder: true },
  ],
};
