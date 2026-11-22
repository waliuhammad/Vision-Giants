import { useState, useMemo } from 'react';
import { ExternalLink, Eye, FolderOpen } from 'lucide-react';
import { projects, categoryLabels, projectCover, type ProjectCategory } from '../data/portfolio';
import { PageHero } from '../components/ui/PageHero';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';

const ALL = 'all';

type Filter = ProjectCategory | typeof ALL;

const filterLabels: Record<Filter, string> = {
  all: 'All Projects',
  web: 'Web Development',
  wordpress: 'WordPress',
  ecommerce: 'E-Commerce',
  mobile: 'Mobile Apps',
  custom: 'Custom Software',
};

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>(ALL);

  const filters: Filter[] = [ALL, 'web', 'wordpress', 'ecommerce', 'mobile', 'custom'];

  const filtered = useMemo(() => {
    if (activeFilter === ALL) return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="portfolio-page">
      <PageHero
        crumb="Portfolio"
        eyebrow="Our Work"
        title={
          <>
            Projects We're <span className="highlight">Proud Of</span>
          </>
        }
        lead="From restaurants to AI SaaS — 22+ projects delivered for clients around the globe."
        visual={
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 220,
            }}
          >
            <FolderOpen size={120} style={{ color: 'var(--color-primary)', opacity: 0.25 }} />
          </div>
        }
      />

      <section className="section portfolio-page__grid-section">
        <div className="container">
          <SectionHeading
            eyebrow="Portfolio"
            title="All Projects"
            lead={`Showing ${filtered.length} of ${projects.length} projects`}
            align="left"
          />

          {/* Filter pills */}
          <div className="portfolio-page__filters" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--space-6)' }}>
            {filters.map((f) => {
              const count = f === ALL ? projects.length : projects.filter((p) => p.category === f).length;
              if (count === 0) return null;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`course-cat-pill${activeFilter === f ? ' is-active' : ''}`}
                >
                  {filterLabels[f]} ({count})
                </button>
              );
            })}
          </div>

          {/* Project grid */}
          <div
            className="portfolio-page__grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            {filtered.map((project, i) => {
              const cover = projectCover(project);
              return (
                <Reveal key={project.id} delay={i * 0.04}>
                  <article className="portfolio-card card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {/* Cover image */}
                    <div
                      className="portfolio-card__cover"
                      style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-surface-2)' }}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={project.title}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <Eye size={40} />
                        </div>
                      )}
                      {/* Category badge */}
                      <span
                        className="badge badge--primary"
                        style={{ position: 'absolute', top: 10, left: 10 }}
                      >
                        {categoryLabels[project.category]}
                      </span>
                      {project.isDemo && (
                        <span
                          className="badge badge--neutral"
                          style={{ position: 'absolute', top: 10, right: 10 }}
                        >
                          Demo
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="portfolio-card__body" style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {project.industry && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                          {project.industry}
                        </p>
                      )}
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{project.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, flex: 1 }}>
                        {project.summary}
                      </p>

                      {/* Tech tags */}
                      {project.tech.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                          {project.tech.slice(0, 5).map((tag) => (
                            <span key={tag} className="badge badge--neutral" style={{ fontSize: '0.7rem' }}>
                              {tag}
                            </span>
                          ))}
                          {project.tech.length > 5 && (
                            <span className="badge badge--neutral" style={{ fontSize: '0.7rem' }}>
                              +{project.tech.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Live site link */}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--outline btn--sm"
                          style={{ alignSelf: 'flex-start', marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          Visit live site <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
