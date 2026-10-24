import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { ArrowRight, Info } from 'lucide-react';
import { categoryLabels, type Project, type ProjectCategory } from '../data/portfolio';
import { useContent } from '../content/ContentContext';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { ProjectCard } from '../components/ui/ProjectCard';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { NetworkVisual } from '../components/visuals/IsoVisuals';
import { ProjectDialog } from '../components/ui/ProjectDialog';

type Filter = 'all' | ProjectCategory;

export default function PortfolioPage() {
  const { projects } = useContent();
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState<Project | null>(null);
  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  const count = (f: Filter) => (f === 'all' ? projects.length : projects.filter((p) => p.category === f).length);
  // Only offer filters for categories that have projects.
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...(Object.keys(categoryLabels) as ProjectCategory[])
      .filter((id) => count(id) > 0)
      .map((id) => ({ id, label: categoryLabels[id] })),
  ];

  // Links like /portfolio/?project=<id> open that project directly.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('project');
    const match = id && projects.find((p) => p.id === id);
    if (match) setActive(match);
  }, [projects]);

  return (
    <>
      <PageHero
        crumb="Portfolio"
        eyebrow="Our work"
        title="Selected Projects. Thoughtful Solutions."
        lead="A look at the kinds of products we design and build: web platforms, online stores, mobile apps and custom business software."
        actions={
          <Button to="/contact/" icon={<ArrowRight size={18} />}>
            Start a Project
          </Button>
        }
        visual={<NetworkVisual />}
      />

      <section className="section section--tight" aria-labelledby="projects-title">
        <div className="container">
          <h2 id="projects-title" className="visually-hidden">
            Projects
          </h2>
          <Reveal>
            {projects.some((p) => p.isDemo) && (
              <p className="note" style={{ marginBottom: 'var(--space-6)' }}>
                <Info size={16} aria-hidden="true" />
                {projects.every((p) => p.isDemo)
                  ? 'The projects below are demonstration concepts that illustrate our design and engineering approach. They are not client case studies.'
                  : 'Projects marked “Concept” are demonstrations that illustrate our design and engineering approach, not client case studies.'}
              </p>
            )}
            <div className="filters" role="group" aria-label="Filter projects by category">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="filter-btn"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {filter === f.id && (
                    <m.span layoutId="filter-active" className="filter-btn__bg" transition={{ duration: 0.3 }} />
                  )}
                  <span>
                    {f.label}
                    <span className="filter-count">{count(f.id)}</span>
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          <p className="visually-hidden" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          </p>
          <m.div layout className="portfolio-grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <m.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={p} onOpen={setActive} headingLevel="h3" />
                </m.div>
              ))}
            </AnimatePresence>
          </m.div>
        </div>
      </section>

      <ProjectDialog project={active} onClose={() => setActive(null)} />

      <CTASection
        title="Have a product idea of your own?"
        text="Tell us about it. We’ll help you shape the concept and plan how to bring it to life."
        secondary={{ label: 'View Services', to: '/services/' }}
      />
    </>
  );
}
