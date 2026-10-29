import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { ProjectMedia } from '../visuals/ProjectPreview';
import { Reveal } from '../animations/Reveal';

/**
 * Large editorial feature for one real project on the dark showcase band: a big screenshot in a
 * browser frame beside its summary, key features and technologies. Uses only the project's data.
 */
export function FeaturedProject({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const host = project.url ? new URL(project.url).host.replace(/^www\./, '') : '';
  return (
    <Reveal className="featured">
      <div className="featured__media">
        <div className="featured__browser">
          <div className="featured__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            {host && <span>{host}</span>}
          </div>
          <div className="featured__shot">
            <ProjectMedia project={project} />
          </div>
        </div>
      </div>
      <div className="featured__body">
        <p className="featured__label">Featured project</p>
        <h3 className="featured__title">{project.title}</h3>
        {project.industry && <p className="featured__industry">{project.industry}</p>}
        <p className="featured__summary">{project.summary}</p>
        {project.features.length > 0 && (
          <ul className="featured__features">
            {project.features.slice(0, 4).map((f) => (
              <li key={f}>
                <Check size={15} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}
        {project.tech.length > 0 && (
          <ul className="featured__tech" aria-label="Technologies">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <div className="featured__actions">
          <button type="button" className="btn btn--primary" onClick={() => onOpen(project)} aria-haspopup="dialog">
            View project
            <ArrowRight size={17} aria-hidden="true" />
          </button>
          {project.url && (
            <a href={project.url} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
              Visit live site
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}
