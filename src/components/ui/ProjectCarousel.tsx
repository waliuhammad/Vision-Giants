import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';

const AUTOPLAY_MS = 3500;

/**
 * Horizontally sliding row of compact project cards. Scroll-snap does the layout and swiping;
 * the arrows move one card, and it auto-advances (looping back to the start) unless the visitor
 * is hovering, focused inside it, or has a project open.
 */
export function ProjectCarousel({ projects, label, aside }: { projects: Project[]; label: string; aside?: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [paused, setPaused] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setEdges({ start: t.scrollLeft <= 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 });
  }, []);

  const step = useCallback((dir: 1 | -1, loop = false) => {
    const t = trackRef.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
    if (loop && dir === 1 && atEnd) t.scrollTo({ left: 0, behavior: 'smooth' });
    else t.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges, projects.length]);

  useEffect(() => {
    if (paused || active) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') step(1, true);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, active, step]);

  return (
    <div
      className="project-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="project-carousel__controls">
        {aside}
        <button type="button" className="project-carousel__arrow" onClick={() => step(-1)} disabled={edges.start} aria-label="Previous projects">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" className="project-carousel__arrow" onClick={() => step(1, true)} aria-label="Next projects">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="project-carousel__track" ref={trackRef} onScroll={updateEdges}>
        {projects.map((p, i) => (
          <div key={p.id} className="project-carousel__slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${projects.length}`}>
            <ProjectCard project={p} onOpen={setActive} compact />
          </div>
        ))}
      </div>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </div>
  );
}
