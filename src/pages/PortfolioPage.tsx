import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, Info, X } from 'lucide-react';
import { categoryLabels, type Project, type ProjectCategory } from '../data/portfolio';
import { useContent } from '../content/ContentContext';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { ProjectCard } from '../components/ui/ProjectCard';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { NetworkVisual } from '../components/visuals/IsoVisuals';
import { ProjectMedia } from '../components/visuals/ProjectPreview';

type Filter = 'all' | ProjectCategory;

/** Screenshot viewer: large image with previous/next controls and a thumbnail strip. */
function ProjectGallery({ project }: { project: Project }) {
  const images = project.images?.length ? project.images : project.imageUrl ? [project.imageUrl] : [];
  const [index, setIndex] = useState(0);
  // Portrait images (mobile screenshots) are shown whole instead of cropped; detected once loaded.
  const [portrait, setPortrait] = useState<Record<string, boolean>>({});
  const isPortrait = (img: string) => portrait[img] === true;
  const measure = (img: string) => (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (h > w && !portrait[img]) setPortrait((p) => ({ ...p, [img]: true }));
  };

  if (images.length === 0) {
    return (
      <div className="modal__media">
        <ProjectMedia project={project} />
      </div>
    );
  }
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);
  const src = images[index];

  return (
    <div className="gallery">
      <div
        className={`gallery__stage${isPortrait(src) ? ' gallery__stage--portrait' : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
      >
        <img key={src} src={src} alt={`${project.title}: screenshot ${index + 1} of ${images.length}`} decoding="async" onLoad={measure(src)} />
        {images.length > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label="Previous screenshot">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label="Next screenshot">
              <ChevronRight size={20} />
            </button>
            <span className="gallery__count" aria-hidden="true">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="gallery__thumbs" aria-label="Screenshots">
          {images.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                className={`gallery__thumb${isPortrait(img) ? ' gallery__thumb--portrait' : ''}`}
                aria-current={i === index}
                aria-label={`Show screenshot ${i + 1}${isPortrait(img) ? ' (mobile)' : ''}`}
                onClick={() => setIndex(i)}
              >
                <img src={img} alt="" loading="lazy" decoding="async" onLoad={measure(img)} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="modal modal--wide"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {project && (
        <>
          <ProjectGallery key={project.id} project={project} />
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close project details">
            <X size={18} />
          </button>
          <div className="modal__body">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge">{categoryLabels[project.category]}</span>
              {project.industry && <span className="badge badge--neutral">{project.industry}</span>}
              {project.isDemo && <span className="badge badge--neutral">Concept project</span>}
            </div>
            <h2 id="project-dialog-title">{project.title}</h2>
            <p className="muted">{project.details}</p>
            <div className="modal__cols">
              <div>
                <h3>Key features</h3>
                <ul className="check-list">
                  {project.features.map((f) => (
                    <li key={f}>
                      <Check size={15} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Technologies</h3>
                <ul className="tech-tags">
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal__actions">
              {project.url && (
                <Button href={project.url} target="_blank" icon={<ExternalLink size={16} />}>
                  Visit website
                </Button>
              )}
              <Button to="/contact/" variant={project.url ? 'outline' : 'primary'} icon={<ArrowRight size={16} />}>
                Discuss a similar project
              </Button>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}

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
