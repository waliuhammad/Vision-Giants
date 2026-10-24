/**
 * Single source of truth for company identity and contact details.
 *
 * ⚠ TEMPORARY BRANDING: no company name, logo or contact details were supplied.
 * Replace the values below (and public/favicon.svg / src/components/layout/Logo.tsx)
 * before publishing. Fields set to `null` are hidden across the site rather than faked.
 */
export interface Company {
  /** Set to false once real branding has been entered. Gates Organization structured data. */
  isPlaceholder: boolean;
  name: string;
  tagline: string;
  description: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  social: { label: string; href: string }[];
}

export const company: Company = {
  isPlaceholder: true,
  name: 'Your Company',
  tagline: 'Software House',
  description:
    'We design and develop web applications, mobile apps and custom software that help businesses work better and grow.',
  email: null,
  phone: null,
  address: null,
  social: [],
};
