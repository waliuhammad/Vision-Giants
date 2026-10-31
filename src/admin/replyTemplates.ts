import { company } from '../data/company';
import type { Submission } from './submissionsConfig';

/**
 * Pre-written replies for the admin "Reply" buttons. Each service gets its own paragraph and the
 * questions we need answered before quoting; the admin edits the draft before sending.
 * Keys match the service titles offered in the contact form's "Project type" select.
 */
interface ServiceTemplate {
  /** What we do in this area, written as one or two sentences to the client. */
  pitch: string;
  /** Details we need before we can scope and quote. */
  questions: string[];
}

const serviceTemplates: Record<string, ServiceTemplate> = {
  'Website Development': {
    pitch:
      'Our web team builds fast, secure and search-friendly websites and web applications, from company sites to custom portals, designed to turn visitors into customers.',
    questions: [
      'Is this a new website or a redesign of an existing one? If existing, please share the link.',
      'Roughly how many pages or main sections do you have in mind?',
      'Any features you need, such as booking, payments, a client login or a CMS for your own updates?',
      'Two or three websites you like the look or feel of.',
      'Your target launch date.',
    ],
  },
  'App Development': {
    pitch:
      'We design and build native and cross-platform mobile apps for iOS and Android, along with the back end and admin panel that keep them running.',
    questions: [
      'Which platforms do you need: iOS, Android or both?',
      'The core features the first version must have.',
      'Do you already have designs, wireframes or an existing app we would be extending?',
      'Will the app need user accounts, payments, notifications or integration with other systems?',
      'Your target launch date.',
    ],
  },
  Ecommerce: {
    pitch:
      'We build online stores that are easy to manage and convert well, on Shopify, WooCommerce or a fully custom platform, including payments, shipping and inventory.',
    questions: [
      'Roughly how many products do you plan to sell, and do they have variants (size, colour, etc.)?',
      'Do you have a preferred platform, or an existing store to migrate?',
      'Which payment methods and delivery options do you need (cards, cash on delivery, local couriers)?',
      'Will you need integrations such as an ERP, accounting software or marketplaces?',
      'Your target launch date.',
    ],
  },
  'Software Development': {
    pitch:
      'We develop custom software, including internal tools, ERPs, CRMs and SaaS products, built around the way your business actually works.',
    questions: [
      'What process or problem should the software solve, and how is it handled today?',
      'Who will use it, and roughly how many users do you expect?',
      'Does it need to connect to any existing systems, databases or third-party services?',
      'Do you need it hosted in the cloud, on your own servers, or as a desktop application?',
      'Your preferred timeline.',
    ],
  },
  'Artificial Intelligence': {
    pitch:
      'Our AI team builds practical solutions such as chatbots and assistants, document processing, recommendation engines and predictive models, integrated into your existing products and workflows.',
    questions: [
      'What task or decision would you like AI to help with?',
      'What data is available today (documents, databases, images, conversations), and roughly how much?',
      'Should the solution plug into an existing system, or be a standalone tool?',
      'Are there privacy or compliance requirements for the data involved?',
      'How you will measure success (time saved, accuracy, sales, etc.).',
    ],
  },
  Robotics: {
    pitch:
      'We design and program robotic systems for automation, education and research, covering mechanical design, embedded control and the software around them.',
    questions: [
      'What should the robot or system do, and in what environment will it operate?',
      'Is this a prototype, a one-off build or something intended for production?',
      'Any hardware, controllers or platforms you already use or prefer?',
      'Requirements for size, payload, power or safety.',
      'Your target timeline.',
    ],
  },
  'Internet of Things (IoT)': {
    pitch:
      'We build end-to-end IoT solutions: connected devices and sensors, firmware, cloud platforms and the dashboards and apps used to monitor and control them.',
    questions: [
      'What do you want to monitor or control, and where will the devices be installed?',
      'Roughly how many devices are expected, at launch and later?',
      'Do you already have hardware, or do you need us to select or design it?',
      'Connectivity available on site (Wi-Fi, GSM, LoRa, Bluetooth).',
      'How users should see the data: web dashboard, mobile app, alerts or reports.',
    ],
  },
  'Game Development': {
    pitch:
      'We develop 2D and 3D games for mobile, PC and the web, from concept and art through gameplay programming, testing and store release.',
    questions: [
      'The genre and a short description of the game idea.',
      'Target platforms (Android, iOS, PC, web, console).',
      'Do you have a game design document, artwork or references?',
      'Monetisation plans (paid, in-app purchases, ads), if any.',
      'Your target release date.',
    ],
  },
  SEO: {
    pitch:
      'Our SEO specialists help businesses rank higher and attract qualified traffic through technical SEO, on-page optimisation, content strategy and link building, with clear monthly reporting.',
    questions: [
      'Your website address.',
      'The main products, services or keywords you want to rank for.',
      'Your target audience and locations (local city, nationwide or international).',
      'Two or three competitors you would like to outrank.',
      'Whether you have Google Analytics and Search Console set up, and can share access.',
    ],
  },
  'Social Media Marketing': {
    pitch:
      'Our marketing team plans and runs social media campaigns that build your brand and generate leads, covering strategy, content creation, paid ads and performance reporting.',
    questions: [
      'Which platforms matter most to you (Facebook, Instagram, LinkedIn, TikTok, etc.)? Please share your page links.',
      'Your main goal: brand awareness, leads, sales or engagement.',
      'Your target audience and locations.',
      'Your approximate monthly advertising budget, separate from our fees.',
      'Whether you need content creation (posts, reels, graphics) or management of existing content.',
    ],
  },
  'Graphic Design': {
    pitch:
      'Our designers create brand identities and marketing materials, including logos, brand guidelines, social media creatives, packaging and print, that make your business look as good as it is.',
    questions: [
      'What do you need designed (logo, full brand identity, social posts, brochures, packaging, etc.)?',
      'Do you have existing brand colours, fonts or a logo we should work with?',
      'A few designs or brands whose style you like.',
      'Where the designs will be used (print, web, social, signage).',
      'Your deadline.',
    ],
  },
  'Video Editing': {
    pitch:
      'Our video team edits promotional videos, social media reels, YouTube content and corporate videos, including motion graphics, colour grading, subtitles and sound.',
    questions: [
      'The type of video and where it will be published.',
      'How much raw footage you have, and the desired final length.',
      'Whether you need motion graphics, subtitles, voice-over or music licensing.',
      'Any reference videos for the style you want.',
      'How many videos you need, and by when.',
    ],
  },
};

const careersTemplate: ServiceTemplate = {
  pitch:
    'We are always glad to hear from talented people. We review every message and keep promising profiles on file for current and upcoming openings.',
  questions: [
    'Your CV or portfolio (a link is fine).',
    'The role or area you are most interested in.',
    'Your availability and whether you prefer on-site (Multan) or remote work.',
  ],
};

const genericTemplate: ServiceTemplate = {
  pitch: 'We would be glad to help, and want to make sure we understand your needs properly before proposing a solution.',
  questions: [
    'A short description of what you would like to achieve.',
    'Any existing website, app or material we should look at.',
    'Your preferred timeline and budget range.',
  ],
};

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const signature = (sender: string) =>
  [
    'Best regards,',
    '',
    ...(sender ? [sender] : []),
    company.legalName,
    company.tagline,
    ...(company.address ? [company.address] : []),
    ...(company.phones.length ? [company.phones.join(' | ')] : []),
  ].join('\n');

const numbered = (items: string[]) => items.map((q, i) => `${i + 1}. ${q}`);

const quoted = (original: string, receivedAt?: Date) => {
  if (!original) return [];
  const when = receivedAt ? ` (${new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(receivedAt)})` : '';
  return ['', '', `--- Your original message${when} ---`, ...original.split('\n').map((l) => `> ${l}`)];
};

/** Subject and plain-text body for replying to a contact-form inquiry. */
function inquiryReply(item: Submission, sender: string) {
  const firstName = str(item.name).split(/\s+/)[0];
  const service = str(item.projectType);
  const clientCompany = str(item.company);
  const budget = str(item.budget);
  const isCareers = /careers/i.test(service);
  const known = serviceTemplates[service];
  const template = isCareers ? careersTemplate : (known ?? genericTemplate);

  const subject = isCareers
    ? `Re: Your message to ${company.name}`
    : `Re: Your ${known ? `${service} ` : ''}inquiry – ${company.name}`;

  const thanks = isCareers
    ? `Thank you for your interest in joining ${company.name}.`
    : `Thank you for reaching out to ${company.name}${known ? ` about ${service}` : ''}${clientCompany ? ` for ${clientCompany}` : ''}. We have received your inquiry and appreciate the opportunity to work with you.`;

  const budgetLine = budget && !/not sure/i.test(budget) ? ` We have noted your indicated budget of ${budget}.` : '';

  const body = [
    `Dear ${firstName || 'Sir/Madam'},`,
    '',
    thanks,
    '',
    template.pitch,
    '',
    isCareers
      ? 'To help us consider you for the right opportunity, please reply with:'
      : `To prepare an accurate proposal and estimate,${budgetLine ? '' : ' it would help to know a little more.'}${budgetLine} Could you please share:`,
    '',
    ...numbered(template.questions),
    '',
    isCareers
      ? 'If a suitable position opens up, our team will contact you to arrange the next steps.'
      : 'Once we have these details, we will send you a proposal with the recommended approach, timeline and cost. If it is easier, we would also be happy to arrange a short call or meeting at a time that suits you; just let us know your availability.',
    '',
    'We look forward to hearing from you.',
    '',
    signature(sender),
    ...quoted(str(item.message), item.createdAt),
  ].join('\n');

  return { subject, body };
}

/** Subject and plain-text body for acknowledging a job application. */
function applicationReply(item: Submission, sender: string) {
  const firstName = str(item.name).split(/\s+/)[0];
  const position = str(item.positionTitle) || 'General application';
  const general = /general/i.test(position);

  const subject = `Your application${general ? '' : ` for ${position}`} – ${company.name}`;
  const body = [
    `Dear ${firstName || 'Applicant'},`,
    '',
    `Thank you for applying ${general ? 'to' : `for the ${position} position at`} ${company.name}, and for the time you put into your application.`,
    '',
    'We have received your details and our team is currently reviewing them. If your profile matches our requirements, we will contact you to arrange the next steps, which usually include a short technical assessment and an interview.',
    '',
    'In the meantime, feel free to reply to this email with any updated CV, portfolio links or questions you may have.',
    '',
    'We appreciate your interest in joining our team.',
    '',
    signature(sender),
    ...quoted(str(item.message), item.createdAt),
  ].join('\n');

  return { subject, body };
}

export function replyTemplate(collection: 'inquiries' | 'applications', item: Submission, sender: string) {
  return collection === 'inquiries' ? inquiryReply(item, sender) : applicationReply(item, sender);
}
