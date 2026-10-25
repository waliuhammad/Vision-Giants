export interface NavItem {
  label: string;
  to: string;
}

/** Header navigation (matches the brand site). "Services" opens a menu of the managed services. */
export const mainNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about/' },
  { label: 'Services', to: '/services/' },
  { label: 'Portfolio', to: '/portfolio/' },
  { label: 'Team', to: '/team/' },
  { label: 'Blog', to: '/blog/' },
  { label: 'Careers', to: '/careers/' },
];

/** Extra links shown at the bottom of the Services menu. */
export const servicesMenuExtras: NavItem[] = [
  { label: 'All services', to: '/services/' },
  { label: 'Technologies', to: '/technologies/' },
];

/** Every public page, for the footer. */
export const footerNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services/' },
  { label: 'Portfolio', to: '/portfolio/' },
  { label: 'About', to: '/about/' },
  { label: 'Technologies', to: '/technologies/' },
  { label: 'Careers', to: '/careers/' },
  { label: 'Contact', to: '/contact/' },
];

export const primaryCta: NavItem = { label: 'Contact', to: '/contact/' };
