/**
 * Built-in portfolio entries, used until content is imported into the admin dashboard.
 * ALL ITEMS BELOW ARE DEMONSTRATION CONCEPTS, not client work.
 * Replace with real projects (and set `isDemo: false`) once available. Do not add
 * client names or measurable results unless they are genuine and approved.
 */
export type ProjectCategory = 'web' | 'ecommerce' | 'mobile' | 'custom';
export type PreviewKind = 'dashboard' | 'store' | 'mobile' | 'kanban' | 'booking' | 'learning';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  details: string;
  features: string[];
  tech: string[];
  /** Illustration shown when there is no image. */
  preview: PreviewKind;
  /** Optional screenshot uploaded in the admin dashboard. Replaces the illustration. */
  imageUrl?: string;
  isDemo: boolean;
}

export const previewKinds: PreviewKind[] = ['dashboard', 'store', 'mobile', 'kanban', 'booking', 'learning'];

export const categoryLabels: Record<ProjectCategory, string> = {
  web: 'Web Applications',
  ecommerce: 'E-Commerce',
  mobile: 'Mobile Applications',
  custom: 'Custom Software',
};

export const projects: Project[] = [
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    category: 'web',
    summary: 'A real-time analytics workspace with configurable charts and reports.',
    details:
      'A concept for a data-heavy web application: role-based dashboards, live-updating charts and exportable reports, designed to stay responsive with large datasets.',
    features: ['Configurable widgets', 'Live data updates', 'Role-based access', 'CSV & PDF export'],
    tech: ['React', 'Node.js', 'Firebase'],
    preview: 'dashboard',
    isDemo: true,
  },
  {
    id: 'commerce-platform',
    title: 'E-Commerce Platform',
    category: 'ecommerce',
    summary: 'A modern storefront with fast product discovery and a streamlined checkout.',
    details:
      'A storefront concept focused on product discovery and checkout clarity, with optimised imagery, filterable catalogues and a mobile-first purchase flow.',
    features: ['Faceted search', 'Optimised product media', 'Guest checkout', 'Order tracking'],
    tech: ['React', 'Node.js', 'Cloudinary'],
    preview: 'store',
    isDemo: true,
  },
  {
    id: 'fitness-tracker',
    title: 'Fitness Tracker',
    category: 'mobile',
    summary: 'A mobile app concept for tracking workouts, habits and progress.',
    details:
      'A cross-platform mobile concept with workout logging, progress visualisations and gentle habit reminders, designed for quick one-handed use.',
    features: ['Workout logging', 'Progress charts', 'Habit reminders', 'Offline support'],
    tech: ['React Native', 'Firebase'],
    preview: 'mobile',
    isDemo: true,
  },
  {
    id: 'task-manager',
    title: 'Task Management Tool',
    category: 'custom',
    summary: 'An internal tool for planning work, tracking tasks and collaborating.',
    details:
      'A custom software concept for team planning: kanban boards, workload views and integrations with existing communication tools.',
    features: ['Kanban & list views', 'Workload overview', 'Comments & mentions', 'Integrations'],
    tech: ['React', 'Node.js'],
    preview: 'kanban',
    isDemo: true,
  },
  {
    id: 'booking-system',
    title: 'Appointment Booking',
    category: 'web',
    summary: 'An online booking system with calendars, reminders and payments.',
    details:
      'A web application concept for service businesses: availability calendars, automated reminders and simple staff scheduling.',
    features: ['Availability calendar', 'Automated reminders', 'Staff scheduling', 'Admin panel'],
    tech: ['React', 'Node.js', 'Firebase'],
    preview: 'booking',
    isDemo: true,
  },
  {
    id: 'learning-portal',
    title: 'Learning Portal',
    category: 'custom',
    summary: 'A course platform with lessons, progress tracking and media delivery.',
    details:
      'A custom learning-platform concept with structured courses, video lessons delivered through optimised media pipelines and learner progress tracking.',
    features: ['Course builder', 'Video lessons', 'Progress tracking', 'Certificates'],
    tech: ['React', 'Firebase', 'Cloudinary'],
    preview: 'learning',
    isDemo: true,
  },
];
