import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';

const AUTOPLAY_MS = 4000;
const GLIDE_MS = 850;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Endlessly sliding row of compact project cards. The list is rendered twice so the glide can
 * carry on past the last project into the first; when it reaches the copy, it jumps back by one
 * set, which looks identical. Each step is an eased animation of scrollLeft (scroll-snap is
 * switched off while it runs so the two don't fight), and swiping still uses native scroll-snap.
 * Autoplay pauses only for keyboard navigation or an open project.
 */
export function ProjectCarousel({ projects, label, aside }: { projects: Project[]; label: string; aside?: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const [active, setActive] = useState<Project | null>(null);
  const [paused, setPaused] = useState(false);
  /** Bumped on every step so the progress bar restarts. */
  const [tick, setTick] = useState(0);

  const glide = useCallback((dir: 1 | -1) => {
    const t = trackRef.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card || animating.current) return;
    const stepPx = card.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0);
    const setWidth = stepPx * projects.length;

    animating.current = true;
    t.style.scrollSnapType = 'none';
    // Keep the position inside the first set so there is always room to move both ways.
    if (dir === -1 && t.scrollLeft < stepPx / 2) t.scrollLeft += setWidth;
    const from = t.scrollLeft;
    const to = Math.round(from / stepPx) * stepPx + dir * stepPx;
    const start = performance.now();

    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / GLIDE_MS);
      t.scrollLeft = from + (to - from) * easeInOutCubic(progress);
      if (progress < 1) return requestAnimationFrame(frame);
      if (t.scrollLeft >= setWidth - 1) t.scrollLeft -= setWidth;
      t.style.scrollSnapType = '';
      animating.current = false;
    };
    requestAnimationFrame(frame);
    setTick((n) => n + 1);
  }, [projects.length]);

  useEffect(() => {
    if (paused || active) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') glide(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, active, glide, tick]);

  // After a manual swipe lands in the copy, move back into the first set without a visible jump.
  const onScrollEnd = () => {
    const t = trackRef.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card || animating.current) return;
    const setWidth = (card.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0)) * projects.length;
    if (t.scrollLeft >= setWidth - 1) t.scrollLeft -= setWidth;
  };

  return (
    <div
      className="project-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) setPaused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="project-carousel__controls">
        {aside}
        <button type="button" className="project-carousel__arrow" onClick={() => glide(-1)} aria-label="Previous projects">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" className="project-carousel__arrow" onClick={() => glide(1)} aria-label="Next projects">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="project-carousel__track" ref={trackRef} onScrollEnd={onScrollEnd}>
        {[0, 1].map((copy) =>
          projects.map((p, i) => (
            <div
              key={`${copy}-${p.id}`}
              className="project-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${projects.length}`}
            >
              <ProjectCard project={p} onOpen={setActive} compact />
            </div>
          )),
        )}
      </div>
      <div className="project-carousel__progress" aria-hidden="true">
        <span key={tick} style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: paused || active ? 'paused' : 'running' }} />
      </div>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </div>
  );
}
