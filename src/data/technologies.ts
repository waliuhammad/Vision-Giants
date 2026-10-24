export type TechId = 'react' | 'node' | 'firebase' | 'cloudinary';

export interface Technology {
  id: TechId;
  name: string;
  category: string;
  description: string;
  uses: string[];
  href: string;
}

/** Technology overview. Describes what each tool is used for, not claims of certification. */
export const technologies: Technology[] = [
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend',
    description: 'A component-based library for building fast, interactive user interfaces.',
    uses: ['Reusable components', 'Interactive interfaces', 'State management'],
    href: 'https://react.dev/',
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'Backend & tooling',
    description: 'A JavaScript runtime for server-side applications, APIs and build tooling.',
    uses: ['REST APIs', 'Backend services', 'Build tooling'],
    href: 'https://nodejs.org/',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    category: 'Application platform',
    description: 'Managed database, authentication and hosting services, selected per project needs.',
    uses: ['Realtime database', 'Authentication', 'Cloud functions'],
    href: 'https://firebase.google.com/',
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    category: 'Media',
    description: 'Media management for optimised image and video delivery.',
    uses: ['Image optimisation', 'Media delivery', 'Transformations'],
    href: 'https://cloudinary.com/',
  },
];

export const supportingStack = [
  { group: 'Frontend', items: ['TypeScript', 'Vite', 'React Router', 'Responsive CSS'] },
  { group: 'Backend', items: ['REST APIs', 'Firestore', 'Authentication', 'Serverless functions'] },
  { group: 'Delivery', items: ['Git workflows', 'Static prerendering', 'CDN media delivery', 'Performance audits'] },
];
