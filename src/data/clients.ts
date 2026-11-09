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
    id: 'direction-schools',
    name: 'Direction Schools',
    logo: '/images/clients/direction-schools.webp',
    industry: 'Education',
    order: 1,
    active: true,
  },
  {
    id: 'nsse',
    name: 'Nawaz Sharif School of Eminence',
    logo: '/images/clients/nsse.webp',
    industry: 'Education',
    order: 2,
    active: true,
  },
  {
    id: 'ai-brand-craft',
    name: 'AI Brand Craft',
    logo: '/images/clients/ai-brand-craft.webp',
    industry: 'Digital Marketing',
    order: 3,
    active: true,
  },
  {
    id: 'mii-marketing',
    name: 'MII Marketing Management',
    logo: '/images/clients/mii-marketing.webp',
    industry: 'Digital Agency',
    description: 'Strategic performance marketing and growth agency in the UK.',
    websiteUrl: 'https://miimarketing.co.uk',
    order: 4,
    active: true,
  },
  {
    id: 'alfarooqia-trust',
    name: 'Alfarooqia Trust',
    logo: '/images/clients/alfarooqia-trust.webp',
    industry: 'Non-Profit',
    order: 5,
    active: true,
  },
  {
    id: 'ai-marketing-builders',
    name: 'Ai Marketing & Builders',
    logo: '/images/clients/ai-marketing-builders.webp',
    industry: 'Real Estate & Construction',
    order: 6,
    active: true,
  },
  {
    id: 'b-brothers-mart',
    name: 'B. Brothers Mart',
    logo: '/images/clients/b-brothers-mart.webp',
    industry: 'Retail',
    order: 7,
    active: true,
  },
  {
    id: 'alexa-movers',
    name: 'Alexa Movers',
    logo: '/images/clients/alexa-movers.webp',
    industry: 'Logistics & Moving Services',
    description: 'Leading residential and corporate relocation service in Dubai.',
    websiteUrl: 'https://alexamover.com',
    order: 8,
    active: true,
  },
  {
    id: 'sportif-padel',
    name: 'Sportif Padel',
    logo: '/images/clients/sportif-padel.webp',
    industry: 'Sports & E-Commerce',
    description: 'Premier padel sports equipment provider in the UAE.',
    websiteUrl: 'https://sportifpadel.com',
    order: 9,
    active: true,
  },
  {
    id: 'servo-motor-oil',
    name: 'Servo Motor-Oil',
    logo: '/images/clients/servo-motor-oil.webp',
    industry: 'Automotive Lubricants',
    order: 10,
    active: true,
  },
  {
    id: 'chicago-group',
    name: 'Chicago Group',
    logo: '/images/clients/chicago-group.webp',
    industry: 'Business Group',
    order: 11,
    active: true,
  },
  {
    id: 'she-rose',
    name: 'She Rose',
    logo: '/images/clients/she-rose.webp',
    industry: 'Retail',
    order: 12,
    active: true,
  },
  {
    id: 'gradify-consultant',
    name: 'Gradify Consultant',
    logo: '/images/clients/gradify-consultant.webp',
    industry: 'Education Consultancy',
    order: 13,
    active: true,
  },
  {
    id: 'pny-trainings',
    name: 'PNY Trainings',
    logo: '/images/clients/pny-trainings.webp',
    industry: 'Training & Education',
    order: 14,
    active: true,
  },
  {
    id: 'al-qaswa-foods',
    name: 'Al-Qaswa Foods',
    logo: '/images/clients/al-qaswa-foods.webp',
    industry: 'Food',
    order: 15,
    active: true,
  },
  {
    id: 'national-agro-solutions',
    name: 'National Agro Solutions',
    logo: '/images/clients/national-agro-solutions.webp',
    industry: 'Agriculture',
    order: 16,
    active: true,
  },
  {
    id: 'j',
    name: 'J',
    logo: '/images/clients/j.webp',
    industry: 'Technology',
    order: 17,
    active: true,
  },
];
