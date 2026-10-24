import { ArrowRight, Plus } from 'lucide-react';
import { services } from '../data/services';
import { faqs } from '../data/faq';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServicesGrid } from '../components/ui/ServiceCard';
import { ProcessTimeline } from '../components/ui/ProcessTimeline';
import { CTASection } from '../components/ui/CTASection';
import { LayersVisual } from '../components/visuals/IsoVisuals';

export function ServicesPage() {
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
            eyebrow="What we do"
            title="Everything you need to build and scale"
            lead="Pick a single service or combine them into a complete product team."
          />
          <ServicesGrid services={services} initialCount={6} />
        </div>
      </section>

      <section id="process" className="section section--alt" aria-labelledby="process-title">
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

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Frequently asked questions" align="center" />
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <Plus size={20} aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to start your project?"
        text="Share a few details about what you want to build and we’ll suggest the best way forward."
      />
    </>
  );
}

export default ServicesPage;