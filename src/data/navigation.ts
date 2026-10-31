export interface NavItem {
  label: string;
  to: string;
}

/** Header navigation: the main visitor journeys. Secondary pages live in the footer. */
export const mainNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services/' },
  { label: 'About', to: '/about/' },
  { label: 'Blog', to: '/blog/' },
];

/** Footer "Company" column: secondary pages not in the header, plus About and Blog. */
export const footerCompanyNav: NavItem[] = [
  { label: 'About Us', to: '/about/' },
  { label: 'Our Team', to: '/team/' },
  { label: 'Careers', to: '/careers/' },
  { label: 'Blog', to: '/blog/' },
  { label: 'Technologies', to: '/technologies/' },
];

export const primaryCta: NavItem = { label: 'Contact', to: '/contact/' };
