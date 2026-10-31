export interface CoursesStat {
  icon: 'users' | 'trophy' | 'book' | 'building';
  value: string;
  label: string;
}

export interface CourseTopProgram {
  id: string;
  title: string;
  description: string;
  icon: 'code' | 'smartphone' | 'palette' | 'cloud' | 'sparkles' | 'book';
  accentColor: string;
  linkUrl?: string;
}

export interface StudentTestimonial {
  id: string;
  name: string;
  role: string;
  outcome: string;
  quote: string;
  photo: string;
}

export interface CoursesPageData {
  // Hero
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImage: string;
  heroExperienceBadgeYears: string;
  heroExperienceBadgeText: string;
  heroSocialProofCount: string;
  heroSocialProofText: string;

  // Stats Ribbon
  stats: CoursesStat[];

  // Top Programs / Courses (5 cards)
  programsEyebrow: string;
  programsHeading: string;
  programsViewAllText: string;
  programs: CourseTopProgram[];

  // Why Choose Us
  whyEyebrow: string;
  whyHeading: string;
  whyDescription: string;
  whyImage: string;
  whyBadge: string;
  whyChecklist: string[];
  whyCtaText: string;
  whyCtaLink: string;

  // Catalog Section Title
  catalogEyebrow: string;
  catalogHeading: string;
  catalogLead: string;

  // Student Testimonials
  testimonialsEyebrow: string;
  testimonialsHeading: string;
  testimonials: StudentTestimonial[];

  // Free Demo Class CTA Ribbon
  demoCtaHeading: string;
  demoCtaDescription: string;
  demoCtaButtonText: string;
}

export const defaultCoursesPageData: CoursesPageData = {
  heroEyebrow: 'SHAPE YOUR FUTURE',
  heroTitleLine1: 'Better Learning.',
  heroTitleLine2: 'Brighter Future.',
  heroDescription:
    'Expert guidance. Smart strategies. Personal attention. Master high-impact software engineering, modern cloud frameworks, and AI workflows with direct mentor support.',
  heroPrimaryCtaText: 'Explore Courses',
  heroPrimaryCtaLink: '#courses-catalog',
  heroSecondaryCtaText: 'Watch Video',
  heroSecondaryCtaLink: 'https://www.youtube.com',
  heroImage:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  heroExperienceBadgeYears: '20+',
  heroExperienceBadgeText: 'YEARS OF EXCELLENCE',
  heroSocialProofCount: '5000+',
  heroSocialProofText: 'Join 5000+ Successful Students & Alumni',

  stats: [
    { icon: 'users', value: '5000+', label: 'Students Enrolled' },
    { icon: 'trophy', value: '95%+', label: 'Success Rate' },
    { icon: 'book', value: '50+', label: 'Live Practical Modules' },
    { icon: 'building', value: '20+', label: 'Hiring Partners' },
  ],

  programsEyebrow: 'OUR PROGRAMS',
  programsHeading: 'Top Courses',
  programsViewAllText: 'View All Courses →',
  programs: [
    {
      id: 'p-1',
      title: 'Full-Stack Web Development',
      description: 'Comprehensive React, Next.js, Node.js & modern full-stack architectures.',
      icon: 'code',
      accentColor: '#2563eb',
      linkUrl: '#courses-catalog',
    },
    {
      id: 'p-2',
      title: 'Mobile App Development',
      description: 'Cross-platform mobile apps using Flutter & React Native with real backend APIs.',
      icon: 'smartphone',
      accentColor: '#10b981',
      linkUrl: '#courses-catalog',
    },
    {
      id: 'p-3',
      title: 'UI/UX & Product Design',
      description: 'Design systems, Figma wireframing, user research, and interactive prototyping.',
      icon: 'palette',
      accentColor: '#f59e0b',
      linkUrl: '#courses-catalog',
    },
    {
      id: 'p-4',
      title: 'Cloud & DevOps Engineering',
      description: 'Docker, Kubernetes, AWS infrastructure, and enterprise CI/CD automation.',
      icon: 'cloud',
      accentColor: '#8b5cf6',
      linkUrl: '#courses-catalog',
    },
    {
      id: 'p-5',
      title: 'AI & Python Automation',
      description: 'Hands-on Generative AI, LangChain, agentic tools, and Python workflows.',
      icon: 'sparkles',
      accentColor: '#06b6d4',
      linkUrl: '#courses-catalog',
    },
  ],

  whyEyebrow: 'WHY CHOOSE US',
  whyHeading: "We Don't Just Teach, We Build Futures",
  whyDescription:
    'At Vision Giants Academy, we believe every student is unique. Our expert mentors, real-world live projects, and personalized feedback guide you from absolute fundamentals to production-grade engineering mastery.',
  whyImage:
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
  whyBadge: '100% Personal Attention',
  whyChecklist: [
    'Experienced & Qualified Industry Practitioners',
    'Regular Live Projects & Code Review Assessments',
    'Personalized Attention & Dedicated 1-on-1 Mentorship',
    'Smart Online Classrooms & Flexible Learning Modes',
  ],
  whyCtaText: 'Know More About Us',
  whyCtaLink: '/about',

  catalogEyebrow: 'EXPLORE OUR CATALOG',
  catalogHeading: 'All Available Courses',
  catalogLead:
    'Choose from instructor-led live bootcamps, physical classroom programs, hybrid tracks, or self-paced video modules.',

  testimonialsEyebrow: 'STUDENT SUCCESS STORIES',
  testimonialsHeading: 'What Our Students Say',
  testimonials: [
    {
      id: 'test-1',
      name: 'Ananya Verma',
      role: 'Full Stack Engineer',
      outcome: 'Hired at Tech Corp',
      quote:
        'The guidance and hands-on code reviews I received here helped me land my dream engineering role. The mentors are always accessible!',
      photo:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'test-2',
      name: 'Rohit Gupta',
      role: 'Frontend Developer',
      outcome: 'Placement at FinTech Solutions',
      quote:
        'The practical curriculum and live production projects are unmatched. Best academy for anyone wanting real development confidence.',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'test-3',
      name: 'Sneha Patel',
      role: 'UI/UX Specialist',
      outcome: 'Top Performer & Alumni',
      quote:
        'Personal attention and structured design workshops helped me build a portfolio that stood out immediately to hiring managers.',
      photo:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
  ],

  demoCtaHeading: 'Book a Free Demo Class',
  demoCtaDescription:
    'Experience the best teaching, explore live code walkthroughs, and take the first step towards your tech career.',
  demoCtaButtonText: 'Book Now →',
};

export function coursesPageDataFromDoc(data: Record<string, unknown>): CoursesPageData {
  return {
    heroEyebrow: String(data.heroEyebrow || defaultCoursesPageData.heroEyebrow),
    heroTitleLine1: String(data.heroTitleLine1 || defaultCoursesPageData.heroTitleLine1),
    heroTitleLine2: String(data.heroTitleLine2 || defaultCoursesPageData.heroTitleLine2),
    heroDescription: String(data.heroDescription || defaultCoursesPageData.heroDescription),
    heroPrimaryCtaText: String(data.heroPrimaryCtaText || defaultCoursesPageData.heroPrimaryCtaText),
    heroPrimaryCtaLink: String(data.heroPrimaryCtaLink || defaultCoursesPageData.heroPrimaryCtaLink),
    heroSecondaryCtaText: String(data.heroSecondaryCtaText || defaultCoursesPageData.heroSecondaryCtaText),
    heroSecondaryCtaLink: String(data.heroSecondaryCtaLink || defaultCoursesPageData.heroSecondaryCtaLink),
    heroImage: String(data.heroImage || defaultCoursesPageData.heroImage),
    heroExperienceBadgeYears: String(data.heroExperienceBadgeYears || defaultCoursesPageData.heroExperienceBadgeYears),
    heroExperienceBadgeText: String(data.heroExperienceBadgeText || defaultCoursesPageData.heroExperienceBadgeText),
    heroSocialProofCount: String(data.heroSocialProofCount || defaultCoursesPageData.heroSocialProofCount),
    heroSocialProofText: String(data.heroSocialProofText || defaultCoursesPageData.heroSocialProofText),

    stats: Array.isArray(data.stats) && data.stats.length > 0 ? (data.stats as CoursesStat[]) : defaultCoursesPageData.stats,

    programsEyebrow: String(data.programsEyebrow || defaultCoursesPageData.programsEyebrow),
    programsHeading: String(data.programsHeading || defaultCoursesPageData.programsHeading),
    programsViewAllText: String(data.programsViewAllText || defaultCoursesPageData.programsViewAllText),
    programs: Array.isArray(data.programs) && data.programs.length > 0 ? (data.programs as CourseTopProgram[]) : defaultCoursesPageData.programs,

    whyEyebrow: String(data.whyEyebrow || defaultCoursesPageData.whyEyebrow),
    whyHeading: String(data.whyHeading || defaultCoursesPageData.whyHeading),
    whyDescription: String(data.whyDescription || defaultCoursesPageData.whyDescription),
    whyImage: String(data.whyImage || defaultCoursesPageData.whyImage),
    whyBadge: String(data.whyBadge || defaultCoursesPageData.whyBadge),
    whyChecklist:
      Array.isArray(data.whyChecklist) && data.whyChecklist.length > 0
        ? (data.whyChecklist as string[])
        : defaultCoursesPageData.whyChecklist,
    whyCtaText: String(data.whyCtaText || defaultCoursesPageData.whyCtaText),
    whyCtaLink: String(data.whyCtaLink || defaultCoursesPageData.whyCtaLink),

    catalogEyebrow: String(data.catalogEyebrow || defaultCoursesPageData.catalogEyebrow),
    catalogHeading: String(data.catalogHeading || defaultCoursesPageData.catalogHeading),
    catalogLead: String(data.catalogLead || defaultCoursesPageData.catalogLead),

    testimonialsEyebrow: String(data.testimonialsEyebrow || defaultCoursesPageData.testimonialsEyebrow),
    testimonialsHeading: String(data.testimonialsHeading || defaultCoursesPageData.testimonialsHeading),
    testimonials:
      Array.isArray(data.testimonials) && data.testimonials.length > 0
        ? (data.testimonials as StudentTestimonial[])
        : defaultCoursesPageData.testimonials,

    demoCtaHeading: String(data.demoCtaHeading || defaultCoursesPageData.demoCtaHeading),
    demoCtaDescription: String(data.demoCtaDescription || defaultCoursesPageData.demoCtaDescription),
    demoCtaButtonText: String(data.demoCtaButtonText || defaultCoursesPageData.demoCtaButtonText),
  };
}

