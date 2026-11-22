# TODO_OWNER.md — Vision Giants Website

This file lists every item that **requires the site owner's input** before it can be completed. Each entry is tagged `TODO_OWNER:` so it is easy to search for.

---

## 1. Team Member Titles

The following team members have no confirmed role/title. Add their real titles and the site will display them automatically (the card hides the title line when empty).

| Member | Placeholder | Action needed |
|---|---|---|
| Muhammad Ismail | _(hidden)_ | Confirm title (e.g. "Lead Developer") |
| Laiba Khan | _(hidden)_ | Confirm title |
| Muhib ul Allah | _(hidden)_ | Confirm title |
| Rao Ali | _(hidden)_ | Confirm title |
| M Ali Zafar | _(hidden)_ | Confirm title |
| Maryam | _(hidden)_ | Confirm title |
| Amama Aziz | _(hidden)_ | Confirm title |
| Amash Aziz | _(hidden)_ | Confirm title |
| Mubasil | _(hidden)_ | Confirm title |
| Hamza | _(hidden)_ | Confirm title |
| Wali | _(hidden)_ | Confirm title |
| Sir Raman Ismail | _(hidden)_ | Confirm title |

**File to edit:** `src/data/team.ts` — set `role: 'Your Title Here'` for each member.

---

## 2. Laiba Khan — LinkedIn URL

`TODO_OWNER:` Laiba Khan's LinkedIn link was removed because it pointed to `https://linkedin.com` (bare domain, not a real profile). Provide her real LinkedIn profile URL and add it to `src/data/team.ts` under `socials: { linkedin: 'https://linkedin.com/in/laiba-khan-…' }`.

---

## 3. Blog Post Authors

Blog post authorship was set to generic labels because the original ghost names (James Wilson, Jillie Bernard, etc.) do not exist on the team. Please confirm who actually wrote each article:

| Post slug | Current author | Confirm real author |
|---|---|---|
| `cloud-infrastructure-modern-apps` | Jalal Khan | ✅ or reassign |
| `mobile-first-development-2024` | Vision Giants Engineering Team | Confirm |
| `ux-psychology-digital-products` | Vision Giants Design Team | Confirm |
| `scalable-apis-microservices` | Vision Giants Engineering Team | Confirm |
| `future-of-ai-web-development` | Jalal Khan | ✅ or reassign |
| `ecommerce-conversion-optimization` | Vision Giants Engineering Team | Confirm |
| `progressive-web-apps-guide` | Vision Giants Engineering Team | Confirm |
| `micro-interactions-delight` | Vision Giants Design Team | Confirm |

**File to edit:** `src/data/blog.ts` — update `author.name` and `author.role` per post.

---

## 4. ~~Office Location — Lahore vs Multan~~ ✅ RESOLVED

**Decision confirmed by owner:** Lahore is NOT a real office. All Lahore references have been removed:
- `src/data/careers.ts` — all 5 job listings changed from `'Lahore, Pakistan'` → `'Multan, Pakistan'`
- `src/data/courses.ts` — all 7 courses' campus blocks updated: campus name, address, city, and location now say Multan

No further action needed on this item.

---

## 5. Team Headcount ("12+" claims)

`TODO_OWNER:` The site now shows "12+" in the homepage hero badge, Careers stats, and similar places. The Team page lists exactly 12 people. Confirm whether "12+" is accurate for public use, or if you want a different number (e.g. including contractors or alumni).

**Files to edit:** `src/content/homeHeroData.ts`, `src/content/careersPageData.ts`.

---

## 6. Courses — Unverified Statistics

The following claims were softened to avoid publishing unverifiable numbers. Confirm the real figures to restore specific numbers:

| Stat | Current (softened) | Confirm real value |
|---|---|---|
| Students trained | "500+" | Provide real count |
| Years of excellence | "5+" | When was VG founded? |
| Hiring partners | "5+" | Real count |
| Live modules | "100+" | Confirm |

**File to edit:** `src/content/coursesPageData.ts`.

---

## 7. "We reply within 24 hours" — Contact Page

`TODO_OWNER:` The contact page states "We reply within 24h." Confirm this is accurate. If not, update `src/content/contactPageData.ts` with the real SLA.

---

## 8. Careers — Open Roles Count

`TODO_OWNER:` The Careers stats ribbon shows "30+ Open Roles." Verify this is accurate against `src/data/careers.ts` (count the job entries). If not, update `src/content/careersPageData.ts`.

---

## 9. Client Domains — Confirm Source of Truth

The following domain corrections were made based on the portfolio "Visit live site" links as instructed in the audit. If any are wrong, provide the correct domain:

| Client | Old domain | New domain (applied) | Confirm |
|---|---|---|---|
| MII Marketing | `miimarketing.co.uk` | `miimarketing.com` | ✅ / ❌ |
| Alexa Movers | `alexamover.com` | `alexamovers.ae` | ✅ / ❌ |
| Sportif Padel | `sportifpadel.com` | `sportiftrade.com` | ✅ / ❌ |

**File:** `src/data/clients.ts`

---

## 10. Careers Apply Page — Photos & Culture Images

`TODO_OWNER:` The Careers page "Life at Vision Giants" section uses stock photos from Unsplash. Replace with real office/team photos. Suggested filenames (save to `public/images/careers/`):

- `culture-1.jpg` — team collaboration
- `culture-2.jpg` — office workspace
- `culture-3.jpg` — team event / outing
- `culture-4.jpg` — mentoring / learning

**File to edit:** `src/content/careersPageData.ts` — update `cultureImages` array.

---

## 11. Blog — 8th Post Image

`TODO_OWNER:` The 8th blog post (`micro-interactions-delight`) uses an Unsplash stock image. Replace with a branded graphic and save to `public/images/blog/micro-interactions-delight.jpg`. Then update `imageUrl` in `src/data/blog.ts`.

---

## 12. Privacy & Terms Pages — Legal Review

`TODO_OWNER:` Basic Privacy Policy (`/privacy/`) and Terms of Service (`/terms/`) pages have been created with reasonable placeholder content. Have them reviewed by a legal professional before launch.

---

## 13. Lahore Address in Footer

`TODO_OWNER:` If the Lahore office is confirmed (see item 4), add its address to the footer data in `src/content/footerData.ts` (or whichever file drives the footer's address block).

---

## 14. "Top Courses" — Cloud & DevOps, AI & Python

`TODO_OWNER:` The courses page "Top Courses" section shows cards for "Cloud & DevOps" and "AI & Python" that link to `#courses-catalog` (no real course page exists yet). Either:
- Create proper course entries in `src/data/courses.ts` for these two, OR
- Remove them from the Top Courses section in `src/content/coursesPageData.ts`.

---

## 15. RSS Feed & llms.txt — Email Confirmation

`TODO_OWNER:` The blog RSS feed (`/rss.xml`) and `llms.txt` file have been generated by the prerender script. Confirm the contact email (`info@vgiants.com`) and site URL (`https://vgiants.com`) are correct before deploying.

---

*Last updated: November 2026 — generated by the site audit fix pass.*
