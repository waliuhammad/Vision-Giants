import { ArrowUpRight, Building2, Code2, Cpu, Globe, ExternalLink } from 'lucide-react';
import type { HomeCollaborationData } from '../../content/homeCollaborationData';
import { Reveal } from '../animations/Reveal';

const partnerEmblems = [Building2, Code2, Cpu, Globe];

function PlaceholderLogo({ index }: { index: number }) {
  const Icon = partnerEmblems[index % partnerEmblems.length];
  return (
    <div className="collab-partner-card__placeholder-logo">
      <div className="collab-partner-card__placeholder-icon-wrap">
        <Icon size={24} className="collab-partner-card__placeholder-icon" />
      </div>
      <span className="collab-partner-card__placeholder-badge">Partner {index + 1}</span>
    </div>
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
              {title || 'Our Collaboration Partners'}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="collab-lead">
              {lead || 'Building stronger digital experiences through meaningful partnerships and collaboration.'}
            </p>
          </Reveal>
        </div>

        {/* Professional Partner Cards Grid */}
        <div className="collab-partners-grid" data-count={partners.length}>
          {partners.map((partner, idx) => (
            <Reveal key={partner.id || idx} delay={200 + idx * 80}>
              <article className="collab-partner-card">
                {/* 1. Clickable Logo Presentation Box */}
                <div className="collab-partner-card__logo-container">
                  <a
                    href={partner.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="collab-partner-card__logo-link"
                    title={`Visit ${partner.name} official website`}
                    aria-label={`Visit ${partner.name} official website`}
                  >
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="collab-partner-card__logo-img"
                        loading="lazy"
                      />
                    ) : (
                      <PlaceholderLogo index={idx} />
                    )}
                    <span className="collab-partner-card__logo-hint" aria-hidden="true">
                      <ExternalLink size={12} />
                    </span>
                  </a>
                </div>

                {/* 2. Partner Details & Description */}
                <div className="collab-partner-card__body">
                  {partner.tagline && (
                    <span className="collab-partner-card__tagline">{partner.tagline}</span>
                  )}

                  <h3 className="collab-partner-card__name">
                    <a
                      href={partner.websiteUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="collab-partner-card__name-link"
                    >
                      {partner.name}
                    </a>
                  </h3>

                  <p className="collab-partner-card__desc">{partner.description}</p>
                </div>

                {/* 3. Card Footer Action */}
                <div className="collab-partner-card__footer">
                  <a
                    href={partner.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="collab-partner-card__action-link"
                  >
                    <span>Visit Website</span>
                    <ArrowUpRight size={15} className="collab-partner-card__arrow" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
