/**
 * Built-in portfolio, used until content is imported into the admin dashboard (after that,
 * projects are managed under Admin → Portfolio). Screenshots live in public/portfolio/<id>/.
 * Do not add client results or metrics unless they are genuine and approved.
 */
export type ProjectCategory = 'web' | 'ecommerce' | 'mobile' | 'custom';
export type PreviewKind = 'dashboard' | 'store' | 'mobile' | 'kanban' | 'booking' | 'learning';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  /** Short industry / project-type label, e.g. "E-commerce · Sports equipment". */
  industry?: string;
  summary: string;
  details: string;
  features: string[];
  tech: string[];
  /** Live site. */
  url?: string;
  /** Screenshots, first one is the card cover. Desktop shots are 16:10; "mobile" shots are portrait. */
  images?: string[];
  /** Illustration shown when there are no images. */
  preview: PreviewKind;
  /** Optional single screenshot (older admin field). Used when `images` is empty. */
  imageUrl?: string;
  /** A demonstration concept rather than client work. */
  isDemo: boolean;
}

export const previewKinds: PreviewKind[] = ['dashboard', 'store', 'mobile', 'kanban', 'booking', 'learning'];

export const categoryLabels: Record<ProjectCategory, string> = {
  web: 'Web Development',
  ecommerce: 'E-Commerce',
  mobile: 'Mobile Applications',
  custom: 'Custom Software',
};

/** The cover image for cards: first screenshot, else the single image field. */
export const projectCover = (p: Pick<Project, 'images' | 'imageUrl'>) => p.images?.[0] ?? p.imageUrl;

/**
 * Projects shown on the Portfolio page (and in "Featured projects" on the homepage and service
 * pages, which are hidden while this list is empty). Add one object per project, e.g.:
 *
 *   {
 *     id: 'my-project',
 *     title: 'My Project',
 *     category: 'web',
 *     industry: 'E-commerce',
 *     summary: 'One or two sentences shown on the card.',
 *     details: 'Longer description shown when the project is opened.',
 *     features: ['Key feature one', 'Key feature two'],
 *     tech: ['React', 'Firebase'],
 *     url: 'https://example.com/',
 *     images: ['/portfolio/my-project/1.webp'],
 *     preview: 'store',
 *     isDemo: false,
 *   },
 */
export const projects: Project[] = [];

/** Which portfolio category is shown on each service's page (keys are service ids in services.ts). */
export const serviceProjectCategory: Record<string, ProjectCategory> = {
  'website-development': 'web',
  ecommerce: 'ecommerce',
  'app-development': 'mobile',
  'software-development': 'custom',
};
