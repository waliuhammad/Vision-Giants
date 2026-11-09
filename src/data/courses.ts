export type LearningMode = 'online' | 'onsite' | 'hybrid' | 'selfPaced';

export interface OnlineModeConfig {
  enabled: boolean;
  fee: string;
  schedule?: string;
  timings?: string;
  timeZone?: string;
  platform?: string;
  format?: 'live' | 'recorded' | 'both';
}

export interface OnsiteModeConfig {
  enabled: boolean;
  fee: string;
  schedule?: string;
  timings?: string;
  campusName?: string;
  campusAddress?: string;
  city?: string;
  availableSeats?: number;
}

export interface HybridModeConfig {
  enabled: boolean;
  fee: string;
  schedule?: string;
  onlineSchedule?: string;
  onsiteSchedule?: string;
  campusLocation?: string;
  sessionBreakdown?: string;
}

export interface SelfPacedModeConfig {
  enabled: boolean;
  fee: string;
  accessDuration?: string;
  recordedLessonsCount?: number;
  learningResources?: string;
  assessmentDetails?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  lessons: string[];
}

export interface CourseFaq {
  question: string;
  answer: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  order: number;
  active: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  photo?: string;
  designation: string;
  experience: string;
  skills: string[];
  bio: string;
  linkedinUrl?: string;
  email?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  introduction: string;
  description: string;
  thumbnail?: string;
  category: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  prerequisites: string[];
  learningOutcomes: string[];
  modules: CourseModule[];
  instructorId?: string;
  practicalProjects: string[];
  certificateOffered: boolean;
  certificateDetails?: string;
  faqs: CourseFaq[];
  displayOrder: number;
  published: boolean;
  modes: {
    online: OnlineModeConfig;
    onsite: OnsiteModeConfig;
    hybrid: HybridModeConfig;
    selfPaced: SelfPacedModeConfig;
  };
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  fullName: string;
  email: string;
  phone: string;
  learningMode: LearningMode;
  preferredBatch: string;
  city: string;
  education: string;
  message?: string;
  classTiming?: string;
  timeZone?: string;
  preferredCampus?: string;
  hybridPreference?: string;
  status: 'new_inquiry' | 'contacted' | 'pending' | 'confirmed' | 'enrolled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
}

export const defaultCourseCategories: CourseCategory[] = [
  // New categories (shown first)
  { id: 'website-development', name: 'Website Development', slug: 'website-development', description: 'Design, build and launch professional business websites with HTML, CSS, JavaScript and WordPress.', order: 1, active: true },
  { id: 'ecommerce', name: 'E-Commerce', slug: 'ecommerce', description: 'Start and scale online stores on Amazon, eBay, Daraz and TikTok Shop.', order: 2, active: true },
  { id: 'graphic-video', name: 'Graphic Design & Video Editing', slug: 'graphic-video', description: 'Professional graphic design, branding and video editing for social media and clients.', order: 3, active: true },
  { id: 'social-media-marketing', name: 'Social Media Marketing', slug: 'social-media-marketing', description: 'Grow brands with content strategy, paid ads and analytics on every major social platform.', order: 4, active: true },
  // Existing categories
  { id: 'full-stack', name: 'Full Stack Development', slug: 'full-stack', description: 'End-to-end modern web applications from frontend to database.', order: 5, active: true },
  { id: 'frontend', name: 'Frontend Development', slug: 'frontend', description: 'Interactive, responsive user interfaces with React, Next.js, and CSS.', order: 6, active: true },
  { id: 'mobile', name: 'Mobile App Development', slug: 'mobile', description: 'Cross-platform iOS and Android apps using Flutter and React Native.', order: 7, active: true },
  { id: 'ui-ux', name: 'UI/UX Design', slug: 'ui-ux', description: 'User-centric product design, prototyping, and modern design systems.', order: 8, active: true },
  { id: 'python-ai', name: 'Python & AI Engineering', slug: 'python-ai', description: 'Python programming, machine learning, and generative AI models.', order: 9, active: true },
  { id: 'digital-marketing', name: 'Digital Marketing & SEO', slug: 'digital-marketing', description: 'Data-driven growth, search engine optimization, and brand campaigns.', order: 10, active: true },
];

export const defaultInstructors: Instructor[] = [
  {
    id: 'muhammad-rayan',
    name: 'Muhammad Rayan Masood',
    photo: '',
    designation: 'Principal Software Engineer & Lead Instructor',
    experience: '6+ Years Experience',
    skills: ['Full Stack Web', 'React', 'Node.js', 'System Architecture', 'Cloud Services'],
    bio: 'Lead software architect specializing in scalable distributed web systems and production applications.',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    id: 'ali-hassan',
    name: 'Ali Hassan',
    photo: '',
    designation: 'Senior Mobile Application Architect',
    experience: '5+ Years Experience',
    skills: ['Flutter', 'React Native', 'Mobile Architecture', 'iOS & Android App Store'],
    bio: 'Mobile architect with over a dozen successful apps published on Google Play and Apple App Store.',
    linkedinUrl: 'https://linkedin.com',
  },
  {
    id: 'zainab-fatima',
    name: 'Zainab Fatima',
    photo: '',
    designation: 'Lead UI/UX & Product Design Mentor',
    experience: '4+ Years Experience',
    skills: ['Figma', 'Design Systems', 'User Research', 'Interactive Prototyping'],
    bio: 'Product designer passionate about accessibility, micro-interactions, and design systems for enterprise software.',
    linkedinUrl: 'https://linkedin.com',
  },
];

export const defaultCourses: Course[] = [
  // ───────────────────────── NEW COURSES (shown first) ─────────────────────────
  {
    id: 'website-development',
    slug: 'website-development',
    title: 'Professional Website Development',
    introduction: 'Learn to design, build and launch fast, responsive business websites with HTML, CSS, JavaScript and WordPress.',
    description: 'A beginner-friendly, project-based course that takes you from zero to building and publishing real websites for clients. You will learn modern front-end fundamentals, build responsive layouts, create dynamic websites with WordPress, optimize for speed and SEO, and learn how to deploy on live hosting with a custom domain and SSL.',
    thumbnail: '',
    category: 'Website Development',
    skillLevel: 'Beginner',
    duration: '10 Weeks (2.5 Months)',
    prerequisites: ['Basic computer and internet skills.', 'No prior coding experience required.'],
    learningOutcomes: [
      'Build responsive, mobile-friendly websites using HTML5, CSS3 and JavaScript.',
      'Create and customize professional WordPress websites without heavy coding.',
      'Apply basic on-page SEO, performance optimization and accessibility practices.',
      'Deploy websites to live hosting with a custom domain and SSL certificate.',
      'Deliver complete website projects to clients and start freelancing.',
    ],
    modules: [
      {
        id: 'w1',
        title: 'Module 1: HTML5 & CSS3 Foundations',
        description: 'Page structure, semantic markup, styling, Flexbox and CSS Grid.',
        lessons: ['HTML5 Structure & Semantic Tags', 'CSS Styling, Flexbox & Grid Layouts', 'Responsive Design & Media Queries'],
      },
      {
        id: 'w2',
        title: 'Module 2: JavaScript for Interactive Websites',
        description: 'Add interactivity, forms and dynamic behavior to your pages.',
        lessons: ['JavaScript Basics & DOM Manipulation', 'Forms, Validation & Events', 'Working with APIs & Sliders'],
      },
      {
        id: 'w3',
        title: 'Module 3: WordPress Website Building',
        description: 'Themes, page builders, plugins and business website setup.',
        lessons: ['WordPress Setup, Themes & Page Builders', 'Business, Portfolio & Blog Websites', 'Plugins, Contact Forms & Security'],
      },
      {
        id: 'w4',
        title: 'Module 4: Hosting, SEO & Freelancing',
        description: 'Go live, optimize and start getting clients.',
        lessons: ['Domain, Hosting & SSL Setup', 'On-Page SEO & Speed Optimization', 'Freelancing, Client Handling & Portfolio Building'],
      },
    ],
    practicalProjects: [
      'Responsive Business Website with contact and inquiry forms.',
      'Personal Portfolio Website deployed on a live domain.',
      'WordPress Company Website with blog and services pages.',
    ],
    certificateOffered: true,
    certificateDetails: 'Certificate of Completion in Professional Website Development.',
    faqs: [
      { question: 'Do I need coding experience to join?', answer: 'No. The course starts from the very basics and builds step by step with hands-on practice.' },
      { question: 'Will I build real websites?', answer: 'Yes. You will build and publish multiple real websites, including a portfolio you can show to clients and employers.' },
      { question: 'How is this different from the Full Stack course?', answer: 'This course focuses on building and launching websites quickly (HTML, CSS, JavaScript and WordPress). The Full Stack course covers advanced React, backend and databases.' },
    ],
    displayOrder: 1,
    published: true,
    modes: {
      online: {
        enabled: true,
        fee: 'PKR 25,000',
        schedule: 'Mon, Wed, Fri',
        timings: '7:00 PM - 9:00 PM (PKT)',
        timeZone: 'GMT+5',
        platform: 'Google Meet / Zoom & WhatsApp Community',
        format: 'live',
      },
      onsite: {
        enabled: true,
        fee: 'PKR 30,000',
        schedule: 'Tue, Thu, Sat',
        timings: '4:00 PM - 6:30 PM (PKT)',
        campusName: 'Vision Giants Innovation Center',
        campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
        city: 'Lahore',
        availableSeats: 25,
      },
      hybrid: {
        enabled: true,
        fee: 'PKR 28,000',
        schedule: 'Online Weekdays + Onsite Weekend Lab',
        onlineSchedule: 'Mon, Wed (Online 7:00 PM - 9:00 PM)',
        onsiteSchedule: 'Saturday (Campus Lab 3:00 PM - 6:00 PM)',
        campusLocation: 'Gulberg III Campus, Lahore',
        sessionBreakdown: '60% Live Online Classes + 40% Practical Campus Lab Sessions',
      },
      selfPaced: {
        enabled: true,
        fee: 'PKR 15,000',
        accessDuration: '12 Months Access',
        recordedLessonsCount: 45,
        learningResources: 'Recorded lessons, project source files, practice tasks and community support.',
        assessmentDetails: 'Final website project reviewed by a mentor.',
      },
    },
  },
  {
    id: 'ecommerce-amazon-ebay-daraz-tiktok-shop',
    slug: 'ecommerce-amazon-ebay-daraz-tiktok-shop',
    title: 'E-Commerce Mastery: Amazon, eBay, Daraz & TikTok Shop',
    introduction: 'Learn how to start, manage and scale an online business on the biggest e-commerce marketplaces.',
    description: 'A practical, step-by-step e-commerce program covering the complete seller journey: product research, supplier sourcing, account setup, listing optimization, order management, customer service and marketing. Learn how to sell on Amazon, eBay, Daraz and TikTok Shop, and build a repeatable system for profitable online sales.',
    thumbnail: '',
    category: 'E-Commerce',
    skillLevel: 'Beginner',
    duration: '12 Weeks (3 Months)',
    prerequisites: ['Basic computer and internet skills.', 'No prior e-commerce experience required.'],
    learningOutcomes: [
      'Find profitable products using proven research methods and tools.',
      'Set up seller accounts and stores on Amazon, eBay, Daraz and TikTok Shop.',
      'Create optimized product listings with strong titles, images and descriptions.',
      'Manage inventory, orders, shipping, returns and customer messages.',
      'Promote products with ads and short-form content to increase sales.',
    ],
    modules: [
      {
        id: 'e1',
        title: 'Module 1: E-Commerce Fundamentals & Product Research',
        description: 'Business models, niche selection, product research and supplier sourcing.',
        lessons: ['E-Commerce Business Models (Private Label, Wholesale, Dropshipping)', 'Product & Niche Research Techniques', 'Supplier Sourcing, Pricing & Profit Calculation'],
      },
      {
        id: 'e2',
        title: 'Module 2: Amazon & eBay Selling',
        description: 'Account setup, listings, fulfillment and growth on Amazon and eBay.',
        lessons: ['Amazon Seller Account Setup & Listing Creation', 'Keyword Research & Listing Optimization', 'eBay Store Setup, Listings & Order Handling'],
      },
      {
        id: 'e3',
        title: 'Module 3: Daraz & TikTok Shop',
        description: 'Local marketplace selling and social commerce with short-form content.',
        lessons: ['Daraz Seller Center, Product Uploading & Campaigns', 'TikTok Shop Setup & Product Listings', 'Short-Video & Live Selling Content Strategy'],
      },
      {
        id: 'e4',
        title: 'Module 4: Marketing, Operations & Scaling',
        description: 'Ads, customer service, analytics and building a scalable business.',
        lessons: ['Marketplace Ads & Promotions', 'Order Management, Shipping, Returns & Customer Service', 'Analytics, Scaling & Account Health'],
      },
    ],
    practicalProjects: [
      'Complete product research report with profit calculation for a chosen niche.',
      'Fully optimized product listings prepared for Amazon, eBay and Daraz.',
      'TikTok Shop content plan with sample short-video scripts.',
    ],
    certificateOffered: true,
    certificateDetails: 'Certificate of Completion in E-Commerce Marketplace Management.',
    faqs: [
      { question: 'Do I need money to start selling after the course?', answer: 'Some models, such as dropshipping, need very low starting capital. The course explains the cost and risk of each model so you can choose what suits you.' },
      { question: 'Can I sell from Pakistan on all these platforms?', answer: 'Marketplace policies and supported countries can change. The instructors guide you on the current requirements, payment options and workarounds for each platform during the course.' },
      { question: 'Will the course guarantee sales?', answer: 'No course can guarantee sales. You will learn proven methods and practice them with real examples, but results depend on your effort, product choice and market.' },
    ],
    displayOrder: 2,
    published: true,
    modes: {
      online: {
        enabled: true,
        fee: 'PKR 30,000',
        schedule: 'Tue, Thu, Sat',
        timings: '8:00 PM - 10:00 PM (PKT)',
        timeZone: 'GMT+5',
        platform: 'Google Meet / Zoom & WhatsApp Community',
        format: 'live',
      },
      onsite: {
        enabled: true,
        fee: 'PKR 35,000',
        schedule: 'Mon, Wed, Fri',
        timings: '4:00 PM - 6:30 PM (PKT)',
        campusName: 'Vision Giants Innovation Center',
        campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
        city: 'Lahore',
        availableSeats: 25,
      },
      hybrid: {
        enabled: true,
        fee: 'PKR 32,000',
        schedule: 'Online Lectures + Onsite Practical Workshops',
        onlineSchedule: 'Tue, Thu (Online 8:00 PM - 10:00 PM)',
        onsiteSchedule: 'Sunday (Campus Workshop 12:00 PM - 4:00 PM)',
        campusLocation: 'Gulberg III Campus, Lahore',
        sessionBreakdown: '60% Live Online Lectures + 40% Onsite Practical Workshops',
      },
      selfPaced: {
        enabled: true,
        fee: 'PKR 18,000',
        accessDuration: '12 Months Access',
        recordedLessonsCount: 50,
        learningResources: 'Recorded lessons, research templates, listing checklists and community support.',
        assessmentDetails: 'Product research and listing assignment reviewed by a mentor.',
      },
    },
  },
  {
    id: 'graphic-design-video-editing',
    slug: 'graphic-design-video-editing',
    title: 'Graphic Design & Video Editing',
    introduction: 'Create professional logos, social media designs, branding and edited videos that stand out.',
    description: 'A complete creative course combining graphic design and video editing. Learn design principles, typography and color, logo and brand identity design, social media creatives, and professional video editing with transitions, color grading, sound and motion effects. Build a strong portfolio and learn how to find freelance clients.',
    thumbnail: '',
    category: 'Graphic Design & Video Editing',
    skillLevel: 'Beginner',
    duration: '14 Weeks (3.5 Months)',
    prerequisites: ['Creative interest in design and video.', 'A laptop or PC capable of running design and editing software.'],
    learningOutcomes: [
      'Apply core design principles: layout, typography, color and composition.',
      'Design logos, brand kits, posters and social media creatives.',
      'Edit professional videos with cuts, transitions, titles, audio and color correction.',
      'Create reels, YouTube videos and promotional ads with motion effects.',
      'Build a portfolio and start freelancing or working with agencies.',
    ],
    modules: [
      {
        id: 'g1',
        title: 'Module 1: Graphic Design Fundamentals',
        description: 'Design principles, typography, color theory and composition.',
        lessons: ['Design Principles, Layout & Composition', 'Typography & Color Theory', 'Working with Photoshop and Illustrator Tools'],
      },
      {
        id: 'g2',
        title: 'Module 2: Branding & Social Media Design',
        description: 'Logo design, brand identity and marketing creatives.',
        lessons: ['Logo Design & Brand Identity', 'Social Media Posts, Banners & Posters', 'Print Design & Export Standards'],
      },
      {
        id: 'g3',
        title: 'Module 3: Video Editing Essentials',
        description: 'Editing workflow, cuts, audio and color grading.',
        lessons: ['Premiere Pro / DaVinci Resolve Workflow & Timeline', 'Cuts, Transitions, Titles & Subtitles', 'Audio Cleanup & Color Correction'],
      },
      {
        id: 'g4',
        title: 'Module 4: Motion Effects, Portfolio & Freelancing',
        description: 'Reels, ads, motion graphics and getting clients.',
        lessons: ['Reels, Shorts & YouTube Video Editing', 'Basic Motion Graphics & Effects', 'Portfolio Building, Pricing & Freelance Marketplaces'],
      },
    ],
    practicalProjects: [
      'Complete brand identity kit with logo, color palette and social media templates.',
      'Social media campaign pack with posts, banners and story designs.',
      'Promotional video ad and a series of short-form reels.',
    ],
    certificateOffered: true,
    certificateDetails: 'Certificate of Completion in Graphic Design & Video Editing.',
    faqs: [
      { question: 'Do I need to know design or editing before joining?', answer: 'No. The course starts from the basics and gradually moves to advanced techniques.' },
      { question: 'Which software will I learn?', answer: 'You will work with industry-standard design and video editing tools. Free alternatives are also suggested for students who do not have paid licenses.' },
      { question: 'What kind of computer do I need?', answer: 'A laptop with at least 8GB RAM (16GB recommended for video editing) and a dedicated or modern integrated graphics card.' },
    ],
    displayOrder: 3,
    published: true,
    modes: {
      online: {
        enabled: true,
        fee: 'PKR 32,000',
        schedule: 'Mon, Wed, Fri',
        timings: '7:00 PM - 9:00 PM (PKT)',
        timeZone: 'GMT+5',
        platform: 'Google Meet / Zoom & WhatsApp Community',
        format: 'live',
      },
      onsite: {
        enabled: true,
        fee: 'PKR 38,000',
        schedule: 'Tue, Thu, Sat',
        timings: '3:00 PM - 6:00 PM (PKT)',
        campusName: 'Vision Giants Innovation Center',
        campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
        city: 'Lahore',
        availableSeats: 20,
      },
      hybrid: {
        enabled: true,
        fee: 'PKR 35,000',
        schedule: 'Online Classes + Onsite Creative Lab',
        onlineSchedule: 'Mon, Wed (Online 7:00 PM - 9:00 PM)',
        onsiteSchedule: 'Saturday (Campus Creative Lab 2:00 PM - 6:00 PM)',
        campusLocation: 'Gulberg III Campus, Lahore',
        sessionBreakdown: '60% Live Online Classes + 40% Hands-on Campus Creative Lab',
      },
      selfPaced: {
        enabled: true,
        fee: 'PKR 20,000',
        accessDuration: '12 Months Access',
        recordedLessonsCount: 55,
        learningResources: 'Recorded lessons, project files, templates, stock asset guides and community support.',
        assessmentDetails: 'Portfolio project review with feedback from a mentor.',
      },
    },
  },
  {
    id: 'social-media-marketing',
    slug: 'social-media-marketing',
    title: 'Social Media Marketing',
    introduction: 'Plan, create and run social media campaigns that grow brands, followers and sales.',
    description: 'A hands-on course covering the full social media marketing workflow: strategy, content planning, short-form video, community management, paid advertising on Meta and TikTok, influencer collaboration and analytics. Learn how to manage brand pages for businesses and deliver measurable results for clients.',
    thumbnail: '',
    category: 'Social Media Marketing',
    skillLevel: 'Beginner',
    duration: '8 Weeks (2 Months)',
    prerequisites: ['Basic familiarity with social media platforms.', 'No prior marketing experience required.'],
    learningOutcomes: [
      'Build a social media strategy aligned with business goals and target audience.',
      'Plan content calendars and create engaging posts, reels and stories.',
      'Run and optimize paid ad campaigns on Facebook, Instagram and TikTok.',
      'Manage communities, handle comments and build customer trust.',
      'Track performance with analytics and create clear client reports.',
    ],
    modules: [
      {
        id: 's1',
        title: 'Module 1: Social Media Strategy & Branding',
        description: 'Audience research, brand voice and platform selection.',
        lessons: ['Social Media Landscape & Platform Selection', 'Target Audience & Competitor Research', 'Brand Voice, Positioning & Goal Setting'],
      },
      {
        id: 's2',
        title: 'Module 2: Content Creation & Planning',
        description: 'Content calendars, short-form video and captions that convert.',
        lessons: ['Content Calendar & Content Pillars', 'Reels, Shorts & TikTok Content Creation', 'Copywriting, Hashtags & Posting Strategy'],
      },
      {
        id: 's3',
        title: 'Module 3: Paid Advertising',
        description: 'Meta and TikTok ads, targeting, budgeting and optimization.',
        lessons: ['Meta Ads Manager Setup & Campaign Structure', 'Audience Targeting, Budgeting & Creatives', 'TikTok Ads & Campaign Optimization'],
      },
      {
        id: 's4',
        title: 'Module 4: Analytics, Reporting & Client Work',
        description: 'Measuring results, influencer collaboration and finding clients.',
        lessons: ['Analytics, KPIs & Performance Reports', 'Influencer Marketing & Community Management', 'Freelancing, Pricing & Landing Social Media Clients'],
      },
    ],
    practicalProjects: [
      'Complete 30-day content calendar for a real or sample brand.',
      'Live ad campaign setup with targeting, creatives and budget plan.',
      'Client-style monthly performance report with insights and recommendations.',
    ],
    certificateOffered: true,
    certificateDetails: 'Certificate of Completion in Social Media Marketing.',
    faqs: [
      { question: 'Do I need a business page to practice?', answer: 'No. You can practice with a sample brand or your own page. The instructors help you set up practice projects.' },
      { question: 'Do I need an ad budget for the course?', answer: 'No large budget is required. Ad exercises can be done with a very small budget or in guided simulations.' },
      { question: 'Can I work as a freelancer after this course?', answer: 'Yes. The final module covers pricing, client communication and how to find your first clients.' },
    ],
    displayOrder: 4,
    published: true,
    modes: {
      online: {
        enabled: true,
        fee: 'PKR 22,000',
        schedule: 'Mon, Wed, Fri',
        timings: '8:00 PM - 10:00 PM (PKT)',
        timeZone: 'GMT+5',
        platform: 'Google Meet / Zoom & WhatsApp Community',
        format: 'live',
      },
      onsite: {
        enabled: true,
        fee: 'PKR 27,000',
        schedule: 'Tue, Thu',
        timings: '4:00 PM - 7:00 PM (PKT)',
        campusName: 'Vision Giants Innovation Center',
        campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
        city: 'Lahore',
        availableSeats: 25,
      },
      hybrid: {
        enabled: true,
        fee: 'PKR 24,000',
        schedule: 'Online Classes + Onsite Campaign Workshops',
        onlineSchedule: 'Mon, Wed (Online 8:00 PM - 10:00 PM)',
        onsiteSchedule: 'Saturday (Campus Workshop 2:00 PM - 5:00 PM)',
        campusLocation: 'Gulberg III Campus, Lahore',
        sessionBreakdown: '60% Live Online Classes + 40% Onsite Campaign Workshops',
      },
      selfPaced: {
        enabled: true,
        fee: 'PKR 12,000',
        accessDuration: '12 Months Access',
        recordedLessonsCount: 35,
        learningResources: 'Recorded lessons, content calendar templates, ad checklists and community support.',
        assessmentDetails: 'Campaign plan assignment reviewed by a mentor.',
      },
    },
  },

  // ───────────────────────── EXISTING COURSES (moved down) ─────────────────────────
  {
    id: 'full-stack-web-development',
    slug: 'full-stack-web-development',
    title: 'Full Stack Web Development Mastery',
    introduction: 'Build and deploy enterprise-grade modern web applications with React, TypeScript, Node.js, and PostgreSQL.',
    description: 'A comprehensive, practical bootcamp designed to take you from foundational programming to deploying live, production-grade SaaS applications. Master modern frontend design, secure RESTful APIs, database normalization, cloud deployment, and test-driven development.',
    thumbnail: '',
    category: 'Full Stack Development',
    skillLevel: 'Beginner',
    duration: '16 Weeks (4 Months)',
    prerequisites: ['Basic computer literacy and logical problem-solving mindset.', 'No prior programming experience required.'],
    learningOutcomes: [
      'Build rich, accessible interactive web apps with React 19 and TypeScript.',
      'Architect robust backend services, auth flows, and RESTful APIs with Node.js & Express.',
      'Model and query relational databases with PostgreSQL and modern ORMs.',
      'Implement CI/CD, Git workflows, and cloud hosting on GCP, AWS, and Vercel.',
      'Ship 4 production-ready portfolio projects with live URLs.',
    ],
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Modern Web Foundations & TypeScript',
        description: 'Semantic HTML5, CSS Grid/Flexbox, modern JavaScript (ES6+), and TypeScript fundamentals.',
        lessons: ['HTML5 Semantics & Accessibility', 'Modern CSS Architecture & Responsive Layouts', 'TypeScript Types, Interfaces & Tooling'],
      },
      {
        id: 'm2',
        title: 'Module 2: Advanced React & State Management',
        description: 'Component architecture, hooks, state machines, and performant client routing.',
        lessons: ['React Component Lifecycle & Custom Hooks', 'State Management & Context API', 'Performance Optimization & Code Splitting'],
      },
      {
        id: 'm3',
        title: 'Module 3: Backend Engineering & Databases',
        description: 'Server architectures, relational databases, REST APIs, and authentication.',
        lessons: ['Node.js Runtime & Express Architecture', 'PostgreSQL Schema Design & Migrations', 'JWT Authentication & Security Best Practices'],
      },
      {
        id: 'm4',
        title: 'Module 4: DevOps, Cloud Deployment & Capstone Project',
        description: 'Production deployment, continuous integration, testing, and graduation demo.',
        lessons: ['Docker Containerization & Environment Configuration', 'Cloud Deployment & Monitoring', 'Capstone Project Build & Code Review'],
      },
    ],
    instructorId: 'muhammad-rayan',
    practicalProjects: [
      'E-Commerce Multi-Vendor Platform with Stripe integration.',
      'Real-Time Collaboration Workspace with WebSockets.',
      'Custom SaaS Dashboard with role-based access control.',
    ],
    certificateOffered: true,
    certificateDetails: 'Industry-verified Certificate of Full-Stack Engineering Completion with credential verification ID.',
    faqs: [
      { question: 'Will I receive recordings of live classes?', answer: 'Yes, all online and hybrid class sessions are recorded in HD and available in your student portal within 2 hours.' },
      { question: 'Is there internship placement assistance?', answer: 'Yes! Top performing students receive direct interview placement and internship opportunities at Vision Giants and partner tech companies.' },
      { question: 'What computer hardware do I need?', answer: 'Any modern laptop with at least 8GB RAM (16GB recommended) running Windows, macOS, or Linux.' },
    ],
    displayOrder: 5,
    published: true,
    modes: {
      online: {
        enabled: true,
        fee: 'PKR 45,000',
        schedule: 'Mon, Wed, Fri',
        timings: '7:00 PM - 9:00 PM (PKT)',
        timeZone: 'GMT+5',
        platform: 'Google Meet / Zoom & Discord Community',
        format: 'live',
      },
      onsite: {
        enabled: true,
        fee: 'PKR 55,000',
        schedule: 'Tue, Thu, Sat',
        timings: '3:00 PM - 6:00 PM (PKT)',
        campusName: 'Vision Giants Innovation Center',
        campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
        city: 'Lahore',
        availableSeats: 25,
      },
      hybrid: {
        enabled: true,
        fee: 'PKR 50,000',
        schedule: 'Online Weekdays + Onsite Weekend Labs',
        onlineSchedule: 'Mon, Wed (Online 7:00 PM - 9:00 PM)',
        onsiteSchedule: 'Saturday (Campus Lab 2:00 PM - 6:00 PM)',
        campusLocation: 'Gulberg III Campus, Lahore',
        sessionBreakdown: '60% Live Interactive Online + 40% Practical Campus Lab Experiments',
      },
      selfPaced: {
        enabled: true,
        fee: 'PKR 30,000',
        accessDuration: '12 Months Unlimited Access',
        recordedLessonsCount: 65,
        learningResources: 'Full GitHub repositories, downloadable guides, code challenges, and instructor Discord support.',
        assessmentDetails: 'Automated code evaluations and mentor review on capstone project.',
      },
    },
  },
  {
    id: 'flutter-mobile-app-development',
    slug: 'flutter-mobile-app-development',
    title: 'Cross-Platform Mobile App Development with Flutter',
    introduction: 'Build beautiful, natively compiled mobile applications for iOS and Android from a single codebase.',
    description: 'Learn modern mobile application development from scratch with Google’s Flutter framework and Dart. Build responsive UIs, handle complex state with Bloc and Provider, integrate Firebase backends, access native hardware sensors, and publish apps to Google Play and Apple App Store.',
    thumbnail: '',
    category: 'Mobile App Development',
    skillLevel: 'Intermediate',
    duration: '12 Weeks (3 Months)',
    prerequisites: ['Basic object-oriented programming concepts (OOP) in any language.'],
    learningOutcomes: [
      'Master the Dart programming language and asynchronous programming.',
      'Design pixel-perfect responsive layouts that run identically on iOS and Android.',
      'Implement enterprise state management using Bloc, Cubit, and Riverpod.',
      'Integrate Firebase Authentication, Cloud Firestore, and Push Notifications.',
      'Publish and maintain apps on the App Store and Google Play Store.',
    ],
    modules: [
      {
        id: 'f1',
        title: 'Module 1: Dart Fundamentals & Flutter Widget Tree',
        description: 'Dart syntax, OOP, Stateless/Stateful widgets, and layout composition.',
        lessons: ['Dart OOP, Null Safety & Async', 'Building UI with Scaffold, Column, Row & Flex', 'Custom Paint & Animations in Flutter'],
      },
      {
        id: 'f2',
        title: 'Module 2: State Management & Navigation',
        description: 'Predictable state patterns and declarative deep-linking routing.',
        lessons: ['Provider & Riverpod Fundamentals', 'Enterprise Bloc Architecture', 'GoRouter & Deep Linking'],
      },
      {
        id: 'f3',
        title: 'Module 3: REST APIs, Caching & Firebase',
        description: 'Networking, offline-first local databases, and cloud services.',
        lessons: ['Dio HTTP Client & JSON Serialization', 'Hive / SQLite Local Storage', 'Firebase Auth, Firestore & Cloud Messaging'],
      },
      {
        id: 'f4',
        title: 'Module 4: Hardware APIs & App Store Publishing',
        description: 'Camera, geolocation, payment gateways, and app store deployment.',
        lessons: ['Native Device Sensors & Permissions', 'In-App Purchases & Payments', 'Google Play & Apple App Store Release Workflow'],
      },
    ],
    instructorId: 'ali-hassan',
    practicalProjects: [
      'Food Delivery App with real-time GPS tracking and map markers.',
      'Social Media & Chat Messenger with media sharing.',
      'Personal Finance & Expense Tracker with interactive charts.',
    ],
    certificateOffered: true,
    certificateDetails: 'Certified Mobile Application Developer Certificate with digital verification.',
    faqs: [
      { question: 'Do I need a Mac to develop iOS apps in this course?', answer: 'You can learn Flutter and test on Android on Windows or Linux. For compiling iOS builds, we provide cloud build guides or you can use our campus Mac lab during onsite sessions.' },
      { question: 'Are projects portfolio-ready?', answer: 'Yes, every project you build will be hosted on your public GitHub and compiled as APK/IPA files.' },
    ],
    displayOrder: 6,
    published: true,
    modes: {
      online: {
        enabled: true,
        fee: 'PKR 40,000',
        schedule: 'Tue, Thu, Sat',
        timings: '8:00 PM - 10:00 PM (PKT)',
        timeZone: 'GMT+5',
        platform: 'Google Meet & Discord Community',
        format: 'live',
      },
      onsite: {
        enabled: true,
        fee: 'PKR 48,000',
        schedule: 'Mon, Wed, Fri',
        timings: '4:00 PM - 6:30 PM (PKT)',
        campusName: 'Vision Giants Innovation Center',
        campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
        city: 'Lahore',
        availableSeats: 20,
      },
      hybrid: {
        enabled: true,
        fee: 'PKR 44,000',
        schedule: 'Online Lectures + Onsite Coding Clinics',
        onlineSchedule: 'Tue, Thu (Online 8:00 PM - 10:00 PM)',
        onsiteSchedule: 'Sunday (Campus Lab 11:00 AM - 3:00 PM)',
        campusLocation: 'Gulberg III Campus, Lahore',
        sessionBreakdown: '50% Online Live Lectures + 50% Onsite Mentor Review Sessions',
      },
      selfPaced: {
        enabled: false,
        fee: '',
      },
    },
  },
  {
    id: 'ui-ux-design-mastery',
    slug: 'ui-ux-design-mastery',
    title: 'UI/UX Design & Product Strategy Masterclass',
    introduction: 'Design high-converting, user-centered digital products, wireframes, and scalable design systems in Figma.',
    description: 'Transform into a proficient Product Designer. Learn user research methodologies, information architecture, wireframing, high-fidelity UI design, component systems with Auto Layout and variables, interactive micro-animations, and how to effectively conduct user testing.',
    thumbnail: '',
    category: 'UI/UX Design',
    skillLevel: 'All Levels',
    duration: '10 Weeks (2.5 Months)',
    prerequisites: ['Creative enthusiasm and a passion for design aesthetics.', 'No coding required.'],
    learningOutcomes: [
      'Master Figma from fundamental shortcuts to advanced component sets and variables.',
      'Conduct empathetic user interviews, persona mapping, and usability tests.',
      'Build comprehensive design systems with tokens, typography, and color scales.',
      'Design responsive desktop, tablet, and mobile interface prototypes.',
      'Present design rationale to stakeholders and hand off cleanly to developers.',
    ],
    modules: [
      {
        id: 'u1',
        title: 'Module 1: Design Thinking & User Research',
        description: 'User personas, journey mapping, empathy interviews, and problem definition.',
        lessons: ['The Double Diamond Design Framework', 'User Interviews & Competitive Analysis', 'Information Architecture & User Flow Mapping'],
      },
      {
        id: 'u2',
        title: 'Module 2: Figma Mastery & Layout Architecture',
        description: 'Auto Layout 5.0, responsive constraints, visual hierarchy, and typography.',
        lessons: ['Typography, Color Theory & Contrast Standards', 'Figma Auto Layout Mastery', 'Grid Systems & Responsive Design Breakpoints'],
      },
      {
        id: 'u3',
        title: 'Module 3: Design Systems & Component Libraries',
        description: 'Atomic design, variants, interactive component states, and design tokens.',
        lessons: ['Atomic Design Principles', 'Component Variants, Properties & Booleans', 'Creating a Scalable Design System'],
      },
      {
        id: 'u4',
        title: 'Module 4: Advanced Prototyping & Portfolio Case Study',
        description: 'Smart Animate micro-interactions, usability testing, and Behance case study.',
        lessons: ['Smart Animate & Interactive Micro-Animations', 'Usability Testing & Feedback Synthesis', 'Publishing a Standout Design Portfolio on Behance & Dribbble'],
      },
    ],
    instructorId: 'zainab-fatima',
    practicalProjects: [
      'Fintech Banking App UI with intuitive onboarding and money transfer flows.',
      'Healthcare Telemedicine Web Portal with appointment scheduling.',
      'SaaS Analytics Tool Design System with dark and light themes.',
    ],
    certificateOffered: true,
    certificateDetails: 'Professional Certificate in UI/UX Product Design.',
    faqs: [
      { question: 'Do I need paid Figma software?', answer: 'No, Figma provides a generous free tier for learners and students which is completely sufficient for the course.' },
      { question: 'Will I learn graphic design or user experience?', answer: 'The course covers both visual UI craft (aesthetics, layout, typography) and UX strategy (research, psychology, usability).' },
    ],
    displayOrder: 7,
    published: true,
    modes: {
      online: {
        enabled: true,
        fee: 'PKR 35,000',
        schedule: 'Mon, Wed, Fri',
        timings: '6:30 PM - 8:30 PM (PKT)',
        timeZone: 'GMT+5',
        platform: 'Google Meet & Figma Live Jam',
        format: 'live',
      },
      onsite: {
        enabled: true,
        fee: 'PKR 42,000',
        schedule: 'Saturday & Sunday Intensive',
        timings: '11:00 AM - 3:00 PM (PKT)',
        campusName: 'Vision Giants Innovation Center',
        campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
        city: 'Lahore',
        availableSeats: 22,
      },
      hybrid: {
        enabled: false,
        fee: '',
      },
      selfPaced: {
        enabled: true,
        fee: 'PKR 25,000',
        accessDuration: '6 Months Access',
        recordedLessonsCount: 40,
        learningResources: 'Complete Figma UI kits, case study templates, and critique recordings.',
        assessmentDetails: 'Portfolio review with written feedback from a senior designer.',
      },
    },
  },
];