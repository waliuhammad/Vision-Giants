import { Link } from 'react-router';
import { Mail, Phone, MapPin, Info } from 'lucide-react';
import { company } from '../../data/company';
import { mainNav } from '../../data/navigation';
import { services } from '../../data/services';
import { Logo } from './Logo';

export function Footer() {
  const hasContact = company.email || company.phone || company.address;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Logo />
            <p>{company.description}</p>
          </div>

          <nav aria-label="Footer">
            <h2>Company</h2>
            <ul>
              {mainNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2>Services</h2>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/services/#${s.id}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

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
              {!hasContact && (
                <li>
                  <Info size={16} aria-hidden="true" />
                  <span>
                    Use our <Link to="/contact/">project inquiry form</Link> to get in touch.
                  </span>
                </li>
              )}
              {company.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>
            © {year} {company.name}. All rights reserved.
          </span>
          <span>Designed &amp; built with React.</span>
        </div>
      </div>
    </footer>
  );
}
