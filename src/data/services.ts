import type { LucideIcon } from 'lucide-react';
import {
  Globe, Bot, Smartphone, ShoppingCart, Share2, Brain,
  Cpu, Code2, Film, Palette, Search, Gamepad2,
} from 'lucide-react';

export interface ServicePlatform {
  name: string;
  text: string;
}

/** Editable service catalogue. Confirm each offering before publishing. */
export interface Service {
  id: string;
  title: string;
  short: string;
  description: string;
  deliverables: string[];
  icon: LucideIcon;
  platforms?: ServicePlatform[];
}

export const services: Service[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    short: 'Fast, responsive and SEO-friendly websites that convert visitors into customers.',
    description:
      'We design and build business sites, portals and landing pages with clean code, mobile-first layouts and strong performance.',
    deliverables: ['Responsive website design', 'CMS integration', 'Speed and security optimisation', 'Hosting and maintenance'],
    icon: Globe,
  },
  {
    id: 'robotics',
    title: 'Robotics',
    short: 'Custom robotic solutions for automation, education and industry.',
    description:
      'Our team builds robots with sensors, controllers and software that automate repetitive or hazardous tasks, from prototype to deployment.',
    deliverables: ['Robot design and prototyping', 'Microcontroller programming', 'Sensor and motor integration', 'Training and documentation'],
    icon: Bot,
  },
  {
    id: 'app-development',
    title: 'App Development',
    short: 'Native and cross-platform mobile apps for Android and iOS.',
    description:
      'We take your app from idea to store release, covering design, development, testing and updates, with smooth and intuitive experiences.',
    deliverables: ['Android and iOS apps', 'Cross-platform (Flutter / React Native)', 'API and backend integration', 'Play Store and App Store publishing'],
    icon: Smartphone,
  },
  {
    id: 'ecommerce',
    title: 'Ecommerce',
    short: 'Online stores and marketplace management on Amazon, eBay, Shopify and Etsy.',
    description:
      'We set up, manage and grow your online store, on your own website or on the world’s biggest marketplaces.',
    deliverables: ['Store setup and design', 'Product listing and catalogue management', 'Payment and shipping integration', 'Marketplace growth and ads'],
    icon: ShoppingCart,
    platforms: [
      { name: 'Amazon', text: 'Seller account setup, FBA/FBM guidance, optimised listings, A+ content, PPC advertising and inventory management.' },
      { name: 'eBay', text: 'Store setup, bulk listings, competitive pricing strategy, order handling and seller performance improvement.' },
      { name: 'Shopify', text: 'Custom Shopify stores, theme customisation, app integration, checkout optimisation and ongoing support.' },
      { name: 'Etsy', text: 'Shop setup, SEO-optimised listings, branding, product photography direction and order management for handmade and creative products.' },
    ],
  },
  {
    id: 'social-media-marketing',
    title: 'Social Media Marketing',
    short: 'Strategy, content and paid campaigns that grow your audience.',
    description:
      'We plan, create and manage your social presence across all major platforms so your brand stays visible and consistent.',
    deliverables: ['Content calendar and strategy', 'Post and reel creation', 'Paid ad campaigns', 'Monthly analytics reports'],
    icon: Share2,
  },
  {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    short:
      'Software that learns from your data to answer customers, spot patterns and automate work, so your team saves time and decides faster.',
    description:
      'Artificial Intelligence (AI) is software that learns from data instead of following fixed rules. It can understand text and speech, recognise objects in images, predict what will happen next and take over repetitive tasks. We turn that into practical tools for your business: a chatbot that answers customers around the clock, a system that reads images or documents for you, or a model that forecasts sales and flags problems before they cost you money. You get working solutions that cut manual work, reduce errors and help you make smarter decisions.',
    deliverables: [
      'AI chatbots and virtual assistants',
      'Machine learning and prediction models',
      'Computer vision (image and video recognition)',
      'Process automation and data insights',
    ],
    icon: Brain,
  },
  {
    id: 'iot',
    title: 'Internet of Things (IoT)',
    short: 'Connected devices and smart systems that automate operations in real time.',
    description:
      'From sensors to dashboards, we build complete IoT systems for homes, farms, factories and cities.',
    deliverables: ['Device and sensor integration', 'Cloud connectivity (MQTT / HTTP)', 'Real-time monitoring dashboards', 'Smart automation systems'],
    icon: Cpu,
  },
  {
    id: 'software-development',
    title: 'Software Development',
    short: 'Custom desktop, web and enterprise software built around your workflows.',
    description:
      'We build reliable, scalable software such as ERPs, management systems and internal tools that fit how your team works.',
    deliverables: ['Requirement analysis', 'Custom software development', 'Database design', 'Testing, deployment and support'],
    icon: Code2,
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    short: 'Professional editing for ads, reels, YouTube and corporate videos.',
    description:
      'We turn raw footage into polished videos with smooth cuts, colour grading, sound and motion graphics.',
    deliverables: ['Reels and short-form videos', 'YouTube and long-form editing', 'Motion graphics and titles', 'Colour grading and sound design'],
    icon: Film,
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    short: 'Logos, branding and marketing creatives with a professional look.',
    description:
      'We create visual identities and marketing materials that stay consistent across print and digital.',
    deliverables: ['Logo and brand identity', 'Social media creatives', 'Brochures, flyers and banners', 'Packaging and print design'],
    icon: Palette,
  },
  {
    id: 'seo',
    title: 'SEO',
    short: 'Rank higher on Google with technical, on-page and content SEO.',
    description:
      'We audit your site, fix what holds it back and build authority so the right customers find you.',
    deliverables: ['Site audit and keyword research', 'On-page and technical SEO', 'Content and link building', 'Ranking and traffic reports'],
    icon: Search,
  },
  {
    id: 'game-development',
    title: 'Game Development',
    short: 'Engaging 2D and 3D games for mobile, PC and web.',
    description:
      'We take your game from concept to launch, covering design, programming, art integration, testing and publishing.',
    deliverables: ['2D and 3D game development', 'Unity and Unreal Engine projects', 'Game art, animation and sound integration', 'Testing and store publishing'],
    icon: Gamepad2,
  },
];

export const getServiceById = (id: string): Service | undefined =>
  services.find((s) => s.id === id);