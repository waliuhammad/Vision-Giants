import { Link } from 'react-router';
import { Mail, Phone, MapPin, Info } from 'lucide-react';
import { company } from '../data/company';
import { ContactForm } from '../components/ui/ContactForm';
import { EnvelopeVisual } from '../components/visuals/IsoVisuals';

export default function ContactPage() {
  const details = [
    company.email && { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
    company.phone && { icon: Phone, label: 'Phone', value: company.phone, href: `tel:${company.phone.replace(/\s+/g, '')}` },
    company.address && { icon: MapPin, label: 'Location', value: company.address },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <section className="contact" aria-labelledby="page-title">
      <div className="bg-grid" aria-hidden="true" />
      <div className="container contact__grid">
        <div>
          <nav className="breadcrumbs enter" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li aria-current="page">Contact</li>
            </ol>
          </nav>
          <p className="eyebrow enter">Get in touch</p>
          <h1 id="page-title" className="enter">
            Let’s Build Something Great Together.
          </h1>
          <p className="lead enter">
            Have a project in mind or just want to say hello? Tell us a little about what you’re planning and we’ll get
            back to you to discuss the next steps.
          </p>

          {details.length > 0 ? (
            <ul className="contact-list enter">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <span className="icon-wrap" aria-hidden="true">
                    <Icon size={19} />
                  </span>
                  <span>
                    <small>{label}</small>
                    {href ? <a href={href}>{value}</a> : value}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="note enter" style={{ marginTop: 'var(--space-6)' }}>
              <Info size={16} aria-hidden="true" />
              Direct contact details will be listed here once they are published.
            </p>
          )}

          {company.social.length > 0 && (
            <ul className="tech-tags" aria-label="Social profiles" style={{ marginTop: 'var(--space-5)' }}>
              {company.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="contact__visual enter" aria-hidden="true">
            <EnvelopeVisual />
          </div>
        </div>

        <div className="card form-card enter">
          <h2>Start a project</h2>
          <p className="muted">Fields marked * are required.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
