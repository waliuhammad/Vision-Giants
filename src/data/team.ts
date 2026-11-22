
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

  // 2. Member (Title pending owner confirmation)
  {
    id: 'muhammad-ismail',
    name: 'Muhammad Ismail',
    role: '',
    image: '/team/muhammad-ismail.jpg',
  },

  // 3. Member (Title pending owner confirmation)
  {
    id: 'laiba-khan',
    name: 'Laiba Khan',
    role: '',
    image: '/team/laiba-khan.jpg',
  },

  // 4. Member (Title pending owner confirmation)
  {
    id: 'muhib-ul-allah',
    name: 'Muhib ul Allah',
    role: '',
    image: '/team/muhib-ul-allah.jpg',
  },

  // 5. Member (Title pending owner confirmation)
  {
    id: 'rao-ali',
    name: 'Rao Ali',
    role: '',
    image: '/team/rao-ali.jpg',
  },

  // 6. Member (Title pending owner confirmation)
  {
    id: 'm-ali-zafar',
    name: 'M Ali Zafar',
    role: '',
    image: '/team/m-ali-zafar.jpg',
  },

  // 7. Member (Title pending owner confirmation)
  {
    id: 'maryam',
    name: 'Maryam',
    role: '',
    image: '/team/maryam.jpg',
  },

  // 8. Member (Title pending owner confirmation)
  {
    id: 'amama-aziz',
    name: 'Amama Aziz',
    role: '',
    image: '/team/amama-aziz.jpg',
  },

  // 9. Member (Title pending owner confirmation)
  {
    id: 'amash-aziz',
    name: 'Amash Aziz',
    role: '',
    image: '/team/amash-aziz.jpg',
  },

  // 10. Member (Title pending owner confirmation)
  {
    id: 'mubasil',
    name: 'Mubasil',
    role: '',
    image: '/team/mubasil.jpg',
  },

  // 11. Member (Title pending owner confirmation)
  {
    id: 'hamza',
    name: 'Hamza',
    role: '',
    image: '/team/hamza.jpg',
  },

  // 12. Member (Title pending owner confirmation)
  {
    id: 'wali',
    name: 'Wali',
    role: '',
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
