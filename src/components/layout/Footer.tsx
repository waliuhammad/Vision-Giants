import { Link } from 'react-router';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowUp,
  Globe,
} from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { company } from '../../data/company';
import { useContent } from '../../content/ContentContext';
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

const Github = createIcon(
  <>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </>
);

const Twitter = createIcon(
  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
);

const GlobeIcon: IconComponent = ({ size = 24, ...rest }) => (
  <Globe size={size} {...rest} />
);

// Update these paths to match your actual routes
const companyLinks = [
  { to: '/about/', label: 'About Us' },
  { to: '/team/', label: 'Our Team' },
  { to: '/blog/', label: 'Blog' },
  { to: '/careers/', label: 'Careers' },
  { to: '/contact/', label: 'Contact Us' },
];

const legalLinks = [
  { to: '/privacy-policy/', label: 'Privacy Policy' },
  { to: '/terms-of-service/', label: 'Terms of Service' },
  { to: '/cookie-policy/', label: 'Cookie Policy' },
];

// Picks an icon based on the social label/URL; falls back to a globe
function getSocialIcon(label: string, href: string): IconComponent {
  const key = `${label} ${href}`.toLowerCase();
  if (key.includes('linkedin')) return Linkedin;
  if (key.includes('facebook')) return Facebook;
  if (key.includes('instagram')) return Instagram;
  if (key.includes('github')) return Github;
  if (key.includes('twitter') || key.includes('x.com')) return Twitter;
  return GlobeIcon;
}

const footerStyles = `
.site-footer {
  background: #0d2147;
  color: #fff;
  padding: 4.5rem 0 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.2fr 1.4fr;
  gap: 3rem;
}

.site-footer h2 {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 1.5rem;
}

.site-footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.site-footer a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.site-footer a:hover,
.site-footer a:focus-visible {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Brand */
.site-footer__brand p {
  margin: 1.25rem 0 1.5rem;
  max-width: 34ch;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Social icons */
.site-footer ul.site-footer__social {
  display: flex;
  gap: 0.75rem;
}

.site-footer__social a {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.site-footer__social a:hover {
  background: #fff;
  color: #0d2147;
  text-decoration: none;
  transform: translateY(-2px);
}

/* Services "view all" */
.site-footer a.site-footer__view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  color: #7fb2ff;
}

/* Contact */
.site-footer__contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.site-footer__contact svg {
  flex-shrink: 0;
  margin-top: 3px;
}

/* Map */
.site-footer__map {
  margin-top: 1.25rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  aspect-ratio: 4 / 3;
}

.site-footer__map iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

/* Bottom bar */
.site-footer__bottom {
  margin-top: 3.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
}

.site-footer__legal ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}

.site-footer__legal a {
  font-size: 0.9rem;
}

.site-footer__top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.site-footer__top:hover {
  background: #fff;
  color: #0d2147;
}

/* Responsive */
@media (max-width: 1024px) {
  .site-footer__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .site-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .site-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.25rem 1.5rem;
  }
  .site-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

export function Footer() {
  const { services } = useContent();
  const footerServices = services.slice(0, FOOTER_SERVICES_LIMIT);
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="site-footer">
      <style>{footerStyles}</style>

      <div className="container">
        <div className="site-footer__grid">
          {/* Brand + social */}
          <div className="site-footer__brand">
            <Logo />
            <p>{company.description}</p>

            {company.social.length > 0 && (
              <ul className="site-footer__social" aria-label="Social media">
                {company.social.map((s) => {
                  const Icon = getSocialIcon(s.label, s.href);
                  return (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
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
          </div>

          {/* Company */}
          <nav aria-label="Company">
            <h2>Company</h2>
            <ul>
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h2>Services</h2>
            <ul>
              {footerServices.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/#${s.id}`}>{s.title}</Link>
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
          <div>
            <h2>Get in touch</h2>
            <ul className="site-footer__contact">
              {company.email && (
                <li>
                  <Mail size={16} aria-hidden="true" />
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </li>
              )}
              {company.phone && (
                <li>
                  <Phone size={16} aria-hidden="true" />
                  <a href={`tel:${company.phone.replace(/\s+/g, '')}`}>{company.phone}</a>
                </li>
              )}
              {company.address && (
                <li>
                  <MapPin size={16} aria-hidden="true" />
                  <span>{company.address}</span>
                </li>
              )}
            </ul>

            {company.address && (
              <div className="site-footer__map">
                <iframe
                  title={`Map showing ${company.name} office location`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom">
          <span>
            © {year} {company.legalName}. All rights reserved.
          </span>

          <nav aria-label="Legal" className="site-footer__legal">
            <ul>
              {legalLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="site-footer__top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}