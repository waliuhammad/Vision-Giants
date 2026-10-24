import { Check, ArrowUpRight } from 'lucide-react';
import type { Technology } from '../../data/technologies';
import { TechLogo } from '../visuals/TechLogos';

export function TechnologyCard({ tech }: { tech: Technology }) {
  return (
    <article className="card card--interactive tech-card">
      <TechLogo id={tech.id} className="tech-card__logo" />
      <span className="badge badge--purple">{tech.category}</span>
      <h3>{tech.name}</h3>
      <p>{tech.description}</p>
      <ul className="check-list">
        {tech.uses.map((u) => (
          <li key={u}>
            <Check size={15} aria-hidden="true" />
            {u}
          </li>
        ))}
      </ul>
      <a href={tech.href} className="text-link" style={{ marginTop: 'var(--space-5)' }} target="_blank" rel="noopener noreferrer">
        Official site<span className="visually-hidden"> for {tech.name} (opens in a new tab)</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </article>
  );
}
