import { company } from '../data/company';
import { services } from '../data/services';

/** Public site origin, without trailing slash. Set VITE_SITE_URL before a production build. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.example.com').replace(/\/+$/, '');

export interface PageMeta {
  path: string;
  title: string;
  description: string;
}

export const pages: PageMeta[] = [
  {
    path: '/',
    title: `${company.name} | Web, Mobile & Custom Software Development`,
    description:
      'We design and build modern web applications, mobile apps and custom software that help businesses grow. Start your project with our team.',
  },
  {
    path: '/services/',
    title: `Services | Web, Mobile, E-Commerce & UI/UX | ${company.name}`,
    description:
      'End-to-end digital services: web development, mobile applications, custom software, e-commerce, UI/UX design and cloud integrations.',
  },
  {
    path: '/portfolio/',
    title: `Portfolio | Websites We’ve Built | ${company.name}`,
    description:
      'Live websites we have designed and built: e-commerce stores, service businesses, agencies, B2B suppliers and non-profits.',
  },
  {
    path: '/about/',
    title: `About Us | Our Mission, Values & Process | ${company.name}`,
    description:
      'Learn how our team turns ideas into digital products: our mission, values and transparent, four-step development process.',
  },
  {
    path: '/technologies/',
    title: `Technologies | React, Node.js, Firebase & Cloudinary | ${company.name}`,
    description:
      'The modern technology stack we use to build scalable, secure and high-performance web, mobile and cloud applications.',
  },
  {
    path: '/contact/',
    title: `Contact | Start a Project | ${company.name}`,
    description:
      'Tell us about your project. Share your goals, timeline and budget, and we will get back to you to discuss next steps.',
  },
  {
    path: '/careers/',
    title: `Careers | Build Your Future With Us | ${company.name}`,
    description:
      'Interested in joining our team? Learn about our culture and working principles, and how to express your interest.',
  },
  {
    path: '/careers/apply/',
    title: `Apply | Careers | ${company.name}`,
    description: 'Apply for an open position or send a general application with your CV.',
  },
  // One page per service (src/pages/ServiceDetailPage.tsx)
  ...services.map((s) => ({
    path: `/services/${s.id}/`,
    title: `${s.title} | Services | ${company.name}`,
    description: s.short,
  })),
];

/** Client-only admin dashboard shell (not indexed, not in the sitemap). */
export const adminMeta: PageMeta = {
  path: '/admin/',
  title: `Admin | ${company.name}`,
  description: 'Website administration.',
};

export const notFoundMeta: PageMeta = {
  path: '/404',
  title: `Page Not Found | ${company.name}`,
  description: 'The page you are looking for could not be found.',
};

export function getPageMeta(path: string): PageMeta {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return pages.find((p) => p.path === normalized) ?? notFoundMeta;
}

export const canonicalUrl = (path: string) => `${SITE_URL}${path}`;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Organization JSON-LD, emitted only when real company details are configured. */
function organizationJsonLd(): string {
  if (company.isPlaceholder) return '';
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    alternateName: company.name,
    url: SITE_URL,
    description: company.description,
  };
  if (company.email) data.email = company.email;
  if (company.phone) data.telephone = company.phone;
  if (company.social.length) data.sameAs = company.social.map((s) => s.href);
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

/** Head tags injected into each prerendered HTML file. */
export function renderHeadTags(meta: PageMeta): string {
  const noIndex = meta === notFoundMeta || meta === adminMeta;
  const url = canonicalUrl(meta.path);
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    noIndex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(company.name)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    noIndex ? '' : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    meta.path === '/' ? organizationJsonLd() : '',
  ]
    .filter(Boolean)
    .join('\n    ');
}
