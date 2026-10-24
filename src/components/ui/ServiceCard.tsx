import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router';
<<<<<<< HEAD
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { Service } from '../../data/services';
=======
import { ArrowRight } from 'lucide-react';
import { getServiceIcon, type Service } from '../../data/services';
>>>>>>> d5407b3abf60a45bf5449ce3ff57ee8f9cc4f8b1

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
  color: 'rgba(200, 214, 235, 0.65)',
};

const buttonBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',
  whiteSpace: 'nowrap',
  padding: '0.85rem 2rem',
  borderRadius: '999px',
  border: '1px solid rgba(47, 140, 255, 0.55)',
  background: 'rgba(47, 140, 255, 0.08)',
  color: '#ffffff',
  fontFamily: 'inherit',
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: 1,
  cursor: 'pointer',
  transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
};

const buttonHover: CSSProperties = {
  background: 'linear-gradient(135deg, #2f8cff, #5b6cff)',
  borderColor: 'transparent',
  boxShadow: '0 8px 24px rgba(47, 140, 255, 0.35)',
  transform: 'translateY(-2px)',
};

export function ServicesGrid({ services, initialCount = 6 }: ServicesGridProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
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
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-expanded={expanded}
            aria-controls="services-grid"
            style={hovered ? { ...buttonBase, ...buttonHover } : buttonBase}
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