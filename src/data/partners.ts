export interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  type?: string;
}

export const partners: Partner[] = [
  {
    id: 'future-ai-skills',
    name: 'Future AI Skills',
    type: 'Training & AI Education',
    description: 'Our training partner, empowering learners with practical AI and tech skills.',
    logo: '/partners/future-ai-skills.svg',
    website: '',
  },
  {
    id: 'j-electronics',
    name: 'J Electronics',
    type: 'Electronics E-Commerce',
    description: 'Our e-commerce partner, delivering quality electronics online.',
    logo: '/partners/j-electronics.png',
    website: 'https://www.jelectronics.store/',
  },
];

