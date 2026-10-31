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
  { id: 'full-stack', name: 'Full Stack Development', slug: 'full-stack', description: 'End-to-end modern web applications from frontend to database.', order: 1, active: true },
  { id: 'frontend', name: 'Frontend Development', slug: 'frontend', description: 'Interactive, responsive user interfaces with React, Next.js, and CSS.', order: 2, active: true },
  { id: 'mobile', name: 'Mobile App Development', slug: 'mobile', description: 'Cross-platform iOS and Android apps using Flutter and React Native.', order: 3, active: true },
  { id: 'ui-ux', name: 'UI/UX Design', slug: 'ui-ux', description: 'User-centric product design, prototyping, and modern design systems.', order: 4, active: true },
  { id: 'python-ai', name: 'Python & AI Engineering', slug: 'python-ai', description: 'Python programming, machine learning, and generative AI models.', order: 5, active: true },
  { id: 'digital-marketing', name: 'Digital Marketing & SEO', slug: 'digital-marketing', description: 'Data-driven growth, search engine optimization, and brand campaigns.', order: 6, active: true },
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
    displayOrder: 1,
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
    displayOrder: 2,
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
    displayOrder: 3,
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

