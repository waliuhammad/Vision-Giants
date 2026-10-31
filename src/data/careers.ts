/**
 * Open positions, culture principles, and hiring information.
 * All positions are fully manageable via the Admin Panel (Admin → Careers).
 */

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Internship' | 'Contract' | 'Freelance';
export type WorkArrangement = 'Onsite' | 'Remote' | 'Hybrid';
export type ExperienceLevel = 'Entry-Level' | 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Internship';

export interface Position {
  id: string;
  title: string;
  department: string;
  type: EmploymentType | string;
  location: string;
  workArrangement: WorkArrangement | string;
  experience: ExperienceLevel | string;
  summary: string;
  description?: string;
  responsibilities?: string[];
  skills?: string[];
  qualifications?: string[];
  deadline?: string;
  salaryRange?: string;
  applicationInstructions?: string;
  published: boolean;
  order?: number;
  isInternship?: boolean;
}

export const defaultPositions: Position[] = [
  {
    id: 'senior-fullstack-dev',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Lahore, Pakistan',
    workArrangement: 'Hybrid',
    experience: 'Senior',
    summary: 'Lead architectural decisions and develop scalable web applications with React, Node.js, and cloud systems.',
    description: 'We are seeking an experienced Full-Stack Engineer to lead development on modern digital applications, mentor junior engineers, and drive technical excellence.',
    responsibilities: [
      'Architect, develop, and maintain responsive web applications using React, TypeScript, and Node.js.',
      'Design reliable APIs, database schemas, and microservices.',
      'Collaborate closely with UI/UX designers and product managers to refine user experiences.',
      'Conduct rigorous code reviews and establish clean coding best practices.',
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Firebase / GCP', 'Docker'],
    qualifications: [
      'Bachelor’s or Master’s in Computer Science, Software Engineering, or equivalent experience.',
      '4+ years of professional full-stack development experience.',
      'Demonstrated expertise with relational databases, REST/GraphQL APIs, and cloud deployments.',
    ],
    deadline: '2026-11-30',
    salaryRange: 'Competitive based on experience',
    applicationInstructions: 'Submit your resume and share your GitHub profile or live project links.',
    published: true,
    order: 1,
    isInternship: false,
  },
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer (Flutter / React Native)',
    department: 'Mobile Engineering',
    type: 'Full-Time',
    location: 'Lahore, Pakistan',
    workArrangement: 'Onsite',
    experience: 'Mid-Level',
    summary: 'Build high-performance cross-platform mobile apps for iOS and Android with delightful animations.',
    description: 'Join our mobile team to craft polished, responsive applications for global businesses and consumer platforms.',
    responsibilities: [
      'Build performant cross-platform mobile apps using Flutter or React Native.',
      'Integrate RESTful APIs, push notifications, and local caching.',
      'Optimize app performance, startup speed, and smooth 60fps animations.',
      'Manage app store submissions for Apple App Store and Google Play Store.',
    ],
    skills: ['Flutter / Dart', 'React Native', 'State Management', 'Mobile UI/UX', 'CI/CD for Mobile'],
    qualifications: [
      '2+ years of professional mobile app development experience.',
      'Proven track record of published apps on App Store or Google Play.',
    ],
    deadline: '2026-11-25',
    salaryRange: 'Market competitive',
    published: true,
    order: 2,
    isInternship: false,
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    department: 'Design',
    type: 'Full-Time',
    location: 'Lahore, Pakistan',
    workArrangement: 'Hybrid',
    experience: 'Mid-Level',
    summary: 'Craft intuitive user interfaces, design systems, interactive prototypes, and modern digital brand experiences.',
    description: 'We are looking for a creative UI/UX Designer who obsesses over visual hierarchy, typography, user flows, and product elegance.',
    responsibilities: [
      'Design wireframes, user journeys, and high-fidelity prototypes in Figma.',
      'Develop scalable design systems and reusable UI components.',
      'Work in tandem with developers to ensure pixel-perfect design implementation.',
      'Conduct usability tests and iterate based on real feedback.',
    ],
    skills: ['Figma', 'Design Systems', 'Interactive Prototyping', 'User Research', 'Responsive Design'],
    qualifications: [
      '2+ years of professional UI/UX design experience for SaaS or web apps.',
      'Strong portfolio showcasing problem-solving and modern visual craft.',
    ],
    deadline: '2026-12-05',
    salaryRange: 'Market competitive',
    published: true,
    order: 3,
    isInternship: false,
  },
  {
    id: 'intern-frontend-dev',
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    type: 'Internship',
    location: 'Lahore, Pakistan',
    workArrangement: 'Onsite',
    experience: 'Internship',
    summary: 'Hands-on training and mentorship working on real-world frontend web development with React and TypeScript.',
    description: 'A paid 3-month internship program designed to kickstart your software engineering career with real projects and dedicated 1-on-1 mentorship.',
    responsibilities: [
      'Assist in building modular UI components with React, HTML5, and CSS3.',
      'Learn modern state management and API integration workflows.',
      'Participate in sprint planning, agile standups, and code review sessions.',
    ],
    skills: ['JavaScript (ES6+)', 'React Basics', 'HTML / CSS', 'Git'],
    qualifications: [
      'Graduating student or recent graduate in CS, SE, or self-taught with solid foundational projects.',
      'Enthusiasm for learning clean code and web performance.',
    ],
    deadline: '2026-11-20',
    salaryRange: 'Paid Internship with permanent job opportunity',
    published: true,
    order: 4,
    isInternship: true,
  },
  {
    id: 'intern-digital-marketing',
    title: 'Digital Marketing & Growth Intern',
    department: 'Marketing',
    type: 'Internship',
    location: 'Lahore, Pakistan',
    workArrangement: 'Hybrid',
    experience: 'Internship',
    summary: 'Learn strategic SEO, content distribution, social media marketing, and data-driven client acquisition.',
    description: 'Gain practical experience in tech marketing, campaign optimization, analytics, and content strategy.',
    responsibilities: [
      'Help run content marketing campaigns across LinkedIn, Twitter/X, and tech communities.',
      'Perform keyword research and on-page SEO optimization.',
      'Track analytics and compile campaign performance reports.',
    ],
    skills: ['Content Writing', 'SEO Fundamentals', 'Social Media Analytics', 'Communication'],
    qualifications: [
      'Degree in Marketing, Communications, Business, or relevant passion projects.',
      'Excellent written English skills.',
    ],
    deadline: '2026-11-25',
    salaryRange: 'Paid Internship with permanent job opportunity',
    published: true,
    order: 5,
    isInternship: true,
  },
];

export const openPositions: Position[] = defaultPositions;

export const hiringProcessSteps = [
  { step: '01', title: 'Submit Application', description: 'Choose your desired position and submit your CV along with your portfolio or code samples.' },
  { step: '02', title: 'Application Review', description: 'Our hiring team reviews your experience, skills, and past work to ensure role alignment.' },
  { step: '03', title: 'Initial Interview', description: 'A conversational video call to discuss your career goals, background, and cultural fit.' },
  { step: '04', title: 'Technical Assessment', description: 'A practical, real-world task or live coding problem tailored to your chosen discipline.' },
  { step: '05', title: 'Final Interview', description: 'Meet with leadership and team leads to discuss vision, compensation, and mutual expectations.' },
  { step: '06', title: 'Selection & Onboarding', description: 'Receive your formal offer letter, meet your mentor, and start building great software.' },
];

export const workBenefits = [
  { title: 'Professional Growth', description: 'Structured mentorship, fast-tracked promotions, and clear career roadmaps.' },
  { title: 'Learning Opportunities', description: 'Paid certifications, workshops, access to premium courses, and dedicated study time.' },
  { title: 'Real-World Projects', description: 'Work on production systems used by thousands of users across global markets.' },
  { title: 'Collaborative Environment', description: 'A supportive, friendly team that values transparency, inclusion, and open discussion.' },
  { title: 'Career Development', description: 'Frequent performance reviews, skill evaluations, and leadership opportunities.' },
  { title: 'Continuous Learning', description: 'Weekly tech talks, code review retrospectives, and hackathons.' },
];

export const internshipRoles = [
  { title: 'Web Development Intern', track: 'Full-Stack / Modern Web', duration: '3 Months', mode: 'Onsite / Hybrid' },
  { title: 'Frontend Developer Intern', track: 'React / Next.js / TypeScript', duration: '3 Months', mode: 'Onsite / Hybrid' },
  { title: 'Backend Developer Intern', track: 'Node.js / Databases / Cloud APIs', duration: '3 Months', mode: 'Onsite / Hybrid' },
  { title: 'Mobile App Developer Intern', track: 'Flutter / React Native', duration: '3 Months', mode: 'Onsite / Hybrid' },
  { title: 'UI/UX Design Intern', track: 'Figma / Wireframing / Systems', duration: '3 Months', mode: 'Onsite / Hybrid' },
  { title: 'Graphic Design Intern', track: 'Branding / Visual Media / Illustrations', duration: '3 Months', mode: 'Onsite / Hybrid' },
  { title: 'QA & Testing Intern', track: 'Manual & Automated Testing / CI', duration: '3 Months', mode: 'Onsite / Hybrid' },
  { title: 'Digital Marketing Intern', track: 'SEO / Social Growth / Content', duration: '3 Months', mode: 'Onsite / Hybrid' },
];

export const disciplines = [
  { title: 'Frontend Development', text: 'Building accessible, high-performance interfaces with React & TypeScript.' },
  { title: 'Backend Development', text: 'Designing APIs, robust data models, and resilient microservices.' },
  { title: 'Full-Stack Development', text: 'Engineering end-to-end features with seamless data flow and security.' },
  { title: 'Mobile Engineering', text: 'Publishing native-feel Flutter and React Native cross-platform apps.' },
  { title: 'UI/UX & Product Design', text: 'Creating user research-backed designs and scalable design systems.' },
  { title: 'Cloud & DevOps', text: 'Automating CI/CD pipelines, containerization, and reliable cloud deployments.' },
];
