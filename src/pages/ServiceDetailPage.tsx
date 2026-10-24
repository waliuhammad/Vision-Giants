import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useParams } from 'react-router';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { getServiceById, getServiceIcon, services } from '../data/services';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceCard } from '../components/ui/ServiceCard';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { LayersVisual } from '../components/visuals/IsoVisuals';
import NotFoundPage from './NotFoundPage';

/* Tighter vertical spacing. Change these two values to fine-tune. */
const SPACE = 'clamp(2rem, 4vw, 3rem)';
const sectionStyle: CSSProperties = { paddingTop: SPACE, paddingBottom: SPACE };
const sectionLastStyle: CSSProperties = { paddingTop: SPACE, paddingBottom: 0 };

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceById(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (service) document.title = `${service.title} | Your Company`;
  }, [slug, service]);

  if (!service) return <NotFoundPage />;

  const Icon = getServiceIcon(service.icon);
  const related = services.filter((s) => s.id !== service.id).slice(0, 3);
  const hasPlatforms = !!service.platforms && service.platforms.length > 0;

  return (
    <>
      <PageHero
        crumb={service.title}
        eyebrow="Our services"
        title={service.title}
        lead={service.short}
        actions={
          <>
            <Button to="/contact/" icon={<ArrowRight size={18} />}>
              Get a Quote
            </Button>
            <Button to="/services/" variant="outline" icon={<ArrowLeft size={16} />}>
              All services
            </Button>
          </>
        }
        visual={<LayersVisual />}
      />

      {/* Overview + deliverables */}
      <section className="section section--tight" style={sectionStyle} aria-labelledby="overview-title">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            <Reveal>
              <div>
                <span className="icon-wrap" aria-hidden="true" style={{ marginBottom: '1rem' }}>
                  <Icon size={24} />
                </span>
                <SectionHeading
                  id="overview-title"
                  eyebrow="Overview"
                  title={`About our ${service.title.toLowerCase()} service`}
                  lead={service.description}
                />
              </div>
            </Reveal>

            <Reveal delay={90}>
              <article className="card" style={{ height: '100%' }}>
                <h3 style={{ marginTop: 0 }}>What you get</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'grid', gap: '0.8rem' }}>
                  {service.deliverables.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(47, 140, 255, 0.15)',
                          color: '#4da3ff',
                        }}
                      >
                        <Check size={14} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Platforms (only for services that have them, e.g. Ecommerce) */}
      {hasPlatforms && (
        <section className="section section--alt" style={sectionStyle} aria-labelledby="platforms-title">
          <div className="container">
            <SectionHeading
              id="platforms-title"
              eyebrow="Platforms"
              title="Where we work"
              lead="We handle setup, growth and day-to-day management on the platforms that matter most."
            />
            <div className="grid grid--3">
              {service.platforms!.map((p, i) => (
                <Reveal key={p.name} delay={(i % 3) * 90}>
                  <article className="card card--interactive" style={{ height: '100%' }}>
                    <h3>{p.name}</h3>
                    <p>{p.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related services */}
      <section
        className={hasPlatforms ? 'section' : 'section section--alt'}
        style={sectionLastStyle}
        aria-labelledby="related-title"
      >
        <div className="container">
          <SectionHeading
            id="related-title"
            eyebrow="More services"
            title="You might also need"
            lead="Combine services to get a complete product team."
            aside={
              <Button to="/services/" variant="outline" icon={<ArrowRight size={16} />}>
                All services
              </Button>
            }
          />
          <div className="grid grid--3">
            {related.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to start with ${service.title.toLowerCase()}?`}
        text="Share a few details about your project and we’ll suggest the best way forward."
      />
    </>
  );
}

export default ServiceDetailPage;