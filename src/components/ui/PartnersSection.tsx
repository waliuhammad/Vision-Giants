import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { loadActivePartners, type Partner } from '../../content/partners';
import { SectionHeading } from './SectionHeading';
import { Reveal } from '../animations/Reveal';

/** One partner: logo, name, type and description; logo and name link to the partner's website. */
export function PartnerCard({ partner }: { partner: Partner }) {
  const { name, logo, type, description, details, url } = partner;
  const logoImg = logo ? <img src={logo} alt={`${name} logo`} loading="lazy" decoding="async" /> : <span className="partner-card__no-logo">{name}</span>;

  return (
    <article className="partner-card">
      {url ? (
        // Duplicate of the name link, so it is skipped by keyboard and screen readers.
        <a href={url} target="_blank" rel="noopener noreferrer" className="partner-card__logo" tabIndex={-1} aria-hidden="true">
          {logoImg}
        </a>
      ) : (
        <span className="partner-card__logo">{logoImg}</span>
      )}
      <div className="partner-card__body">
        {type && <span className="badge badge--purple partner-card__type">{type}</span>}
        <h3 className="partner-card__name">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {name}
              <ArrowUpRight size={15} aria-hidden="true" />
              <span className="visually-hidden"> (website, opens in a new tab)</span>
            </a>
          ) : (
            name
          )}
        </h3>
        {description && <p className="partner-card__text">{description}</p>}
        {details && (
          <details className="partner-card__details">
            <summary>Collaboration details</summary>
            <p>{details}</p>
          </details>
        )}
      </div>
    </article>
  );
}

/**
 * Home page partners section. Partners are read from Firestore in the browser, so changes made in
 * Admin → Partners appear on the next page load; nothing is shown until at least one active partner exists.
 */
export function PartnersSection({ title, lead, eyebrow }: { title: string; lead: string; eyebrow?: string }) {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadActivePartners()
      .then((list) => !cancelled && setPartners(list))
      .catch((err) => console.warn('Could not load partners', err));
    return () => {
      cancelled = true;
    };
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="section partners" aria-labelledby="partners-title">
      <div className="container">
        <SectionHeading id="partners-title" eyebrow={eyebrow} title={title} lead={lead} align="center" />
        <ul className={`partners__grid${partners.length < 3 ? ' partners__grid--few' : ''}`}>
          {partners.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 4) * 70}>
              <PartnerCard partner={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
