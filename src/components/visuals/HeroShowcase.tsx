import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/portfolio';

const ROTATE_MS = 5000;
const MAX_SLIDES = 4;

/**
 * Homepage hero visual: one browser frame that cross-fades through real project screenshots,
 * set on a soft blue stage with a fine grid, plus a single floating card describing the project
 * on screen. Renders nothing when no project has a desktop screenshot.
 */
export function HeroShowcase({ projects }: { projects: Project[] }) {
  const slides = projects
    .map((p) => ({ project: p, src: p.images?.find((src) => !src.includes('mobile')) }))
    .filter((s): s is { project: Project; src: string } => Boolean(s.src))
    .slice(0, MAX_SLIDES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((i) => (i + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
    // Restarting on `index` gives a full interval after a pager click
  }, [slides.length, index]);

  if (slides.length === 0) return null;
  const { project } = slides[index];
  const host = (p: Project) => (p.url ? new URL(p.url).host.replace(/^www\./, '') : p.title);
  const sector = project.industry?.split('·')[0].trim();

  return (
    <figure className="showcase enter" style={{ '--delay': '150ms' } as CSSProperties}>
      <div className="showcase__stage" aria-hidden="true">
        <span className="showcase__glow" />
        <span className="showcase__grid" />
        <span className="showcase__ring" />
      </div>

      <div className="showcase__browser">
        <div className="showcase__bar" aria-hidden="true">
          <span className="showcase__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="showcase__url">{host(project)}</span>
        </div>
        <div className="showcase__screen">
          {slides.map((s, i) => (
            <img
              key={s.project.id}
              src={s.src}
              alt={i === index ? `${s.project.title} website, designed and built by our team` : ''}
              aria-hidden={i === index ? undefined : true}
              className={i === index ? 'is-active' : undefined}
              width={1280}
              height={800}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
            />
          ))}
        </div>
      </div>

      <div className="showcase__card" aria-live="polite">
        <span className="showcase__card-label">
          <span className="showcase__dot" aria-hidden="true" />
          Live project
        </span>
        <strong>{project.title}</strong>
        {sector && <span className="showcase__card-meta">{sector}</span>}
        {project.tech.length > 0 && (
          <span className="showcase__card-tech">
            {project.tech.slice(0, 3).map((t) => (
              <i key={t}>{t}</i>
            ))}
          </span>
        )}
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="showcase__card-link">
            Visit site
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>

      {slides.length > 1 && (
        <div className="showcase__pager" role="tablist" aria-label="Showcased projects">
          {slides.map((s, i) => (
            <button
              key={s.project.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${s.project.title}`}
              className={i === index ? 'is-active' : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
      <figcaption className="visually-hidden">Recent work: {slides.map((s) => s.project.title).join(', ')}</figcaption>
    </figure>
  );
}
