import type { LucideIcon } from 'lucide-react';
import { CodeXml, Smartphone, Cpu, ShoppingCart, Palette, Cloud, Database, ShieldCheck, Bot, ChartLine, Wrench, Globe } from 'lucide-react';

/** Icons a service can use. Stored by name so services can be managed from the admin dashboard. */
export const serviceIcons = {
  code: CodeXml,
  mobile: Smartphone,
  cpu: Cpu,
  cart: ShoppingCart,
  palette: Palette,
  cloud: Cloud,
  database: Database,
  security: ShieldCheck,
  ai: Bot,
  analytics: ChartLine,
  support: Wrench,
  globe: Globe,
} satisfies Record<string, LucideIcon>;

export type ServiceIconName = keyof typeof serviceIcons;

export const getServiceIcon = (name: string): LucideIcon => serviceIcons[name as ServiceIconName] ?? CodeXml;

/**
 * Built-in service catalogue, used until content is imported into the admin dashboard
 * (after which services are managed there). Confirm each offering before publishing.
 */
export interface Service {
  id: string;
  title: string;
  short: string;
  description: string;
  deliverables: string[];
  icon: ServiceIconName;
}

export const services: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    short: 'Fast, accessible websites and web applications built on modern frameworks.',
    description:
      'From marketing sites to complex web applications, we build responsive front-ends and reliable back-ends with a focus on performance, accessibility and maintainable code.',
    deliverables: ['Web applications & portals', 'Marketing & content sites', 'Progressive web apps', 'API development'],
    icon: 'code',
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Applications',
    short: 'iOS and Android apps with smooth, native-feeling experiences.',
    description:
      'We design and build cross-platform mobile apps that feel at home on every device, with offline-friendly data handling and clean integrations with your existing systems.',
    deliverables: ['Cross-platform apps', 'App UI & interaction design', 'Backend & API integration', 'Store release support'],
    icon: 'mobile',
  },
  {
    id: 'custom-software',
    title: 'Custom Software',
    short: 'Software shaped around your workflows, not the other way round.',
    description:
      'When off-the-shelf tools fall short, we build internal tools, dashboards and automation that fit how your team actually works and can grow with you.',
    deliverables: ['Internal tools & dashboards', 'Workflow automation', 'Legacy modernisation', 'Third-party integrations'],
    icon: 'cpu',
  },
  {
    id: 'e-commerce',
    title: 'E-Commerce Solutions',
    short: 'Secure, scalable storefronts designed to convert.',
    description:
      'We create online stores with clear product discovery, smooth checkout flows and the integrations you need for payments, inventory and fulfilment.',
    deliverables: ['Custom storefronts', 'Checkout & payment flows', 'Catalogue & inventory tools', 'Analytics setup'],
    icon: 'cart',
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    short: 'Intuitive interfaces grounded in research and clear design systems.',
    description:
      'We map user journeys, prototype quickly and craft polished interfaces backed by reusable design systems, so your product is both beautiful and easy to use.',
    deliverables: ['User research & journeys', 'Wireframes & prototypes', 'Visual & interaction design', 'Design systems'],
    icon: 'palette',
  },
  {
    id: 'cloud-integrations',
    title: 'Cloud & Integrations',
    short: 'Cloud services and integrations for performance and flexibility.',
    description:
      'We help you choose and connect the right cloud services (hosting, databases, authentication and media delivery) and integrate them cleanly with your applications.',
    deliverables: ['Cloud architecture', 'Authentication & databases', 'Media optimisation', 'Deployment pipelines'],
    icon: 'cloud',
  },
];
