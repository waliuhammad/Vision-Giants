import { company } from '../data/company';
import { mainNav, footerCompanyNav, primaryCta } from '../data/navigation';
import { technologies, supportingStack } from '../data/technologies';
import { faqs } from '../data/faq';
import { processSteps } from '../data/process';
import type {
  GlobalSettings,
  NavigationSettings,
  HeaderFooterSettings,
  FaqItem,
  ProcessStepItem,
  TechnologiesContent,
  SeoSettings,
} from './cmsTypes';

export const defaultGlobalSettings: GlobalSettings = {
  companyName: company.name,
  legalName: company.legalName,
  tagline: company.tagline,
  description: company.description,
  email: 'info@vgiants.com',
  supportEmail: 'support@vgiants.com',
  phones: company.phones.length > 0 ? company.phones : ['+92 308 0058600', '+92 317 6572690'],
  address: company.address || 'Vision Giants, Near Zavia School, Gulgasht, Multan, Pakistan',
  whatsappNumber: '+923080058600',
  social: {
    linkedin: 'https://www.linkedin.com/company/vision-giants/',
    facebook: 'https://www.facebook.com/share/1KKtHY6Huo/',
    instagram: 'https://www.instagram.com/visiongiants/',
    tiktok: 'https://www.tiktok.com/@vision.giants',
    twitter: 'https://x.com/visiongiants',
    github: 'https://github.com/visiongiants',
  },
  branding: {
    logoUrl: '/logo-mark.png',
    logoMarkUrl: '/logo-mark.png',
    faviconUrl: '/favicon.png',
    primaryColor: '#2563eb',
    accentColor: '#38bdf8',
  },
};

export const defaultNavigationSettings: NavigationSettings = {
  headerNav: mainNav.map((n) => ({ ...n, active: true })),
  primaryCta: { ...primaryCta, active: true },
  footerCompanyNav: footerCompanyNav.map((n) => ({ ...n, active: true })),
  footerServicesNav: [
    { label: 'Web Application Development', to: '/services/web-application-development/', active: true },
    { label: 'Mobile App Development', to: '/services/mobile-app-development/', active: true },
    { label: 'UI/UX Design & Prototyping', to: '/services/ui-ux-design-prototyping/', active: true },
    { label: 'Cloud Solutions & DevOps', to: '/services/cloud-solutions-devops/', active: true },
    { label: 'AI & Custom Software', to: '/services/ai-custom-software/', active: true },
  ],
};

export const defaultHeaderFooterSettings: HeaderFooterSettings = {
  header: {
    sticky: true,
    showCta: true,
    ctaText: 'Start a Project',
    ctaLink: '/contact/',
    noticeBarEnabled: false,
    noticeBarText: '🚀 Vision Giants Academy Enrollment is Now Open!',
  },
  footer: {
    description: company.description,
    copyright: `© ${new Date().getFullYear()} Vision Giants Pvt Ltd. All rights reserved.`,
    showSocials: true,
    showContactInfo: true,
    showNewsletter: true,
    legalLinks: [
      { label: 'Privacy Policy', to: '/privacy/' },
      { label: 'Terms of Service', to: '/terms/' },
    ],
  },
};

export const defaultFaqItems: FaqItem[] = faqs.map((f, i) => ({
  id: `faq-${i + 1}`,
  q: f.q,
  a: f.a,
  category: 'General',
  order: i + 1,
}));

export const defaultProcessStepItems: ProcessStepItem[] = processSteps.map((p, i) => ({
  id: `step-${p.n}`,
  n: p.n,
  title: p.title,
  text: p.text,
  order: i + 1,
}));

export const defaultTechnologiesContent: TechnologiesContent = {
  technologies,
  architecture: [
    { id: 'tier-interface', label: 'Interface', nodes: [{ id: 'react', name: 'React', role: 'Web interfaces & components' }] },
    { id: 'tier-services', label: 'Services', nodes: [{ id: 'node', name: 'Node.js', role: 'APIs & business logic' }] },
    {
      id: 'tier-platform',
      label: 'Platform',
      nodes: [
        { id: 'firebase', name: 'Firebase', role: 'Data, auth & hosting' },
        { id: 'cloudinary', name: 'Cloudinary', role: 'Media optimisation & delivery' },
      ],
    },
  ],
  supportingStack: supportingStack.map((s, idx) => ({ id: `sup-${idx + 1}`, group: s.group, items: s.items })),
};

export const defaultSeoSettings: SeoSettings = {
  home: {
    title: 'Vision Giants | Leading Software House & Digital Product Agency',
    description: 'We design and develop high-performance web applications, mobile apps, enterprise cloud solutions, and offer top tech courses.',
    keywords: 'software house, web development, mobile apps, tech academy, Lahore, Multan, Pakistan',
    ogImage: '/og-image.png',
  },
  about: {
    title: 'About Us | Vision Giants Software Development Studio',
    description: 'Learn about our journey, engineering principles, leadership team, and our mission to build digital experiences that move businesses forward.',
    keywords: 'about vision giants, software engineering team, tech leadership',
    ogImage: '/og-image.png',
  },
  services: {
    title: 'Digital Services & Engineering Solutions | Vision Giants',
    description: 'End-to-end design, development, cloud infrastructure, AI solutions, and dedicated product engineering teams.',
    keywords: 'custom software, web development, app development, cloud architecture',
    ogImage: '/og-image.png',
  },
  careers: {
    title: 'Careers & Open Tech Positions | Vision Giants',
    description: 'Explore high-growth careers in software engineering, mobile development, UI/UX design, and DevOps at Vision Giants.',
    keywords: 'software jobs, frontend developer jobs, backend developer, tech hiring',
    ogImage: '/og-image.png',
  },
  courses: {
    title: 'Vision Giants Academy | Industry-Leading Tech Courses',
    description: 'Master in-demand skills in Full-Stack Development, Mobile Apps, UI/UX, and AI with hands-on projects and expert mentorship.',
    keywords: 'coding bootcamp, tech courses, learn react, flutter training, web development course',
    ogImage: '/og-image.png',
  },
  blog: {
    title: 'Tech Insights, Engineering & Strategy Blog | Vision Giants',
    description: 'In-depth perspectives on modern web and mobile architecture, cloud infrastructure, AI engineering, UI/UX trends, and digital business strategy.',
    keywords: 'tech blog, programming tutorials, software architecture, web development articles',
    ogImage: '/og-image.png',
  },
  team: {
    title: 'Meet Our Leadership & Engineering Team | Vision Giants',
    description: 'Meet the passionate engineers, designers, strategists, and leaders behind Vision Giants.',
    keywords: 'tech team, software developers, executive leadership',
    ogImage: '/og-image.png',
  },
  technologies: {
    title: 'Modern Technology Stack & Architecture | Vision Giants',
    description: 'Explore our vetted stack of modern web, mobile, and cloud technologies designed for high performance, security, and scale.',
    keywords: 'tech stack, react, nodejs, firebase, cloud architecture',
    ogImage: '/og-image.png',
  },
  contact: {
    title: 'Contact Us | Start Your Next Software Project | Vision Giants',
    description: 'Have a project in mind or want to explore our academy courses? Get in touch with our team today.',
    keywords: 'contact vision giants, software consultation, hire developers',
    ogImage: '/og-image.png',
  },
};
