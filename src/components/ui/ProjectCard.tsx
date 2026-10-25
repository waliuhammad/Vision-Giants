import { Link } from 'react-router';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { categoryLabels } from '../../data/portfolio';
import { ProjectMedia } from '../visuals/ProjectPreview';

interface ProjectCardProps {
  project: Project;
  onOpen?: (project: Project) => void;
  headingLevel?: 'h2' | 'h3';
}

export function ProjectCard({ project, onOpen, headingLevel: H = 'h3' }: ProjectCardProps) {
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
            <Link to={`/portfolio/?project=${encodeURIComponent(project.id)}`} className="text-link project-card__action">
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
