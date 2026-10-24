import { ArrowRight, Check, Plus } from 'lucide-react';
import { services } from '../data/services';
import { faqs } from '../data/faq';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceCard } from '../components/ui/ServiceCard';
import { ProcessTimeline } from '../components/ui/ProcessTimeline';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { LayersVisual } from '../components/visuals/IsoVisuals';

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        eyebrow="Our services"
        title="End-to-End Digital Solutions for Modern Businesses"
        lead="From the first idea to launch and beyond, we design, build and integrate the digital products your business needs to grow."
        actions={
          <>
            <Button to="/contact/" icon={<ArrowRight size={18} />}>
              Start a Project
            </Button>
            <Button href="#process" variant="outline">
              See our process
            </Button>
          </>
        }
        visual={<LayersVisual />}
      />

      <section className="section section--tight" aria-labelledby="overview-title">
        <div className="container">
          <SectionHeading
            id="overview-title"
            eyebrow="Overview"
            title="Everything you need to build and scale"
            lead="Pick a single service or combine them into a complete product team."
          />
          <div className="grid grid--3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 90}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="details-title">
        <div className="container">
          <SectionHeading
            id="details-title"
            eyebrow="In detail"
            title="What each service includes"
            lead="Every engagement is tailored, but here is what you can typically expect from each area."
          />
          <div className="stack">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.id} as="article" id={s.id} className="card service-detail">
                  <div>
                    <div className="service-detail__head">
                      <span className="icon-wrap" aria-hidden="true">
                        <Icon size={22} />
                      </span>
                      <span className="service-detail__index">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    <Button to="/contact/" variant="outline" size="sm" icon={<ArrowRight size={15} />}>
                      Discuss this service<span className="visually-hidden">: {s.title}</span>
                    </Button>
                  </div>
                  <div className="service-detail__deliverables">
                    <h4>Typical deliverables</h4>
                    <ul className="check-list">
                      {s.deliverables.map((d) => (
                        <li key={d}>
                          <Check size={16} aria-hidden="true" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="process" className="section" aria-labelledby="process-title">
        <div className="container">
          <SectionHeading
            id="process-title"
            eyebrow="How we work"
            title="A simple, transparent process"
            lead="Short feedback loops and clear milestones keep projects predictable."
            align="center"
          />
          <ProcessTimeline />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="faq-title">
        <div className="container">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Frequently asked questions" align="center" />
          <Reveal className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <Plus size={20} aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Ready to start your project?"
        text="Share a few details about what you want to build and we’ll suggest the best way forward."
      />
    </>
  );
}
