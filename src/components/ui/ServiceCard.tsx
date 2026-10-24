import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Service } from '../../data/services';

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <article className="card card--interactive service-card">
      <span className="icon-wrap" aria-hidden="true">
        <Icon size={22} />
      </span>
      <h3>{service.title}</h3>
      <p>{service.short}</p>
      <Link to={`/services/#${service.id}`} className="text-link">
        Learn more<span className="visually-hidden"> about {service.title}</span>
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  );
}
