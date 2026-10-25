export interface TeamSocials {
  linkedin?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  /**
   * Leave empty or undefined for the clean placeholder avatar.
   * When ready, provide an image URL or local asset path (e.g. '/team/lisa.jpg').
   */
  image?: string;
  socials?: TeamSocials;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'lisa-thompson',
    name: 'Lisa Thompson',
    role: 'Customer Success Manager',
    bio: 'Dedicated to ensuring customer satisfaction and success, with a proactive approach to client support and retention.',
    socials: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'laura-davis',
    name: 'Laura Davis',
    role: 'COO',
    bio: 'Operations specialist with a background in scaling startups, ensuring smooth and efficient company operations.',
    socials: {
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
  },
  {
    id: 'tom-white',
    name: 'Tom White',
    role: 'Head of Product',
    bio: 'Passionate product manager focused on delivering user-centric solutions that meet market needs.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      website: 'https://example.com',
    },
  },
  {
    id: 'james-wilson',
    name: 'James Wilson',
    role: 'CTO',
    bio: 'Technical guru with a passion for developing scalable and secure cloud-based applications.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
    },
  },
  {
    id: 'sarah-williams',
    name: 'Sarah Williams',
    role: 'Director of Sales',
    bio: 'Sales strategist with a proven track record of expanding market reach and driving revenue growth.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'david-miller',
    name: 'David Miller',
    role: 'Lead Software Engineer',
    bio: 'Senior developer with a knack for building robust software architectures and mentoring engineering teams.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      website: 'https://example.com',
    },
  },
  {
    id: 'emily-johnson',
    name: 'Emily Johnson',
    role: 'Marketing',
    bio: 'Marketing expert specializing in digital strategies and brand growth for SaaS products.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'jillie-bernard',
    name: 'Jillie Bernard',
    role: 'Founder & CEO',
    bio: 'Visionary leader with over 15 years of experience in the tech industry, driving innovative SaaS solutions.',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      website: 'https://example.com',
    },
  },
];

/** Members featured in the hero arc fan */
export const heroArcMembers: {
  id: string;
  name: string;
  role: string;
  image?: string;
  rotation: number;
  offsetY: number;
}[] = [
  { id: 'arc-1', name: 'Laura Davis', role: 'COO', rotation: -30, offsetY: 70 },
  { id: 'arc-2', name: 'Lisa Thompson', role: 'Customer Success', rotation: -20, offsetY: 35 },
  { id: 'arc-3', name: 'Tom White', role: 'Head of Product', rotation: -10, offsetY: 10 },
  { id: 'arc-4', name: 'Jillie Bernard', role: 'Founder & CEO', rotation: 0, offsetY: 0 },
  { id: 'arc-5', name: 'James Wilson', role: 'CTO', rotation: 10, offsetY: 10 },
  { id: 'arc-6', name: 'David Miller', role: 'Lead Engineer', rotation: 20, offsetY: 35 },
  { id: 'arc-7', name: 'Sarah Williams', role: 'Director of Sales', rotation: 30, offsetY: 70 },
];
