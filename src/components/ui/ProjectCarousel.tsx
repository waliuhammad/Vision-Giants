import { useState, type CSSProperties, type ReactNode } from 'react';
import type { Project } from '../../data/portfolio';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';

/** Seconds each card takes to travel its own width; higher is slower. */
const SECONDS_PER_CARD = 7;

/**
 * Continuously gliding row of compact project cards (a marquee). The list is rendered twice and
 * the track slides left by exactly one set with a linear CSS animation, so the loop has no seam.
 * It only pauses while a project is open, or under keyboard focus so links can be reached.
 */
export function ProjectCarousel({ projects, label, aside }: { projects: Project[]; label: string; aside?: ReactNode }) {
  const [active, setActive] = useState<Project | null>(null);
  const style = { '--marquee-duration': `${projects.length * SECONDS_PER_CARD}s` } as CSSProperties;

  return (
    <div className="project-carousel" role="region" aria-label={label}>
      {aside && <div className="project-carousel__controls">{aside}</div>}
      <div className={`project-marquee${active ? ' is-paused' : ''}`} style={style}>
        <div className="project-marquee__track">
          {[0, 1].map((copy) =>
            projects.map((p) => (
              // The second copy only exists to make the loop seamless.
              <div key={`${copy}-${p.id}`} className="project-marquee__slide">
                <ProjectCard project={p} onOpen={setActive} compact />
              </div>
            )),
          )}
        </div>
      </div>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </div>
  );
}
