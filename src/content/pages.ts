/**
 * Editable text for each website page. The defaults below are what the site shows until a page is
 * edited in Admin → Site pages; edits are saved to Firestore `pages/<id>` and override only the
 * fields that were changed. Wrap words in *asterisks* in a title to show them in the accent colour.
 *
 * Keys are used by the pages via usePageText(id) (src/content/ContentContext.tsx), so renaming a key
 * here means renaming it in the page too.
 */
export interface PageField {
  key: string;
  label: string;
  /** Multi-line input in the editor. */
  long?: boolean;
  default: string;
}

export interface PageSection {
  title: string;
  fields: PageField[];
}

export interface PageDef {
  id: string;
  title: string;
  path: string;
  sections: PageSection[];
}

const hero = (eyebrow: string, title: string, lead: string): PageSection => ({
  title: 'Top of page',
  fields: [
    { key: 'heroEyebrow', label: 'Small label', default: eyebrow },
    { key: 'heroTitle', label: 'Main heading', default: title },
    { key: 'heroLead', label: 'Intro text', long: true, default: lead },
  ],
});

const heading = (prefix: string, sectionTitle: string, eyebrow: string, title: string, lead: string): PageSection => ({
  title: sectionTitle,
  fields: [
    { key: `${prefix}Eyebrow`, label: 'Small label', default: eyebrow },
    { key: `${prefix}Title`, label: 'Heading', default: title },
    { key: `${prefix}Lead`, label: 'Intro text', long: true, default: lead },
  ],
});

const cta = (title: string, text: string): PageSection => ({
  title: 'Closing call to action',
  fields: [
    { key: 'ctaTitle', label: 'Heading', default: title },
    { key: 'ctaText', label: 'Text', long: true, default: text },
  ],
});

export const pageDefs: PageDef[] = [
  {
    id: 'home',
    title: 'Home',
    path: '/',
    sections: [
      hero(
        'Your digital growth partner',
        'Building *Digital Experiences* That Move Businesses Forward.',
        'We design and develop high-quality websites, applications and custom software that help businesses operate smarter, grow faster and compete confidently.',
      ),
      heading(
        'services',
        'Services section',
        'What we do',
        'End-to-end digital solutions for your business',
        'A complete range of design and development services to help you plan, build and scale digital products.',
      ),
      heading(
        'work',
        'Selected work section',
        'Selected work',
        'Live products built for real businesses',
        'Websites and online stores we’ve designed and built for clients in e-commerce, services, B2B and non-profit.',
      ),
      heading(
        'why',
        'Why Vision Giants section',
        'Why Vision Giants',
        'A partner focused on quality and clarity',
        'We combine product thinking with solid engineering to deliver software that works well today and stays maintainable tomorrow.',
      ),
      heading(
        'tech',
        'Technology section',
        'Technology expertise',
        'A modern, well-supported stack',
        'We choose proven tools for each project and keep the stack as simple as the requirements allow.',
      ),
      cta(
        'Have an idea? Let’s build something great.',
        'Tell us what you want to build. We’ll help you shape the scope, choose the right technology and plan a clear path to launch.',
      ),
    ],
  },
  {
    id: 'about',
    title: 'About',
    path: '/about/',
    sections: [
      hero(
        'About us',
        'Turning Ideas into Exceptional Digital Products.',
        'We are a team of developers, designers and problem-solvers focused on building digital products that create real value for the businesses and people who use them.',
      ),
      {
        title: 'Who we are section',
        fields: [
          { key: 'introEyebrow', label: 'Small label', default: 'Who we are' },
          { key: 'introTitle', label: 'Heading', default: 'Design and engineering under one roof' },
        ],
      },
      {
        title: 'Values section',
        fields: [
          { key: 'valuesEyebrow', label: 'Small label', default: 'Our values' },
          { key: 'valuesTitle', label: 'Heading', default: 'What guides our work' },
        ],
      },
      heading('approach', 'Approach section', 'Our approach', 'How we think about building software', 'Principles that shape every project, whatever its size.'),
      heading(
        'process',
        'Process section',
        'Our process',
        'A simple, transparent process',
        'We follow a clear process to turn your ideas into successful digital products.',
      ),
      cta(
        'Let’s build something meaningful together.',
        'Tell us what you want to build. We’ll help you shape the scope, choose the right technology and plan a clear path to launch.',
      ),
    ],
  },
  {
    id: 'services',
    title: 'Services',
    path: '/services/',
    sections: [
      hero(
        'Our services',
        'End-to-End Digital Solutions for Modern Businesses',
        'From the first idea to launch and beyond, we design, build and integrate the digital products your business needs to grow.',
      ),
      heading('list', 'Services list section', 'What we do', 'Everything you need to build and scale', 'Pick a single service or combine them into a complete product team.'),
      heading(
        'process',
        'Process section',
        'How we work',
        'A simple, transparent process',
        'Short feedback loops and clear milestones keep projects predictable.',
      ),
      cta('Ready to start your project?', 'Share a few details about what you want to build and we’ll suggest the best way forward.'),
    ],
  },
  {
    id: 'team',
    title: 'Team',
    path: '/team/',
    sections: [
      {
        title: 'Top of page',
        fields: [
          { key: 'heroTitle', label: 'Main heading', default: 'Meet our Team' },
          {
            key: 'heroLead',
            label: 'Intro text',
            long: true,
            default: 'A diverse team of passionate professionals with unique skills driving innovation and excellence in every project.',
          },
        ],
      },
      {
        title: 'Team list section',
        fields: [
          { key: 'gridTitle', label: 'Heading', default: 'Team' },
          {
            key: 'gridLead',
            label: 'Intro text',
            long: true,
            default:
              'A diverse group of passionate professionals, each bringing unique skills and experiences to drive innovation and excellence in every project we undertake.',
          },
        ],
      },
      cta(
        'Want to build the future with us? Join our team.',
        'We are always looking for passionate engineers, designers and strategists who care about craftsmanship and solving hard problems.',
      ),
    ],
  },
  {
    id: 'technologies',
    title: 'Technologies',
    path: '/technologies/',
    sections: [
      hero(
        'Our technologies',
        'Modern Technologies. Thoughtful Engineering.',
        'We use a modern, well-supported technology stack to build scalable, secure and high-performance applications for the web, mobile and cloud.',
      ),
      heading('core', 'Core stack section', 'Core stack', 'Tools we build with', 'Each tool is chosen for a clear purpose and combined according to what your project actually needs.'),
      heading(
        'arch',
        'Architecture section',
        'How it fits together',
        'A typical application architecture',
        'A simplified view of how these technologies commonly work together in a modern web application.',
      ),
      cta('Not sure which technology is right for you?', 'We’ll help you weigh the options and choose a stack that fits your goals, budget and team.'),
    ],
  },
  {
    id: 'careers',
    title: 'Careers',
    path: '/careers/',
    sections: [
      hero(
        'Careers',
        'Build Your Future With Us.',
        'We’re always interested in meeting talented, curious people who love building great digital products. Learn how we work and how to get in touch.',
      ),
      heading('culture', 'Culture section', 'Culture', 'How we work together', 'The working principles we aim to live by every day.'),
      heading('apply', 'How to apply section', 'How to apply', 'Getting in touch', 'There’s no complicated process. Here’s how to introduce yourself.'),
      cta(
        'Interested in working with us?',
        'Tell us about yourself and the kind of work you’d love to do. We’ll keep your details in mind for future opportunities.',
      ),
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    path: '/contact/',
    sections: [
      hero(
        'Get in touch',
        'Let’s Build Something Great Together.',
        'Have a project in mind or just want to say hello? Tell us a little about what you’re planning and we’ll get back to you to discuss the next steps.',
      ),
      {
        title: 'Form',
        fields: [{ key: 'formTitle', label: 'Form heading', default: 'Start a project' }],
      },
    ],
  },
  {
    id: 'blog',
    title: 'Blog',
    path: '/blog/',
    sections: [
      hero(
        'Insights & Ideas',
        'Insights, Ideas & Innovation.',
        'In-depth perspectives on modern web and mobile architecture, cloud infrastructure, AI engineering, UI/UX trends, and digital business strategy.',
      ),
    ],
  },
];

export type PageTexts = Record<string, Record<string, string>>;

const defaults: Record<string, Record<string, string>> = Object.fromEntries(
  pageDefs.map((p) => [p.id, Object.fromEntries(p.sections.flatMap((s) => s.fields.map((f) => [f.key, f.default])))]),
);

/** Text for one field: the saved edit if there is one, otherwise the built-in default. */
export function resolvePageText(texts: PageTexts, pageId: string, key: string): string {
  const edited = texts[pageId]?.[key];
  return (typeof edited === 'string' && edited.trim()) || defaults[pageId]?.[key] || '';
}

/** Keeps only known string fields from a Firestore page document. */
export function pageTextsFromDoc(pageId: string, data: Record<string, unknown>): Record<string, string> {
  const known = defaults[pageId] ?? {};
  return Object.fromEntries(
    Object.entries(data).filter(([k, v]) => k in known && typeof v === 'string' && v.trim()) as [string, string][],
  );
}
