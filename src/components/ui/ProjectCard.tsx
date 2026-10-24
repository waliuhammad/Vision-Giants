import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../../data/portfolio';
import { categoryLabels } from '../../data/portfolio';
import { ProjectPreview } from '../visuals/ProjectPreview';

interface ProjectCardProps {
  project: Project;
  onOpen?: (project: Project) => void;
  headingLevel?: 'h2' | 'h3';
}

export function ProjectCard({ project, onOpen, headingLevel: H = 'h3' }: ProjectCardProps) {
  return (
    <article className="card card--interactive project-card">
      <div className="project-card__media">
        <ProjectPreview kind={project.preview} />
        {project.isDemo && <span className="badge badge--neutral">Concept</span>}
      </div>
      <div className="project-card__body">
        <div className="project-card__meta">
          <H style={{ margin: 0, fontSize: 'var(--fs-h3)' }}>{project.title}</H>
          <span className="badge">{categoryLabels[project.category]}</span>
        </div>
        <p>{project.summary}</p>
        <ul className="tech-tags" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
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
          <Link to="/portfolio/" className="text-link project-card__action">
            View in portfolio<span className="visually-hidden">: {project.title}</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}
