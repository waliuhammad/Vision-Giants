export interface NavItem {
  label: string;
  to: string;
}

export const mainNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services/' },
  { label: 'Portfolio', to: '/portfolio/' },
  { label: 'About', to: '/about/' },
  { label: 'Technologies', to: '/technologies/' },
  { label: 'Careers', to: '/careers/' },
  { label: 'Contact', to: '/contact/' },
];

export const primaryCta: NavItem = { label: 'Start a Project', to: '/contact/' };
