
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
  role?: string;
  bio?: string;
  image?: string;
  socials?: TeamSocials;
}

export const teamMembers: TeamMember[] = [
  // 1. Founder & CEO
  {
    id: 'jalal-khan',
    name: 'Jalal Khan',
    role: 'Founder & CEO',
    bio: 'Visionary leader driving the company forward with a strong focus on innovation, quality software and long-term client success.',
    image: '/team/jalal-khan.jpg',
  },

  // 2. New Member
  {
    id: 'muhammad-ismail',
    name: 'Muhammad Ismail',
    image: '/team/muhammad-ismail.jpg',
  },
  // 3. New Member

  // Previous Team Members
  {
    id: 'laiba-khan',
    name: 'Laiba Khan',
    image: '/team/laiba-khan.jpg',
  },


  // 5. New Member
  {
    id: 'muhib-ul-allah',
    name: 'Muhib ul Allah',
    image: '/team/muhib-ul-allah.jpg',
  },


  {
    id: 'rao-ali',
    name: 'Rao Ali',
    image: '/team/rao-ali.jpg',
  },
  {
    id: 'm-ali-zafar',
    name: 'M Ali Zafar',
    image: '/team/m-ali-zafar.jpg',
  },
  {
    id: 'maryam',
    name: 'Maryam',
    image: '/team/maryam.jpg',
  },
  {
    id: 'amama-aziz',
    name: 'Amama Aziz',
    image: '/team/amama-aziz.jpg',
  },
  {
    id: 'amash-aziz',
    name: 'Amash Aziz',
    image: '/team/amash-aziz.jpg',
  },
  {
    id: 'mubasil',
    name: 'Mubasil',
    image: '/team/mubasil.jpg',
  },

  // 4. New Member
  {
    id: 'hamza',
    name: 'Hamza',
    image: '/team/hamza.jpg',
  },
  {
    id: 'wali',
    name: 'Wali',
    image: '/team/wali.jpg',
  },
];

/** Members featured in the hero arc fan */
export const heroArcMembers: {
  id: string;
  name: string;
  role?: string;
  image?: string;
  rotation: number;
  offsetY: number;
}[] = [
    {
      id: 'arc-1',
      name: 'Muhib ul Allah',
      image: '/team/muhib-ul-allah.jpg',
      rotation: -30,
      offsetY: 70,
    },
    {
      id: 'arc-2',
      name: 'Muhammad Ismail',
      image: '/team/muhammad-ismail.jpg',
      rotation: -20,
      offsetY: 35,
    },
    {
      id: 'arc-3',
      name: 'Laiba Khan',
      image: '/team/laiba-khan.jpg',
      rotation: -10,
      offsetY: 10,
    },
    {
      id: 'arc-4',
      name: 'Jalal Khan',
      role: 'Founder & CEO',
      image: '/team/jalal-khan.jpg',
      rotation: 0,
      offsetY: 0,
    },
    {
      id: 'arc-5',
      name: 'Hamza',
      image: '/team/hamza.jpg',
      rotation: 10,
      offsetY: 10,
    },
    {
      id: 'arc-6',
      name: 'Rao Ali',
      image: '/team/rao-ali.jpg',
      rotation: 20,
      offsetY: 35,
    },
    {
      id: 'arc-7',
      name: 'Wali',
      image: '/team/wali.jpg',
      rotation: 30,
      offsetY: 70,
    },
  ];
