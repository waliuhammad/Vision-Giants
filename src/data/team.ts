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
   * When ready, provide an image URL or local asset path (e.g. '/team/jalal-khan.jpg').
   */
  image?: string;
  socials?: TeamSocials;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'jalal-khan',
    name: 'Jalal Khan',
    role: 'Founder & CEO',
    bio: 'Visionary leader driving the company forward with a strong focus on innovation, quality software and long-term client success.',
    image: '/team/jalal-khan.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
      website: 'https://example.com',
    },
  },
  {
    id: 'laiba-khan',
    name: 'Laiba Khan',
    role: 'Marketing Lead',
    bio: 'Marketing expert specializing in digital strategy, brand building and growth campaigns for our software products and clients.',
    image: '/team/laiba-khan.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
    },
  },
  {
    id: 'rao-ali',
    name: 'Rao Ali',
    role: 'Project Manager',
    bio: 'Keeps projects on time and on budget, coordinating between clients and the development team with clear communication.',
    image: '/team/rao-ali.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://x.com',
    },
  },
  {
    id: 'm-ali-zafar',
    name: 'M Ali Zafar',
    role: 'Business Development Manager',
    bio: 'Builds client relationships and identifies new opportunities, turning ideas into long-term partnerships.',
    image: '/team/m-ali-zafar.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      website: 'https://example.com',
    },
  },
  {
    id: 'maryam',
    name: 'Maryam',
    role: 'Graphic Designer',
    bio: 'Creative designer crafting eye-catching visuals, branding and interfaces that make our products stand out.',
    image: '/team/maryam.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: 'amama-aziz',
    name: 'Amama Aziz',
    role: 'HR & Operations Manager',
    bio: 'Looks after people and processes, building a supportive culture and keeping daily operations running smoothly.',
    image: '/team/amama-aziz.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'amash-aziz',
    name: 'Amash Aziz',
    role: 'QA Engineer',
    bio: 'Detail-oriented tester ensuring every release is stable, secure and polished before it reaches our clients.',
    image: '/team/amash-aziz.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'mubasil',
    name: 'Mubasil',
    role: 'App Developer',
    bio: 'Mobile app developer building fast, smooth and user-friendly applications for Android and iOS.',
    image: '/team/mubasil.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'wali',
    name: 'Wali',
    role: 'Full Stack Developer',
    bio: 'Full stack developer delivering scalable web solutions from polished front-ends to robust back-end systems.',
    image: '/team/wali.jpg',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://x.com',
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
    { id: 'arc-1', name: 'Laiba Khan', role: 'Marketing Lead', image: '/team/laiba-khan.jpg', rotation: -30, offsetY: 70 },
    { id: 'arc-2', name: 'Rao Ali', role: 'Project Manager', image: '/team/rao-ali.jpg', rotation: -20, offsetY: 35 },
    { id: 'arc-3', name: 'Wali', role: 'Full Stack Developer', image: '/team/wali.jpg', rotation: -10, offsetY: 10 },
    { id: 'arc-4', name: 'Jalal Khan', role: 'Founder & CEO', image: '/team/jalal-khan.jpg', rotation: 0, offsetY: 0 },
    { id: 'arc-5', name: 'Mubasil', role: 'App Developer', image: '/team/mubasil.jpg', rotation: 10, offsetY: 10 },
    { id: 'arc-6', name: 'Maryam', role: 'Graphic Designer', image: '/team/maryam.jpg', rotation: 20, offsetY: 35 },
    { id: 'arc-7', name: 'M Ali Zafar', role: 'Business Development', image: '/team/m-ali-zafar.jpg', rotation: 30, offsetY: 70 },
  ];