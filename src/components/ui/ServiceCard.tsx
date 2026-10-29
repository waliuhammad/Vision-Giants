import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { getServiceIcon, type Service } from '../../data/services';

export function ServiceCard({ service }: { service: Service }) {
  const Icon = getServiceIcon(service.icon);
  return (
    <article className="card card--interactive service-card">
      <span className="icon-wrap" aria-hidden="true">
        <Icon size={22} />
      </span>
      <h3>{service.title}</h3>
      <p>{service.short}</p>
      <Link to={`/services/${service.id}`} className="text-link">
        Learn more<span className="visually-hidden"> about {service.title}</span>
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </article>
  );
}

interface ServicesGridProps {
  services: Service[];
  initialCount?: number;
}

const wrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.1rem',
  marginTop: '3rem',
};

const countStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.9rem',
  letterSpacing: '0.02em',
  color: 'var(--color-muted)',
};

export function ServicesGrid({ services, initialCount = 6 }: ServicesGridProps) {
  const [expanded, setExpanded] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasMore = services.length > initialCount;
  const visibleServices = expanded ? services : services.slice(0, initialCount);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (!next) {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      <div ref={gridRef} id="services-grid" className="grid grid--3 services-grid">
        {visibleServices.map((s) => (
          <div key={s.id} className="services-grid__item">
            <ServiceCard service={s} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div style={wrapStyle}>
          <p style={countStyle} aria-live="polite">
            Showing {visibleServices.length} of {services.length} services
          </p>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            aria-controls="services-grid"
            className="btn btn--outline"
          >
            {expanded ? 'Show fewer' : 'See all services'}
            <ChevronDown
              size={18}
              aria-hidden="true"
              style={{
                transition: 'transform 0.25s ease',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default ServiceCard;