import { Link } from 'react-router';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { company, telHref } from '../../data/company';
import { footerCompanyNav } from '../../data/navigation';
import { partners as collaborationPartners } from '../../data/partners';
import {
  useContent,
  useGlobalSettings,
  useNavigation,
  useHeaderFooter,
} from '../../content/ContentContext';
import { Logo } from './Logo';

const FOOTER_SERVICES_LIMIT = 5;

// ---------------------------------------------------------------------------
// Brand icons (removed from recent lucide-react versions, so defined locally)
// ---------------------------------------------------------------------------
type IconProps = {
  size?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
};
type IconComponent = (props: IconProps) => ReactElement;

function createIcon(children: ReactNode): IconComponent {
  return function BrandIcon({ size = 24, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        {children}
      </svg>
    );
  };
}

const Linkedin = createIcon(
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </>
);

const Facebook = createIcon(
  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
);

const Instagram = createIcon(
  <>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </>
);


// TikTok's note mark, drawn as an outline to match the other icons.
const Tiktok = createIcon(
  <path d="M16 3a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.7V15a6 6 0 1 1-6-6v3.2a2.8 2.8 0 1 0 2.8 2.8V3z" />
);
const Whatsapp = createIcon(
  <>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </>
);

const MailIcon: IconComponent = ({ size = 24, ...rest }) => <Mail size={size} {...rest} />;

const GlobeIcon: IconComponent = ({ size = 24, ...rest }) => (
  <Globe size={size} {...rest} />
);

// Update these paths to match your actual routes

/**
 * Legal pages shown in the bottom bar. Empty until the pages exist: the earlier Privacy, Terms and
 * Cookie links pointed at routes that were never built and led to the 404 page. Add an entry here
 * (and a route in src/app/routes.tsx) once each policy is written.
 */
const legalLinks: { to: string; label: string }[] = [];

// Picks an icon based on the social label/URL; falls back to a globe
function getSocialIcon(label: string, href: string): IconComponent {
  const key = `${label} ${href}`.toLowerCase();
  if (key.includes('whatsapp') || key.includes('wa.me')) return Whatsapp;
  if (key.includes('mailto:') || key.includes('email')) return MailIcon;
  if (key.includes('linkedin')) return Linkedin;
  if (key.includes('facebook')) return Facebook;
  if (key.includes('instagram')) return Instagram;
  if (key.includes('tiktok')) return Tiktok;
  return GlobeIcon;
}

const footerStyles = `
.site-footer {
  position: relative;
  background: var(--color-ink);
  color: #fff;
  padding: 4.5rem 0 1.5rem;
}
/* Soft accent line along the top edge */
.site-footer::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(147, 180, 245, 0.35), transparent);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1.35fr 0.75fr 1fr 1.25fr;
  gap: clamp(2rem, 1rem + 2.5vw, 3.5rem);
}

.site-footer h2 {
  position: relative;
  margin: 0 0 1.4rem;
  padding-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
}
.site-footer h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 28px;
  height: 2px;
  border-radius: 2px;
  background: var(--color-primary);
}

.site-footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.7rem;
}

.site-footer a {
  color: #b8c4d8;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: color 0.2s ease;
}
.site-footer a:not(.btn):hover,
.site-footer a:not(.btn):focus-visible {
  color: #a9bce6;
}
.site-footer nav[aria-label='Company'] li a,
.site-footer__links li a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.2s ease, transform 0.2s ease;
}
.site-footer nav[aria-label='Company'] li a:hover,
.site-footer__links li a:hover {
  transform: translateX(3px);
}

/* Brand */
.site-footer__brand p {
  margin: 1.25rem 0 1.5rem;
  max-width: 36ch;
  color: #b8c4d8;
  font-size: 0.9375rem;
  line-height: 1.7;
}

/* Social icons */
.site-footer ul.site-footer__social {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.25rem;
}
.site-footer__social a {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.site-footer__social a:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  transform: translateY(-2px);
}

/* Collaboration logos in footer */
.site-footer__collab {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.site-footer__collab-title {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.65rem;
}
.site-footer__collab-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.site-footer__collab-item {
  display: inline-flex;
}
.site-footer__collab-link,
.site-footer__collab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 8px;
  padding: 6px 12px;
  height: 42px;
  min-width: 84px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
}
.site-footer__collab-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
  border-color: rgba(96, 165, 250, 0.6);
}
.site-footer__collab-img {
  max-height: 28px;
  max-width: 95px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}

/* Services "view all" */
.site-footer a.site-footer__view-all {
  font-weight: 600;
  color: #a9bce6;
}

/* Contact */
.site-footer__contact li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #b8c4d8;
  font-size: 0.9375rem;
  line-height: 1.55;
}
.site-footer__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(111, 134, 184, 0.14);
  border: 1px solid rgba(169, 188, 230, 0.2);
  color: #a9bce6;
}

/* Map, dark-tinted to match the theme */
.site-footer__map {
  margin-top: 1.25rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  height: 180px;
  background: var(--color-ink-2);
}
.site-footer__map iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  filter: invert(0.9) hue-rotate(185deg) saturate(0.6) brightness(0.95) contrast(0.9);
}
.site-footer a.site-footer__directions {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #a9bce6;
}

/* Bottom bar */
.site-footer__bottom {
  margin-top: 3.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  font-size: 0.85rem;
  color: #8d9ab0;
}
.site-footer__legal ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}
.site-footer__legal a {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
}
.site-footer__top {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.site-footer__top:hover {
  background: #fff;
  color: #0d2147;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .site-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem 2rem;
  }
}
@media (max-width: 640px) {
  .site-footer {
    padding-top: 3.5rem;
  }
  .site-footer__grid {
    gap: 2.25rem 1.5rem;
  }
  .site-footer__brand,
  .site-footer__contact-col {
    grid-column: 1 / -1;
  }
  .site-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

export function Footer() {
  const { services } = useContent();
  const globalSettings = useGlobalSettings();
  const navSettings = useNavigation();
  const headerFooter = useHeaderFooter();

  const footerServices = services.slice(0, FOOTER_SERVICES_LIMIT);
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ── CMS-driven values with company.ts fallbacks ──────────────────────────
  const description = globalSettings?.description || company.description;
  const email = globalSettings?.email ?? company.email;
  const phones = globalSettings?.phones?.length ? globalSettings.phones : company.phones;
  const address = globalSettings?.address ?? company.address;

  // Build social list: prefer CMS globalSettings.social object, else company.social[]
  type SocialItem = { label: string; href: string };
  let socialLinks: SocialItem[] = [];
  if (globalSettings?.social && typeof globalSettings.social === 'object') {
    const raw = globalSettings.social as Record<string, string>;
    socialLinks = Object.entries(raw)
      .filter(([, href]) => !!href)
      .map(([label, href]) => ({ label, href }));
  }
  if (!socialLinks.length) {
    socialLinks = company.social.filter((s) => !s.placeholder);
  }

  // Only keep social links we have a recognisable icon for (no globe fallback entries)
  const knownSocialKeys = ['linkedin', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'wa.me', 'mailto:', 'email', 'youtube'];
  socialLinks = socialLinks.filter(({ label, href }) => {
    const key = `${label} ${href}`.toLowerCase();
    return knownSocialKeys.some((k) => key.includes(k));
  });

  // Footer company nav: prefer CMS nav, fallback to static data
  const cmsFooterNav = navSettings?.footerCompanyNav?.filter((n) => n.active !== false) ?? [];
  const companyNav = cmsFooterNav.length ? cmsFooterNav : footerCompanyNav;

  // Copyright string
  const copyrightText =
    headerFooter?.footer?.copyright ??
    `© ${year} ${company.legalName}. All rights reserved.`;

  // Legal links: prefer CMS, fallback to empty static array
  const activeLegalLinks: { to: string; label: string }[] =
    headerFooter?.footer?.legalLinks ?? legalLinks;

  // Visibility flags
  const showContactInfo = headerFooter?.footer?.showContactInfo !== false;
  const showSocials = headerFooter?.footer?.showSocials !== false;

  const collabPartners = collaborationPartners.filter((p) => Boolean(p.logo));

  return (
    <footer className="site-footer">
      <style>{footerStyles}</style>

      <div className="container">
        <div className="site-footer__grid">
          {/* Brand + social */}
          <div className="site-footer__brand">
            <Logo />
            <p>{description}</p>

            {showSocials && socialLinks.length > 0 && (
              <ul className="site-footer__social" aria-label="Social media">
                {socialLinks.map((s) => {
                  const Icon = getSocialIcon(s.label, s.href);
                  const external = s.href.startsWith('http');
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        aria-label={s.label}
                        title={s.label}
                      >
                        <Icon size={18} aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {collabPartners.length > 0 && (
              <div className="site-footer__collab">
                <span className="site-footer__collab-title">Our Collaboration</span>
                <div className="site-footer__collab-list" aria-label="Our collaboration partners">
                  {collabPartners.map((partner) => {
                    const hasLink = Boolean(partner.website);
                    const content = (
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="site-footer__collab-img"
                        loading="lazy"
                      />
                    );

                    return (
                      <div key={partner.id} className="site-footer__collab-item">
                        {hasLink ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="site-footer__collab-link"
                            title={`Visit ${partner.name}`}
                            aria-label={partner.name}
                          >
                            {content}
                          </a>
                        ) : (
                          <div
                            className="site-footer__collab-badge"
                            title={partner.name}
                            aria-label={partner.name}
                          >
                            {content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Company nav */}
          <nav aria-label="Company">
            <h2>Company</h2>
            <ul>
              {companyNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h2>Our Services</h2>
            <ul className="site-footer__links">
              {footerServices.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}/`}>{s.title}</Link>
                </li>
              ))}
              <li>
                <Link to="/services/" className="site-footer__view-all">
                  View all services <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          {showContactInfo && (
            <div className="site-footer__contact-col">
              <h2>Get in touch</h2>
              <ul className="site-footer__contact">
                {email && (
                  <li>
                    <span className="site-footer__icon" aria-hidden="true">
                      <Mail size={15} />
                    </span>
                    <a href={`mailto:${email}`}>{email}</a>
                  </li>
                )}
                {phones.map((p) => (
                  <li key={p}>
                    <span className="site-footer__icon" aria-hidden="true">
                      <Phone size={15} />
                    </span>
                    <a href={telHref(p)}>{p}</a>
                  </li>
                ))}
                {address && (
                  <li>
                    <span className="site-footer__icon" aria-hidden="true">
                      <MapPin size={15} />
                    </span>
                    <span>{address}</span>
                  </li>
                )}
              </ul>

              {address && (
                <div className="site-footer__map">
                  <iframe
                    title={`Map showing ${company.name} office location`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
              {address && (
                <a
                  className="site-footer__directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom">
          <span>{copyrightText}</span>

          {activeLegalLinks.length > 0 && (
            <nav aria-label="Legal" className="site-footer__legal">
              <ul>
                {activeLegalLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <button
            type="button"
            className="site-footer__top"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
