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
  whatWeDoHeading: 'Empowering You to Live Your Best Life & Achieve Lasting Personal Transformation',
  whatWeDoDescription1:
    'At Vision Giants, we believe true transformation starts with clarity and action. Our tailored digital and engineering services are designed to provide personalized support, actionable strategies, and empowering tools to help you unlock your full potential.',
  whatWeDoDescription2:
    'Whether you are looking to scale your business architecture, build high-growth web and mobile platforms, or harness the power of artificial intelligence, we are here to guide you every step of the way.',
  whatWeDoFocusHeading: 'Key Areas We Focus On',
  whatWeDoFocusPoints: [
    'Personal Growth & Mindset Mastery',
    'Career Development & Success',
    'Relationship & Team Transformation',
    'Goal Setting & Rapid Achievement',
    'Health & Operational Wellness',
    'Enterprise Cloud & Scalability',
  ],

  // 3. Why Choose Us
  whyChooseUsBadge: 'Why Choose Us?',
  whyChooseUsHeading: 'Why Choose Us for Your Personal Transformation Journey?',
  whyChooseUsImage:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
  whyChooseUsImageAlt: 'Professional mentor and advisor smiling at desk',
  whyChooseUsReasons: [
    {
      id: 'certified-coaching',
      title: 'Certified Expert Coaching',
      description:
        'Work with a professionally certified team committed to your personal and business growth success.',
      icon: 'award',
    },
    {
      id: 'proven-stories',
      title: 'Proven Success Stories',
      description:
        'Join hundreds of clients who have unlocked their potential, transformed their workflows, and scaled.',
      icon: 'star',
    },
    {
      id: 'action-plans',
      title: 'Customized Action Plans',
      description:
        'Get solutions tailored to your unique goals — with clear, actionable steps to move you forward with confidence.',
      icon: 'target',
    },
    {
      id: 'judgment-free',
      title: 'Supportive, Judgment-Free Space',
      description:
        'Transparent collaboration, dedicated communication, and continuous support through every milestone.',
      icon: 'shield-check',
    },
  ],

  // 4. Services Grid
  servicesGridBadge: 'Our Services',
  servicesGridHeading: 'Tailored Services to *Grow & Protect* Your Wealth',
  servicesGridLead:
    'Explore our comprehensive suite of tailored digital solutions engineered to scale your operations, build long-term value, and accelerate your vision.',
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

