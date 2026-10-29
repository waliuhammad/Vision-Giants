import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { categoryLabels, projectServicePath } from '../../data/portfolio';
import { ProjectMedia } from '../visuals/ProjectPreview';

interface ProjectCardProps {
  project: Project;
  onOpen?: (project: Project) => void;
  headingLevel?: 'h2' | 'h3' | 'h4';
  /** Smaller card for dense grids and the homepage glide. */
  compact?: boolean;
}

/** "E-commerce · Computer hardware (Pakistan)" → ["E-commerce", "Computer hardware (Pakistan)"] */
const splitIndustry = (industry?: string) => {
  const [sector, ...rest] = (industry ?? '').split('·').map((s) => s.trim());
  return { sector: sector || '', detail: rest.join(' · ') };
};

export function ProjectCard(props: ProjectCardProps) {
  return props.compact ? <CompactProjectCard {...props} /> : <FullProjectCard {...props} />;
}

/**
 * Showcase card: the screenshot sits in a mini browser frame, the sector is a label on the image,
 * and the whole card opens the project (the live-site link stays separately clickable).
 */
function CompactProjectCard({ project, onOpen, headingLevel: H = 'h3' }: ProjectCardProps) {
  const { sector, detail } = splitIndustry(project.industry);
  const host = project.url ? new URL(project.url).host.replace(/^www\./, '') : '';
  const label = (
    <>
      View project<span className="visually-hidden">: {project.title}</span>
    </>
  );

  return (
    <article className="pcard">
      <div className="pcard__frame">
        <div className="pcard__browser">
          <div className="pcard__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            {host && <span>{host}</span>}
          </div>
          <div className="pcard__shot">
            <ProjectMedia project={project} />
          </div>
        </div>
        {(sector || project.isDemo) && <span className="pcard__tag">{project.isDemo ? 'Concept' : sector}</span>}
      </div>

      <div className="pcard__body">
        <div className="pcard__head">
          <H className="pcard__title">{project.title}</H>
          {project.url && (
            <a
              href={project.url}
              className="pcard__live"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live site for ${project.title} (opens in a new tab)`}
              title="Visit live site"
            >
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
        {detail && <p className="pcard__detail">{detail}</p>}
        <p className="pcard__summary">{project.summary}</p>

        <div className="pcard__foot">
          {project.tech.length > 0 && (
            <ul className="pcard__tech" aria-label="Technologies">
              {project.tech.slice(0, 3).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {onOpen ? (
            <button type="button" className="pcard__open" onClick={() => onOpen(project)} aria-haspopup="dialog">
              {label}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <Link to={projectServicePath(project.category)} className="pcard__open">
              {label}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function FullProjectCard({ project, onOpen, headingLevel: H = 'h3' }: ProjectCardProps) {
  return (
    <article className="card card--interactive project-card">
      <div className="project-card__media">
        <ProjectMedia project={project} />
        {project.isDemo && <span className="badge badge--neutral">Concept</span>}
      </div>
      <div className="project-card__body">
        <div className="project-card__meta">
          <H style={{ margin: 0, fontSize: 'var(--fs-h3)' }}>{project.title}</H>
          <span className="badge">{categoryLabels[project.category]}</span>
        </div>
        {project.industry && <p className="project-card__industry">{project.industry}</p>}
        <p>{project.summary}</p>
        <ul className="tech-tags" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="project-card__actions">
          {onOpen ? (
            <button
              type="button"
              className="text-link project-card__action"
              onClick={() => onOpen(project)}
              aria-haspopup="dialog"
            >
              View project<span className="visually-hidden">: {project.title}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <Link to={projectServicePath(project.category)} className="text-link project-card__action">
              View project<span className="visually-hidden">: {project.title}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          )}
          {project.url && (
            <a href={project.url} className="text-link project-card__action" target="_blank" rel="noopener noreferrer">
              Live site<span className="visually-hidden"> for {project.title} (opens in a new tab)</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
