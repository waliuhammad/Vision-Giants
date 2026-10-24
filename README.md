# Software House Website

A prerendered, seven-page marketing website for a software house, built with React, Vite, TypeScript and React Router. The visual direction is dark, futuristic and premium.

> **⚠ Temporary branding.** No company name, logo or contact details were supplied. The site uses the placeholder name **"Your Company"**, a generic `</>` mark, and hides every contact field that is empty. See [Configuration still required](#configuration-still-required).

## Commands

Requires Node.js 20+ (tested with Node 24).

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:5173 (client-rendered)
npm run build        # typecheck → client build → server build → prerender all pages
npm run preview      # serve the prerendered output at http://localhost:4173
npm run typecheck    # TypeScript only
```

Deploy the contents of **`dist/client/`** to any static host (Firebase Hosting, Netlify, Vercel, Cloudflare Pages, S3/CloudFront, nginx…). Configure the host to serve `404.html` for unknown paths.

## Pages

| Route | Page | Highlights |
|---|---|---|
| `/` | Home | Animated canvas globe hero, capability strip, services, featured concepts, values, process timeline, CTA |
| `/services/` | Services | Overview cards, per-service details with deliverables (anchor links `#web-development` …), process, FAQ |
| `/portfolio/` | Portfolio | Working category filters with layout animation, accessible project detail dialog (native `<dialog>`) |
| `/about/` | About | Introduction, mission & vision, values, approach, process |
| `/technologies/` | Technologies | React / Node.js / Firebase / Cloudinary cards, architecture diagram, supporting tools |
| `/contact/` | Contact | Validated inquiry form with honeypot + timing spam checks and honest submission states |
| `/careers/` | Careers | Culture, positions (empty state when none are configured), disciplines, how to apply |

## Architecture

- **Prerendering.** Uses Vite's standard SSR pattern with no extra dependencies:
  1. `vite build` produces the client bundle in `dist/client/`.
  2. `vite build --ssr src/entry-server.tsx` produces a render function.
  3. `scripts/prerender.mjs` renders every route in `src/config/seo.ts` to `dist/client/<route>/index.html`. It injects that page's title, description, canonical URL, Open Graph and Twitter tags. It also writes `404.html` (`noindex`), `sitemap.xml` and `robots.txt`. The browser then hydrates the page.
- **Single sources of truth.**
  - `src/data/company.ts`: name, description, contact details, social links.
  - `src/data/*.ts`: navigation, services, portfolio, technologies, careers, FAQ, process.
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
- **Fonts.** Inter and Space Grotesk are self-hosted via `@fontsource-variable`, with no third-party requests.

```
src/
  app/            App shell, routes, lazy Motion features
  components/
    layout/       Navbar (+ mobile nav), Footer, Logo
    ui/           Button, SectionHeading, ServiceCard, ProjectCard, TechnologyCard,
                  CTASection, PageHero (+ breadcrumbs), ProcessTimeline, ContactForm
    animations/   Reveal, PageTransition (scroll + head sync)
    visuals/      Globe, HeroGlobe, IsoVisuals, ProjectPreview, TechLogos
  config/         seo.ts, firebase.ts, cloudinary.ts
  data/           company, navigation, services, portfolio, technologies, careers, faq, process
  pages/          7 pages + NotFound
  styles/         tokens.css, global.css, components.css, pages.css
  entry-server.tsx, main.tsx
scripts/prerender.mjs
firestore.rules
```

## Environment variables

Copy `.env.example` to `.env.local`. Only `VITE_*` variables reach the browser, so **never** put secrets, admin keys or service-account JSON here.

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Production origin. Used for canonical URLs, Open Graph and the sitemap. **Required before going live.** It currently defaults to `https://www.example.com`. |
| `VITE_FIREBASE_*` | Public Firebase web-app config. Enables contact-form submissions. |
| `VITE_CLOUDINARY_CLOUD_NAME` | Enables the `cloudinaryUrl()` helper for optimized media delivery. |

Variables are read at **build time**, so rebuild after changing them.

## Firebase setup (contact form)

Until Firebase is configured, the form validates input but tells visitors plainly that online submission isn't connected yet, and that their message has **not** been sent. It never shows a fake success message. If you set `company.email`, the form also offers a mailto fallback.

To connect it:

1. Create a Firebase project and add a **Web app**. Copy its config values into `VITE_FIREBASE_*`.
2. Enable **Cloud Firestore**.
3. Deploy the included rules: `firebase deploy --only firestore:rules`. Alternatively, paste `firestore.rules` into the console.
   - Visitors can only **create** validated documents in `inquiries`.
   - Nobody can read, update or delete from the browser.
4. Strongly recommended: enable **Firebase App Check** (reCAPTCHA Enterprise) on Firestore to block automated abuse. If you do, add the App Check initialization in `src/config/firebase.ts`.
5. Read inquiries in the Firebase console. To get email notifications, add a Cloud Function or the *Trigger Email* extension on the `inquiries` collection.
6. Rebuild and redeploy.

The Firebase SDK is loaded with a dynamic `import()` only when someone submits the form, so it adds nothing to page load.

## Cloudinary setup (optional)

The site currently ships no raster images; all visuals are SVG. When you add real project screenshots or team photos:

1. Set `VITE_CLOUDINARY_CLOUD_NAME`.
2. Upload assets (for example `portfolio/analytics-dashboard`).
3. Use `cloudinaryUrl('portfolio/analytics-dashboard', 'w_800') ?? '/images/portfolio/analytics-dashboard.webp'`. The helper applies `f_auto,q_auto`, and the fallback keeps local files working.

Never expose the Cloudinary API key or secret in frontend code. Signed uploads need a server endpoint.

## Configuration still required

| Item | Where |
|---|---|
| Real company name, tagline, description | `src/data/company.ts`. Set `isPlaceholder: false` to enable Organization JSON-LD. |
| Logo | `src/components/layout/Logo.tsx`, `public/favicon.svg` |
| Social preview image | `public/og-image.png` (1200×630). It currently shows the placeholder name, so regenerate it with real branding. |
| Email / phone / address / social links | `src/data/company.ts` (hidden while `null` / empty) |
| Production URL | `VITE_SITE_URL` |
| Firebase project config + rules | see above |
| Confirm the service list | `src/data/services.ts` |
| Real portfolio projects | `src/data/portfolio.ts`. Every current item is a **demonstration concept**, labelled "Concept" on the site. |
| Open positions | `src/data/careers.ts` (empty, so the page shows a general-interest message) |
| FAQ answers, budget ranges | `src/data/faq.ts`, `src/components/ui/ContactForm.tsx` |
| Team section (optional) | Not built, because no real team information was supplied |
| Privacy policy / legal pages | Not built. Add before collecting personal data in production, then link them from the footer and form. |

## Notes on honesty

No statistics, clients, testimonials, results, contact details, vacancies or certifications have been invented. Portfolio items are labelled as concepts, the technologies page describes what each tool is used for (not claimed expertise), and structured data is only emitted once real company details are configured.
