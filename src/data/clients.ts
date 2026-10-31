export interface ClientItem {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  description?: string;
  websiteUrl?: string;
  order: number;
  active: boolean;
}

/**
 * Authentic clients who have trusted Vision Giants with digital solutions.
 * Verified real client relationships derived from actual deployed projects.
 */
export const defaultClients: ClientItem[] = [
  {
    id: 'sportif-padel',
    name: 'Sportif Padel',
    logo: '/portfolio/sportif-padel/1.webp',
    industry: 'Sports & E-Commerce',
    description: 'Premier padel sports equipment provider in the UAE.',
    websiteUrl: 'https://sportifpadel.com',
    order: 1,
    active: true,
  },
  {
    id: 'alexa-movers',
    name: 'Alexa Movers',
    logo: '/portfolio/alexa-movers/1.webp',
    industry: 'Logistics & Moving Services',
    description: 'Leading residential and corporate relocation service in Dubai.',
    websiteUrl: 'https://alexamover.com',
    order: 2,
    active: true,
  },
  {
    id: 'apppanda',
    name: 'AppPanda',
    logo: '/portfolio/apppanda/1.webp',
    industry: 'Mobile App Publishing',
    description: 'Digital utility and mobile app development showcase.',
    websiteUrl: 'https://apppanda.org',
    order: 3,
    active: true,
  },
  {
    id: 'derma-muse',
    name: 'Derma Muse',
    logo: '/portfolio/derma-muse/1.webp',
    industry: 'Health & Skincare',
    description: 'Cosmetics and personalized skincare online store in the UK.',
    websiteUrl: 'https://dermamuse.co.uk',
    order: 4,
    active: true,
  },
  {
    id: 'mae-rose-jewels',
    name: 'Mae Rose Jewels',
    logo: '/portfolio/mae-rose-jewels/1.webp',
    industry: 'Luxury Jewelry',
    description: 'Handcrafted fine jewelry brand in the United States.',
    websiteUrl: 'https://maerosejewels.com',
    order: 5,
    active: true,
  },
  {
    id: 'mii-marketing',
    name: 'MII Marketing',
    logo: '/portfolio/mii-marketing/1.webp',
    industry: 'Digital Agency',
    description: 'Strategic performance marketing and growth agency in the UK.',
    websiteUrl: 'https://miimarketing.co.uk',
    order: 6,
    active: true,
  },
  {
    id: 'petlife-bio',
    name: 'PetLife Bio',
    logo: '/portfolio/petlife-bio/1.webp',
    industry: 'Veterinary & Pet Care',
    description: 'Specialized organic pet wellness supplements and products.',
    websiteUrl: 'https://petlifebio.com',
    order: 7,
    active: true,
  },
  {
    id: 'tern-technologies',
    name: 'Tern Technologies',
    logo: '/portfolio/tern-technologies/1.webp',
    industry: 'IT & Cloud Services',
    description: 'Enterprise IT infrastructure, security, and cloud consultancy.',
    websiteUrl: 'https://terntechnologies.net',
    order: 8,
    active: true,
  },
  {
    id: 'toyland',
    name: 'Toyland',
    logo: '/portfolio/toyland/1.webp',
    industry: 'Retail & Toys',
    description: 'Educational toys and entertainment for children.',
    websiteUrl: 'https://toyland.pk',
    order: 9,
    active: true,
  },
  {
    id: 'visionary-it',
    name: 'Visionary IT',
    logo: '/portfolio/visionary-it/1.webp',
    industry: 'Software & Technology',
    description: 'Enterprise software development and digital transformation.',
    websiteUrl: 'https://visionaryitsolutions.com',
    order: 10,
    active: true,
  },
];

