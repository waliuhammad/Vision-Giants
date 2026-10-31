export interface NavItem {
  label: string;
  to: string;
}

/** Header navigation: the main visitor journeys in the exact requested order. */
export const mainNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about/' },
  { label: 'Services', to: '/services/' },
  { label: 'Blog', to: '/blog/' },
  { label: 'Careers', to: '/careers/' },
  { label: 'Courses', to: '/courses/' },
];

/** Footer "Company" column: secondary pages plus key site links. */
export const footerCompanyNav: NavItem[] = [
  { label: 'About Us', to: '/about/' },
  { label: 'Our Team', to: '/team/' },
  { label: 'Careers', to: '/careers/' },
  { label: 'Courses', to: '/courses/' },
  { label: 'Blog', to: '/blog/' },
  { label: 'Technologies', to: '/technologies/' },
];

export const primaryCta: NavItem = { label: 'Contact', to: '/contact/' };
