/**
 * Built-in portfolio, used until content is imported into the admin dashboard.
 * These are live websites built by the team. Screenshots live in public/portfolio/<id>/.
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

const shots = (id: string, names = ['1', '2', '3', 'mobile']) => names.map((n) => `/portfolio/${id}/${n}.webp`);

export const projects: Project[] = [
  {
    id: 'sportif-padel',
    title: 'Sportif Padel',
    category: 'web',
    industry: 'E-commerce · Sports equipment (UAE)',
    summary: 'A bold, dark storefront for a UAE padel racket brand, built to sell premium carbon padels.',
    details:
      'Sportif Padel needed an online store that feels as premium as its carbon rackets. We built a dark, high-contrast storefront with gradient accents, a featured-product hero, shop-by-series navigation and product pages with sale pricing. The checkout flow is built around how customers in the UAE prefer to buy: free delivery, cash on delivery and promo codes, with WhatsApp chat one tap away.',
    features: [
      'Shop by series and featured padels',
      'Sale pricing, promo codes and announcement bar',
      'Cash on delivery and free UAE delivery messaging',
      'Customer accounts, reviews and FAQ',
      'Blog and newsletter sign-up',
    ],
    tech: ['Vite', 'Firebase', 'WhatsApp chat'],
    url: 'https://sportiftrade.com/',
    images: shots('sportif-padel'),
    preview: 'store',
    isDemo: false,
  },
  {
    id: 'petlife-bio',
    title: 'PetLife Bio',
    category: 'web',
    industry: 'E-commerce · Pet care',
    summary: 'A conversion-focused Shopify store for CatCalm, a line of pheromone treatments for cat behaviour problems.',
    details:
      'PetLife Bio sells CatCalm treatments that each target a specific cat behaviour problem. We built a Shopify store with a problem-led landing page: a rotating headline that names each problem, a "what’s going on in your home?" selector that leads to the right product, a comparison against diffusers, and trust signals such as reviews and a money-back guarantee. Email capture and translations are handled through integrated Shopify apps.',
    features: [
      'Problem-led landing page with rotating headline',
      'Behaviour selector that routes to the right product',
      'Product comparison table and trust badges',
      'Email marketing integration (Klaviyo)',
      'Multi-language support (Weglot)',
    ],
    tech: ['Shopify', 'Replo', 'Klaviyo', 'Weglot'],
    url: 'https://www.petlifebio.com/',
    images: shots('petlife-bio'),
    preview: 'store',
    isDemo: false,
  },
  {
    id: 'derma-muse',
    title: 'Derma Muse',
    category: 'web',
    industry: 'E-commerce · Beauty & cosmetics',
    summary: 'A single-product Shopify store for a colour-adapting Korean foundation, with video social proof and subscriptions.',
    details:
      'Derma Muse sells one hero product: a roll-on foundation that adapts to the wearer’s skin tone. The store is designed around that one decision: a clear promise in the hero, a buy-one-get-one offer, customer “first application” videos, a side-by-side comparison with other foundations, and a countdown for time-limited sales. Customers can track shipments and manage subscriptions from the site.',
    features: [
      'Single-product sales page with offer and countdown',
      'Customer video testimonials',
      '“Derma Muse vs others” comparison table',
      'Subscriptions and shipment tracking',
      'Email marketing and behaviour analytics',
    ],
    tech: ['Shopify', 'Klaviyo', 'Seal Subscriptions', 'Microsoft Clarity'],
    url: 'https://dermamuse.co/',
    images: shots('derma-muse'),
    preview: 'store',
    isDemo: false,
  },
  {
    id: 'mae-rose-jewels',
    title: 'Mae & Rose Jewels',
    category: 'web',
    industry: 'E-commerce · Handcrafted jewellery',
    summary: 'An elegant Shopify boutique for handcrafted jewellery, with collections for rings, earrings, bracelets and copper pieces.',
    details:
      'Mae & Rose sells handcrafted jewellery, and the store needed to feel warm and personal. We built a classic, typography-led Shopify boutique: a serif wordmark, a soft pink announcement bar, full-width lifestyle imagery and clean product grids. Collections are organised by type, and tiered multi-buy discounts are applied automatically in the cart. Order tracking, newsletter sign-up and shipping protection are included.',
    features: [
      'Collections for rings, earrings, bracelets, necklaces and copper',
      'Bestsellers and sale pricing',
      'Automatic tiered multi-buy discounts',
      'Order tracking and shipping protection',
      'Newsletter pop-up with first-order discount',
    ],
    tech: ['Shopify', 'Klaviyo', 'Pinterest tag'],
    url: 'https://maeroseboutique.com/',
    images: shots('mae-rose-jewels'),
    preview: 'store',
    isDemo: false,
  },
  {
    id: 'toyland',
    title: 'ToyLand',
    category: 'web',
    industry: 'E-commerce · Toys',
    summary: 'A playful, Pinterest-inspired toy shop with category and age-based browsing and its own admin portal.',
    details:
      'ToyLand is a colourful online toy shop designed to delight parents and kids alike. The storefront uses a Pinterest-style image gallery, bright gradients and playful animations. Shoppers can browse by category (educational, plush, puzzles, outdoor) or by age group, save favourites and quick-view products. Behind the scenes, the store runs on Firebase with an admin portal for managing products and orders.',
    features: [
      'Pinterest-style hero gallery',
      'Shop by category and by age',
      'Quick view, favourites and cart',
      'Order and payment history',
      'Admin portal for products and orders',
    ],
    tech: ['Firebase', 'Cloud Firestore'],
    url: 'https://www.thetoylandshop.com/',
    images: shots('toyland'),
    preview: 'store',
    isDemo: false,
  },
  {
    id: 'living-space-hub',
    title: 'Living Space Hub',
    category: 'web',
    industry: 'E-commerce · Home décor',
    summary: 'A premium home-décor store with a glass-effect hero slider, room-based categories and curated collections.',
    details:
      'Living Space Hub sells curated furniture, lighting and décor. We designed an editorial storefront with a full-screen hero slider behind a frosted-glass panel, serif headings, and categories organised by room: living room, bedroom, décor and workspace. Trending products, seasonal offers, customer stories and a design-community newsletter round out the home page. Product images are delivered through Cloudinary for fast loading.',
    features: [
      'Full-screen hero slider with frosted-glass panel',
      'Shop by room category',
      'Trending products and seasonal offers',
      'Customer accounts and testimonials',
      'Optimised image delivery',
    ],
    tech: ['React', 'Firebase', 'Cloudinary'],
    url: 'https://livingspaceshub.com/',
    images: shots('living-space-hub'),
    preview: 'store',
    isDemo: false,
  },
  {
    id: 'tern-technologies',
    title: 'Tern Technologies',
    category: 'web',
    industry: 'E-commerce · Computer hardware (Pakistan)',
    summary: 'An industrial-style hardware store for processors, graphics cards and networking gear, delivered across Pakistan.',
    details:
      'Tern Technologies distributes professional computer hardware. The site uses a bold, italic “performance” design language with a clean light theme. Customers browse departments such as processors, graphics cards, motherboards, storage and networking, compare featured components with prices in rupees, and choose from infrastructure tiers (Essential to Extreme). Logistics, warranty and a customer login hub are built in.',
    features: [
      'Departments with live product counts',
      'Featured components with pricing',
      'Infrastructure tiers for different budgets',
      'Logistics and warranty pages',
      'Customer login hub',
    ],
    tech: ['React', 'Firebase'],
    url: 'https://terntechshop.com/',
    images: shots('tern-technologies'),
    preview: 'store',
    isDemo: false,
  },
  {
    id: 'visionary-it',
    title: 'Visionary IT Services',
    category: 'web',
    industry: 'IT services · Software & licences',
    summary: 'A modern IT consultancy site with a shop for software licences, web templates and SaaS tools.',
    details:
      'Visionary IT offers consultancy, custom software and digital products. We built a dark-navy site with a bento-style image grid in the hero and a shop for software licences, web templates, mobile apps and SaaS tools. Trending products, promotional offers, client testimonials and a newsletter sign-up support sales, and customers can create accounts to buy.',
    features: [
      'Bento-grid hero',
      'Product categories: licences, templates, apps, SaaS tools',
      'Trending products and promotional offers',
      'Customer accounts and cart',
      'Testimonials and newsletter',
    ],
    tech: ['React'],
    url: 'https://visionaryitservice.com/',
    images: shots('visionary-it'),
    preview: 'dashboard',
    isDemo: false,
  },
  {
    id: 'alexa-movers',
    title: 'Alexa Movers',
    category: 'web',
    industry: 'Services · Moving & packing (UAE)',
    summary: 'A lead-generation website for a Dubai moving company, with an instant quote form, service pages and area coverage.',
    details:
      'Alexa Movers needed a website that turns visitors into quote requests. The hero puts “Get Free Quote” and “Call Us Now” front and centre, and a move-size quote form (studio to villa, office or warehouse) follows straight after. The site covers each service, package pricing by apartment size, the areas served across the UAE, testimonials, FAQs and a blog with moving tips. Call and WhatsApp buttons stay visible on every page.',
    features: [
      'Quote form by move size',
      'Service and pricing packages',
      'Areas served across the UAE',
      'Testimonials, FAQ and blog',
      'Sticky call and WhatsApp buttons',
    ],
    tech: ['React', 'Firebase', 'Cloudinary'],
    url: 'https://alexamovers.ae/',
    images: shots('alexa-movers'),
    preview: 'booking',
    isDemo: false,
  },
  {
    id: 'al-farooqia-trust',
    title: 'Al-Farooqia Trust',
    category: 'web',
    industry: 'Non-profit · Welfare & healthcare',
    summary: 'A website for a Pakistani welfare trust, covering its projects and events, with online donations and relief registration.',
    details:
      'Al-Farooqia Trust runs free ambulance, dialysis, medical-camp, clean-water and relief programmes across Pakistan. The website presents this work with warmth and transparency: a clear donation call to action, project pages for each programme, events, and highlights of past initiatives. Bilingual English and Urdu sections cover flood-relief registration and orphan-education appeals, and visitors can sign up as volunteers or download the trust’s app.',
    features: [
      'Donation and app-download calls to action',
      'Project pages for each welfare programme',
      'Disaster-relief registration form',
      'English and Urdu content',
      'Events and volunteer sign-up',
    ],
    tech: ['React', 'Firebase'],
    url: 'https://alfarooqiatrust.org/',
    images: shots('al-farooqia-trust'),
    preview: 'learning',
    isDemo: false,
  },
  {
    id: 'mii-marketing',
    title: 'MII Marketing Management',
    category: 'web',
    industry: 'Agency · Digital marketing',
    summary: 'A website for an international digital agency, with mega-menus for services, a portfolio, a blog and consultation booking.',
    details:
      'MII Marketing Management offers SEO, paid ads, web development and marketplace management. We built a dark, tech-styled agency site with a rotating hero that cycles through its services, alongside a featured service card. Dropdown menus organise more than a dozen services across digital marketing, development and e-commerce. A five-step process, client results, testimonials, blog insights and a consultation form complete the site.',
    features: [
      'Rotating service hero',
      'Mega-menus for marketing, development and e-commerce',
      'Five-step growth process',
      'Portfolio, testimonials and blog',
      'Free-consultation lead form',
    ],
    tech: ['React'],
    url: 'https://miimarketing.com/',
    images: shots('mii-marketing'),
    preview: 'dashboard',
    isDemo: false,
  },
  {
    id: 'ai-brand-craft',
    title: 'AI Brand Craft',
    category: 'web',
    industry: 'Agency · Digital marketing',
    summary: 'A digital-marketing agency site with a typing-effect hero, service pages and call scheduling.',
    details:
      'AI Brand Craft provides SEO, PPC, social media and email marketing alongside web development. The site pairs a light, professional palette with a typing-effect headline that cycles through its services, a portrait hero with animated brand graphics, and service chips for quick navigation. Further down are service details, featured projects, testimonials, an FAQ and a quote form, plus a “Schedule a call” button in the header.',
    features: [
      'Typing-effect hero headline',
      'Service chips and detailed service sections',
      'Featured projects and testimonials',
      'Quote form and call scheduling',
      'WhatsApp contact',
    ],
    tech: ['React', 'Firebase'],
    url: 'https://aibrandcrafts.com/',
    images: shots('ai-brand-craft'),
    preview: 'dashboard',
    isDemo: false,
  },
  {
    id: 'zmart',
    title: 'zMart',
    category: 'web',
    industry: 'Agency · Amazon marketplace services',
    summary: 'A website for a full-service Amazon agency, covering account management, PPC, listings and A+ content design.',
    details:
      'zMart helps brands launch and grow on Amazon. The dark, star-field design features an animated wireframe globe, a two-tier navigation bar, and two calls to action: a free audit and a fast quote. The site covers zMart’s services (full-store management, listing optimisation, PPC, product photography and A+ content), the categories it works in, its three-part process, case studies and testimonials.',
    features: [
      'Animated hero with wireframe globe',
      'Two-tier navigation with dropdowns',
      'Free audit and fast-quote lead capture',
      'Service, category and process sections',
      'A+ design portfolio and testimonials',
    ],
    tech: ['React', 'Firebase'],
    url: 'https://zmartecomagency.com/',
    images: shots('zmart', ['1', '3', 'mobile']),
    preview: 'dashboard',
    isDemo: false,
  },
  {
    id: 'yousaf-traders',
    title: 'Yousaf Traders',
    category: 'web',
    industry: 'B2B · Procurement & supplies (Pakistan)',
    summary: 'A B2B site for a Peshawar general-order supplier, with a product catalogue, tender information and quotation requests.',
    details:
      'Yousaf Traders supplies office, IT, electrical, safety and construction goods to government, corporate and institutional buyers. We built a dark, gold-accented corporate site with sections for products, services, industries, projects, government tenders and a downloadable catalogue. The site is built around one action: requesting a quotation, with a 24-hour response promise and direct call and WhatsApp contact.',
    features: [
      'Product catalogue and services',
      'Industries, projects and tenders pages',
      'Request-a-quotation flow',
      'Click-to-call and WhatsApp contact',
      'Structured footer with full contact details',
    ],
    tech: ['React'],
    url: 'https://yousaftradersuppliers.com/',
    images: shots('yousaf-traders', ['1', '3', 'mobile']),
    preview: 'kanban',
    isDemo: false,
  },
  {
    id: 'apppanda',
    title: 'AppPanda',
    category: 'web',
    industry: 'E-commerce · Digital subscriptions',
    summary: 'A storefront for premium AI, SEO and creative software subscriptions, with ordering through WhatsApp.',
    details:
      'AppPanda sells subscriptions to tools such as ChatGPT Plus, Canva Pro and Adobe Creative Cloud. The black-and-yellow design highlights discounts with a scrolling ticker and “verified” badges. Products are organised into tools, bundles and courses, each with ratings and pricing, and orders go through WhatsApp. Products and images are managed in Firebase and Cloudinary.',
    features: [
      'Discount ticker and verified product badges',
      'Tools, bundles and courses catalogue',
      'Ratings and pricing on every product card',
      'WhatsApp ordering and support',
      'Content managed in Firebase',
    ],
    tech: ['React', 'Firebase', 'Cloudinary'],
    url: 'https://apppanda.store/',
    images: shots('apppanda'),
    preview: 'store',
    isDemo: false,
  },
];

/** Which portfolio category is shown on each service's page (keys are service ids in services.ts). */
export const serviceProjectCategory: Record<string, ProjectCategory> = {
  'website-development': 'web',
  ecommerce: 'ecommerce',
  'app-development': 'mobile',
  'software-development': 'custom',
};
