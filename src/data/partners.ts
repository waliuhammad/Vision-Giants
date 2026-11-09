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
  {
    id: 'code-noor',
    name: 'Code Noor',
    type: 'Software Development & Technology',
    description: 'Our Spain-based software house partner, collaborating to deliver innovative software development and technology solutions.',
    logo: '',
    website: '',
  },
  {
    id: 'vision-giants-learning',
    name: 'Vision Giants Learning',
    type: 'IT Training & Education',
    description: 'Our learning and training partner, focused on empowering individuals with practical IT skills, technical knowledge, and professional development.',
    logo: '',
    website: '',
  },
];