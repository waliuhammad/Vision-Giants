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
  /** Contact numbers as displayed, in local format (e.g. 0308 0058600). Empty to hide. */
  phones: string[];
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
  phones: ['0308 0058600', '0317 6572690'],
  address: 'Chapter 2 Plaza, near Zavia School, Gulgasht, Multan, Pakistan',
  // WhatsApp format: https://wa.me/923001234567 (country code + number, digits only).
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/vision-giants/' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/1KKtHY6Huo/' },
    { label: 'Instagram', href: 'https://www.instagram.com/visiongiants/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@vision.giants' },
  ],
};

/** tel: link for a Pakistani number in local format: "0308 0058600" -> "tel:+923080058600". */
export const telHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `tel:${digits.startsWith('0') ? `+92${digits.slice(1)}` : `+${digits}`}`;
};
