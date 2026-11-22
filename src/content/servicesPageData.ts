export interface ServiceWhyReason {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServicesPageVisibility {
  hero: boolean;
  whatWeDo: boolean;
  whyChooseUs: boolean;
  services: boolean;
  faq: boolean;
  cta: boolean;
}

export interface ServicesPageData {
  // 1. Hero Banner
  heroEyebrow: string;
  heroTitle: string;
  heroBreadcrumb: string;
  heroBackgroundImage: string;

  // 2. What We Do
  whatWeDoBadge: string;
  whatWeDoHeading: string;
  whatWeDoDescription1: string;
  whatWeDoDescription2: string;
  whatWeDoFocusHeading: string;
  whatWeDoFocusPoints: string[];

  // 3. Why Choose Us
  whyChooseUsBadge: string;
  whyChooseUsHeading: string;
  whyChooseUsImage: string;
  whyChooseUsImageAlt: string;
  whyChooseUsReasons: ServiceWhyReason[];

  // 4. Services Grid
  servicesGridBadge: string;
  servicesGridHeading: string;
  servicesGridLead: string;
  featuredServiceId: string;

  // 5. Visibility
  visibility: ServicesPageVisibility;
}

export const defaultServicesPageData: ServicesPageData = {
  // 1. Hero Banner
  heroEyebrow: 'Services',
  heroTitle: 'Services',
  heroBreadcrumb: 'Home → Services',
  heroBackgroundImage:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80',

  // 2. What We Do
  whatWeDoBadge: 'What we do',
  whatWeDoHeading: 'Building Powerful Digital Solutions for Businesses Ready to Scale',
  whatWeDoDescription1:
    'At Vision Giants, we design and develop custom software that solves real business problems. From web applications to enterprise platforms, our engineering team delivers reliable, scalable products that grow with your business.',
  whatWeDoDescription2:
    'Whether you need a customer-facing web application, a cross-platform mobile app, an AI-powered automation, or a data-driven e-commerce store, we apply proven engineering practices to bring your vision to life.',
  whatWeDoFocusHeading: 'Key Areas We Focus On',
  whatWeDoFocusPoints: [
    'Custom Web & Mobile Application Development',
    'E-Commerce Platforms & Online Stores',
    'Artificial Intelligence & Automation',
    'Robotics & IoT Solutions',
    'Social Media Marketing & SEO',
    'Graphic Design & Video Editing',
  ],

  // 3. Why Choose Us
  whyChooseUsBadge: 'Why Choose Us?',
  whyChooseUsHeading: 'Why Choose Vision Giants for Your Next Digital Project?',
  whyChooseUsImage: '/images/services/why-choose-us.jpg',
  whyChooseUsImageAlt: 'Vision Giants strategic consulting and transformation team in collaboration',
  whyChooseUsReasons: [
    {
      id: 'expert-team',
      title: 'Experienced Engineering Team',
      description:
        'Work with skilled software engineers and designers who bring deep technical expertise to every project.',
      icon: 'award',
    },
    {
      id: 'proven-results',
      title: 'Proven Delivery Track Record',
      description:
        'We have shipped 22+ live projects for clients in the UK, UAE and Pakistan — on time, on scope, and built to last.',
      icon: 'star',
    },
    {
      id: 'tailored-solutions',
      title: 'Tailored Software Solutions',
      description:
        'Every project starts with understanding your business goals — we design and build solutions specific to your needs, not generic templates.',
      icon: 'target',
    },
    {
      id: 'transparent-process',
      title: 'Transparent & Collaborative Process',
      description:
        'Clear scope, regular demos and honest communication at every stage so you always know where your project stands.',
      icon: 'shield-check',
    },
  ],

  // 4. Services Grid
  servicesGridBadge: 'Our Services',
  servicesGridHeading: 'Digital Services Built to *Grow* Your Business',
  servicesGridLead:
    'Explore our comprehensive suite of digital and engineering services — from web and mobile development to AI, robotics, and digital marketing.',
  featuredServiceId: 'robotics',

  // 5. Visibility
  visibility: {
    hero: true,
    whatWeDo: true,
    whyChooseUs: true,
    services: true,
    faq: true,
    cta: true,
  },
};

type Data = Record<string, unknown>;

const str = (v: unknown, fallback = '') => (typeof v === 'string' && v.trim() ? v : fallback);
const bool = (v: unknown, fallback = true) => (typeof v === 'boolean' ? v : fallback);
const strList = (v: unknown, fallback: string[]) =>
  Array.isArray(v) && v.length ? v.filter((x): x is string => typeof x === 'string') : fallback;

export function servicesPageDataFromDoc(d: Data): ServicesPageData {
  const vis = (d.visibility as Record<string, unknown>) || {};
  const rawReasons = Array.isArray(d.whyChooseUsReasons) ? d.whyChooseUsReasons : [];

  const parsedReasons: ServiceWhyReason[] = rawReasons.map((r, i) => {
    const item = (r || {}) as Record<string, unknown>;
    return {
      id: str(item.id, `reason-${i + 1}`),
      title: str(item.title, 'Benefit'),
      description: str(item.description, ''),
      icon: str(item.icon, 'award'),
    };
  });

  return {
    heroEyebrow: str(d.heroEyebrow, defaultServicesPageData.heroEyebrow),
    heroTitle: str(d.heroTitle, defaultServicesPageData.heroTitle),
    heroBreadcrumb: str(d.heroBreadcrumb, defaultServicesPageData.heroBreadcrumb),
    heroBackgroundImage: str(d.heroBackgroundImage, defaultServicesPageData.heroBackgroundImage),

    whatWeDoBadge: str(d.whatWeDoBadge, defaultServicesPageData.whatWeDoBadge),
    whatWeDoHeading: str(d.whatWeDoHeading, defaultServicesPageData.whatWeDoHeading),
    whatWeDoDescription1: str(d.whatWeDoDescription1, defaultServicesPageData.whatWeDoDescription1),
    whatWeDoDescription2: str(d.whatWeDoDescription2, defaultServicesPageData.whatWeDoDescription2),
    whatWeDoFocusHeading: str(d.whatWeDoFocusHeading, defaultServicesPageData.whatWeDoFocusHeading),
    whatWeDoFocusPoints: strList(d.whatWeDoFocusPoints, defaultServicesPageData.whatWeDoFocusPoints),

    whyChooseUsBadge: str(d.whyChooseUsBadge, defaultServicesPageData.whyChooseUsBadge),
    whyChooseUsHeading: str(d.whyChooseUsHeading, defaultServicesPageData.whyChooseUsHeading),
    whyChooseUsImage: str(d.whyChooseUsImage, defaultServicesPageData.whyChooseUsImage),
    whyChooseUsImageAlt: str(d.whyChooseUsImageAlt, defaultServicesPageData.whyChooseUsImageAlt),
    whyChooseUsReasons:
      parsedReasons.length > 0 ? parsedReasons : defaultServicesPageData.whyChooseUsReasons,

    servicesGridBadge: str(d.servicesGridBadge, defaultServicesPageData.servicesGridBadge),
    servicesGridHeading: str(d.servicesGridHeading, defaultServicesPageData.servicesGridHeading),
    servicesGridLead: str(d.servicesGridLead, defaultServicesPageData.servicesGridLead),
    featuredServiceId: str(d.featuredServiceId, defaultServicesPageData.featuredServiceId),

    visibility: {
      hero: bool(vis.hero, true),
      whatWeDo: bool(vis.whatWeDo, true),
      whyChooseUs: bool(vis.whyChooseUs, true),
      services: bool(vis.services, true),
      faq: bool(vis.faq, true),
      cta: bool(vis.cta, true),
    },
  };
}

