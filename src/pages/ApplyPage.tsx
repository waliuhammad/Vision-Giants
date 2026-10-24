import { Link } from 'react-router';
import { Briefcase, MapPin } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import { ApplicationForm } from '../components/ui/ApplicationForm';

export default function ApplyPage() {
  const { positions } = useContent();

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
              <li>
                <Link to="/careers/">Careers</Link>
              </li>
              <li aria-current="page">Apply</li>
            </ol>
          </nav>
          <p className="eyebrow enter">Careers</p>
          <h1 id="page-title" className="enter">
            Apply to Join Our Team.
          </h1>
          <p className="lead enter">
            Send us your CV and a few words about yourself. Apply for one of the open roles below, or send a general
            application and we’ll keep you in mind for future opportunities.
          </p>

          {positions.length > 0 && (
            <ul className="contact-list enter">
              {positions.map((p) => (
                <li key={p.id}>
                  <span className="icon-wrap" aria-hidden="true">
                    <Briefcase size={19} />
                  </span>
                  <span>
                    <small>
                      {p.type}
                      {p.location && (
                        <>
                          {' · '}
                          <MapPin size={12} aria-hidden="true" /> {p.location}
                        </>
                      )}
                    </small>
                    <strong>{p.title}</strong>
                    {(p.description || p.summary) && <span className="muted apply-role__text">{p.description || p.summary}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card form-card enter">
          <h2>Your application</h2>
          <p className="muted">Fields marked * are required.</p>
          <ApplicationForm positions={positions} />
        </div>
      </div>
    </section>
  );
}
