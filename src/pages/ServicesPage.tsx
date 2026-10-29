import { ArrowRight, Plus } from 'lucide-react';
import { useContent, usePageText } from '../content/ContentContext';
import { faqs } from '../data/faq';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServicesGrid } from '../components/ui/ServiceCard';
import { ProcessTimeline } from '../components/ui/ProcessTimeline';
import { CTASection } from '../components/ui/CTASection';
import { LayersVisual } from '../components/visuals/IsoVisuals';

export default function ServicesPage() {
  const t = usePageText('services');
  const { services } = useContent();

  return (
    <>
      <PageHero
        crumb="Services"
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        lead={t('heroLead')}
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
            eyebrow={t('listEyebrow')}
            title={t('listTitle')}
            lead={t('listLead')}
          />
          <ServicesGrid services={services} initialCount={6} />
        </div>
      </section>

      <section id="process" className="section section--alt" aria-labelledby="process-title">
        <div className="container">
          <SectionHeading
            id="process-title"
            eyebrow={t('processEyebrow')}
            title={t('processTitle')}
            lead={t('processLead')}
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
        title={t('ctaTitle')}
        text={t('ctaText')}
      />
    </>
  );
}