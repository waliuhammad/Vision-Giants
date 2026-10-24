# Software House Website

A prerendered marketing website for a software house, built with React, Vite, TypeScript and React Router, with a Firebase backend and an admin dashboard. The theme follows the Vision Giants brand: a deep navy background, a floating light pill header, monospace uppercase labels and navy pill buttons.

> **Branding.** Name and logo are Vision Giants Pvt Ltd (`src/data/company.ts`, `public/logo-mark.png`). Contact details are still empty, so they stay hidden, and `public/og-image.png` still shows the old placeholder name. See [Configuration still required](#configuration-still-required).

## Commands

Requires Node.js 20+ (tested with Node 24).

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:5173 (client-rendered)
npm run build        # typecheck → client build → server build → prerender all pages
npm run preview      # serve the prerendered output at http://localhost:4173
npm run typecheck    # TypeScript only (site + functions)
npm run emulators    # local Firebase emulators (see Backend)
```

Deploy with `firebase deploy` (see [Backend](#backend-firebase)). The public pages in `dist/client/` also work on any static host, as long as it serves `404.html` for unknown paths and rewrites `/admin/**` to `/admin/index.html`.

## Pages

| Route | Page | Highlights |
|---|---|---|
| `/` | Home | Animated canvas globe hero, capability strip, services, featured concepts, values, process timeline, CTA |
| `/services/` | Services | Overview cards, per-service details with deliverables (anchor links `#web-development` …), process, FAQ |
| `/portfolio/` | Portfolio | Working category filters with layout animation, accessible project detail dialog (native `<dialog>`) |
| `/about/` | About | Introduction, mission & vision, values, approach, process |
| `/technologies/` | Technologies | React / Node.js / Firebase / Cloudinary cards, architecture diagram, supporting tools |
| `/contact/` | Contact | Validated inquiry form with honeypot + timing spam checks and honest submission states |
| `/careers/` | Careers | Culture, open positions (empty state when none are published), disciplines, how to apply |
| `/careers/apply/` | Apply | Application form with CV upload; `?position=<id>` preselects a role |
| `/admin/` | Admin dashboard | Client-only and `noindex`. Inquiries, applications and content management (see [Backend](#backend-firebase)) |

## Architecture

- **Prerendering.** Uses Vite's standard SSR pattern with no extra dependencies:
  1. `vite build` produces the client bundle in `dist/client/`.
  2. `vite build --ssr src/entry-server.tsx` produces a render function.
  3. `scripts/prerender.mjs` loads the managed content (from Firestore, or the built-in defaults) and renders every route in `src/config/seo.ts` to `dist/client/<route>/index.html`. It injects that page's title, description, canonical URL, Open Graph and Twitter tags, plus the content as `window.__CONTENT__`, so the browser hydrates from the same data. It also writes `404.html` (`noindex`), the `/admin/` shell, `sitemap.xml` and `robots.txt`.
- **Single sources of truth.**
  - `src/data/company.ts`: name, description, contact details, social links.
  - `src/data/*.ts`: navigation, technologies, FAQ, process, plus the *built-in* services, portfolio and positions, which are used until content is managed in the dashboard.
  - `src/content/`: content schema, loading from Firestore, and the `useContent()` context.
  - `src/config/seo.ts`: per-page metadata and the route list.
- **Styling.** Plain CSS with design tokens in `src/styles/tokens.css` (colors, type scale, spacing, radii, shadows, gradients, motion). Component and page styles live in `components.css` and `pages.css`.
- **Animation.**
  - Motion for React handles page transitions, the mobile menu and portfolio filter layout animation. Its feature bundle is lazy-loaded via `LazyMotion`.
  - Scroll reveals use CSS + IntersectionObserver. Content is only hidden once JavaScript is confirmed running, so the page stays readable if scripts fail.
  - The hero entrance is CSS-only.
  - `prefers-reduced-motion` is honored everywhere, and the globe renders a single static frame in that case.
- **Visuals.**
  - The globe is a lightweight 2D-canvas dot sphere with network arcs. It is built when the browser is idle and pauses when off-screen or in a background tab.
  - All other illustrations and project previews are inline SVG, so there are no heavy raster images.
- **Fonts.** Sora (headings), Figtree (body) and JetBrains Mono (nav, eyebrows, buttons) are self-hosted via `@fontsource-variable`, with no third-party requests.

```
src/
  admin/          Admin dashboard: auth gate, layout, submissions + content editors
  app/            App shell, routes, lazy Motion features
  components/
    layout/       Navbar (+ mobile nav), Footer, Logo
    ui/           Button, SectionHeading, ServiceCard, ProjectCard, TechnologyCard,
                  CTASection, PageHero (+ breadcrumbs), ProcessTimeline, ContactForm, ApplicationForm
    animations/   Reveal, PageTransition (scroll + head sync)
    visuals/      Globe, HeroGlobe, IsoVisuals, ProjectPreview, TechLogos
  config/         seo.ts, firebase.ts, cloudinary.ts
  content/        schema.ts, load.ts, ContentContext.tsx
  data/           company, navigation, services, portfolio, technologies, careers, faq, process
  pages/          8 pages + NotFound
  styles/         tokens.css, global.css, components.css, pages.css
  entry-server.tsx, main.tsx
functions/        Cloud Functions (TypeScript): submitInquiry, submitApplication
scripts/prerender.mjs
firebase.json, firestore.rules, storage.rules, firestore.indexes.json
```

## Environment variables

Copy `.env.example` to `.env.local`. Only `VITE_*` variables reach the browser, so **never** put secrets, admin keys or service-account JSON here.

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Production origin. Used for canonical URLs, Open Graph and the sitemap. **Required before going live.** It currently defaults to `https://www.example.com`. |
| `VITE_FIREBASE_*` | Public Firebase web-app config. Enables the forms, managed content and the admin dashboard. |
| `VITE_FIREBASE_USE_EMULATORS` | `true` connects to the local emulators instead of the real project. |
| `VITE_CLOUDINARY_CLOUD_NAME` | Enables the `cloudinaryUrl()` helper for optimized media delivery. |

Variables are read at **build time**, so rebuild after changing them.

## Backend (Firebase)

The backend runs entirely on Firebase:

| Piece | What it does |
|---|---|
| **Cloud Functions** (`functions/`) | `submitInquiry` (contact form) and `submitApplication` (careers form + CV). Both validate every field server-side, check a honeypot field, rate-limit per IP (5 inquiries or 3 applications per hour), store the record, and queue emails. CVs must be PDF/DOC/DOCX, 5 MB max, and are checked by their file signature, not only the extension. |
| **Firestore** | `inquiries` and `applications` (written only by the functions); `projects`, `services` and `positions` (website content); `config/public`; `admins`; `mail` (email queue); `rateLimits`. |
| **Storage** | `applications/` holds CVs and is private to admins. `content/` holds images uploaded from the dashboard and is public. |
| **Auth** | Email/password sign-in for the admin dashboard. |
| **Hosting** | Serves `dist/client`. Rewrites `/admin/**` to the dashboard shell. |

Security is enforced by [`firestore.rules`](firestore.rules) and [`storage.rules`](storage.rules). Visitors can read published content and nothing else, and can't write to the database directly. Admins are the users whose UID has a document in the `admins` collection.

### Admin dashboard (`/admin/`)

- **Inquiries / Applications:** filter by status, search, open a record, change its status, add internal notes, reply by email, download the CV, delete.
- **Portfolio / Services / Open positions:** add, edit, reorder, hide or publish, and delete. Portfolio projects can have an uploaded screenshot.

The dashboard loads only when `/admin/` is visited, so it adds nothing to the public pages.

**How content reaches the site.** Until content is imported, the site shows the built-in content from `src/data/`. The first time you open a content page in the dashboard, click **Import content & start managing**. That copies the built-in items into Firestore and sets `config/public.contentManaged = true`, and from then on the site shows only what is published in the dashboard. Dashboard edits appear in visitors' browsers immediately. The prerendered HTML that search engines see is refreshed on the next `npm run build` + deploy.

### First-time setup

1. Create a Firebase project. Functions need the **Blaze** (pay-as-you-go) plan; the free tier covers a site like this.
2. Add a **Web app** and copy its config into `.env.local` (`VITE_FIREBASE_*`).
3. Enable **Firestore**, **Storage**, and **Authentication → Email/Password**.
4. Install the CLI and link the project:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add            # pick your project
   ```
5. Optional: `cp functions/.env.example functions/.env` and set `NOTIFY_EMAIL`, `COMPANY_NAME`.
6. Deploy everything:
   ```bash
   npm --prefix functions install
   firebase deploy               # builds the site and functions first
   ```
7. **Create your admin account.**
   1. In Authentication → Users, add a user with your email and password.
   2. Open `/admin/` and sign in. The page shows your UID.
   3. In Firestore, create the collection `admins` with a document whose ID is that UID (the fields can be empty).
   4. Reload the page.
8. **Emails (optional).** Install the official *Trigger Email from Firestore* extension (`firebase ext:install firebase/firestore-send-email`), point it at the `mail` collection, and give it your SMTP details. Without it, submissions still work and the dashboard still shows them; emails just aren't sent.

Recommended for production:

- Enable **App Check** (reCAPTCHA Enterprise) and set `enforceAppCheck: true` in `functions/src/options.ts`.
- Add a Firestore **TTL policy** on `rateLimits.expiresAt` so old rate-limit entries are removed automatically.

### Local development with emulators

The emulators need Java 21+.

```bash
npm --prefix functions install
npm run emulators             # Auth, Functions, Firestore, Storage + UI at http://127.0.0.1:4000
```

In `.env.local`, set `VITE_FIREBASE_USE_EMULATORS=true` with any `VITE_FIREBASE_*` values (for example `VITE_FIREBASE_PROJECT_ID=demo-site`), then run `npm run dev`. Create the admin user and `admins/<uid>` document in the emulator UI.

If function loading times out on a slow machine, set `FUNCTIONS_DISCOVERY_TIMEOUT=60` before starting the emulators.

## Cloudinary setup (optional)

The site currently ships no raster images; all visuals are SVG. When you add real project screenshots or team photos:

1. Set `VITE_CLOUDINARY_CLOUD_NAME`.
2. Upload assets (for example `portfolio/analytics-dashboard`).
3. Use `cloudinaryUrl('portfolio/analytics-dashboard', 'w_800') ?? '/images/portfolio/analytics-dashboard.webp'`. The helper applies `f_auto,q_auto`, and the fallback keeps local files working.

Never expose the Cloudinary API key or secret in frontend code. Signed uploads need a server endpoint.

## Configuration still required

| Item | Where |
|---|---|
| Company description | `src/data/company.ts` |
| Logo (higher resolution / SVG) | `public/logo-mark.png` and `public/favicon.png` were cut from a screenshot. Replace them with the original artwork when available. |
| Social preview image | `public/og-image.png` (1200×630). It currently shows the placeholder name, so regenerate it with real branding. |
| Email / phone / address / social links | `src/data/company.ts` (hidden while `null` / empty) |
| Production URL | `VITE_SITE_URL` |
| Firebase project, admin account, email extension | see [Backend](#backend-firebase) |
| Confirm the service list | Admin dashboard → Services (built-in defaults in `src/data/services.ts`) |
| Real portfolio projects | Admin dashboard → Portfolio. Every built-in item is a **demonstration concept**, labelled "Concept" on the site. |
| Open positions | Admin dashboard → Open positions (none yet, so the page shows a general-application message) |
| FAQ answers, budget ranges | `src/data/faq.ts`, `src/components/ui/ContactForm.tsx` |
| Team section (optional) | Not built, because no real team information was supplied |
| Privacy policy / legal pages | Not built. **Add before going live**, since the forms collect personal data and CVs. Then link them from the footer and both forms. |

## Notes on honesty

No statistics, clients, testimonials, results, contact details, vacancies or certifications have been invented. Portfolio items are labelled as concepts, the technologies page describes what each tool is used for (not claimed expertise), and structured data is only emitted once real company details are configured.
