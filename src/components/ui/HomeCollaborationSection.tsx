import { useState } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { HomeCollaborationData, CollaborationPartner } from '../../content/homeCollaborationData';
import { Reveal } from '../animations/Reveal';

function PartnerCard({ partner }: { partner: CollaborationPartner }) {
  const [imgError, setImgError] = useState(false);
  const hasWebsite = Boolean(partner.websiteUrl && partner.websiteUrl.trim().length > 0);

  const initials = partner.name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className={`collab-partner-card ${hasWebsite ? 'is-interactive' : 'is-informational'}`}>
      {/* 1. Logo Box */}
      <div className="collab-partner-card__logo-container">
        {hasWebsite ? (
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="collab-partner-card__logo-link"
            title={`Visit ${partner.name} official website`}
            aria-label={`Visit ${partner.name} official website`}
          >
            {partner.logo && !imgError ? (
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="collab-partner-card__logo-img"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="collab-partner-card__initials-badge" aria-label={partner.name}>
                <span>{initials}</span>
              </div>
            )}
            <span className="collab-partner-card__logo-hint" aria-hidden="true">
              <ExternalLink size={12} />
            </span>
          </a>
        ) : (
          <div className="collab-partner-card__logo-static" aria-label={partner.name}>
            {partner.logo && !imgError ? (
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="collab-partner-card__logo-img"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="collab-partner-card__initials-badge" aria-label={partner.name}>
                <span>{initials}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Body Details */}
      <div className="collab-partner-card__body">
        {partner.tagline && (
          <span className="collab-partner-card__tagline">{partner.tagline}</span>
        )}

        <h3 className="collab-partner-card__name">
          {hasWebsite ? (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="collab-partner-card__name-link"
            >
              {partner.name}
            </a>
          ) : (
            <span className="collab-partner-card__name-static">{partner.name}</span>
          )}
        </h3>

        <p className="collab-partner-card__desc">{partner.description}</p>
      </div>

      {/* 3. Footer Action */}
      <div className="collab-partner-card__footer">
        {hasWebsite ? (
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="collab-partner-card__action-link"
          >
            <span>Visit Website</span>
            <ArrowUpRight size={16} />
          </a>
        ) : (
          <span className="collab-partner-card__status-badge">
            Partner
          </span>
        )}
      </div>
    </article>
  );
}

export function HomeCollaborationSection({ data }: { data: HomeCollaborationData }) {
  const { eyebrow, title, lead, partners } = data;

  return (
    <section className="collab-section" aria-labelledby="collab-title">
      <div className="container">
        {/* Section Header */}
        <div className="collab-header text-center">
          <Reveal delay={60}>
            <p className="collab-eyebrow">{eyebrow || 'STRATEGIC PARTNERSHIPS'}</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 id="collab-title" className="collab-title">
              {title || 'Our Collaboration'}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="collab-lead">
              {lead || 'Proud to work with partners who share our vision.'}
            </p>
          </Reveal>
        </div>

        {/* Partner Cards Grid - Centered 2-column */}
        <div className="collab-partners-grid" data-count={partners.length}>
          {partners.map((partner, idx) => (
            <Reveal key={partner.id || idx} delay={200 + idx * 80}>
              <PartnerCard partner={partner} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
