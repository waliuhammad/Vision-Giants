import { ArrowRight, Info } from 'lucide-react';
import { technologies, supportingStack, type TechId } from '../data/technologies';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TechnologyCard } from '../components/ui/TechnologyCard';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { StackVisual } from '../components/visuals/IsoVisuals';
import { TechLogo } from '../components/visuals/TechLogos';

const architecture: { label: string; nodes: { id: TechId; name: string; role: string }[] }[] = [
  { label: 'Interface', nodes: [{ id: 'react', name: 'React', role: 'Web interfaces & components' }] },
  { label: 'Services', nodes: [{ id: 'node', name: 'Node.js', role: 'APIs & business logic' }] },
  {
    label: 'Platform',
    nodes: [
      { id: 'firebase', name: 'Firebase', role: 'Data, auth & hosting' },
      { id: 'cloudinary', name: 'Cloudinary', role: 'Media optimisation & delivery' },
    ],
  },
];

export default function TechnologiesPage() {
  return (
    <>
      <PageHero
        crumb="Technologies"
        eyebrow="Our technologies"
        title="Modern Technologies. Thoughtful Engineering."
        lead="We use a modern, well-supported technology stack to build scalable, secure and high-performance applications for the web, mobile and cloud."
        actions={
          <Button to="/contact/" icon={<ArrowRight size={18} />}>
            Discuss Your Stack
          </Button>
        }
        visual={<StackVisual />}
      />

      <section className="section section--tight" aria-labelledby="core-title">
        <div className="container">
          <SectionHeading
            id="core-title"
            eyebrow="Core stack"
            title="Tools we build with"
            lead="Each tool is chosen for a clear purpose and combined according to what your project actually needs."
          />
          <div className="grid grid--4">
            {technologies.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <TechnologyCard tech={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="arch-title">
        <div className="container">
          <SectionHeading
            id="arch-title"
            eyebrow="How it fits together"
            title="A typical application architecture"
            lead="A simplified view of how these technologies commonly work together in a modern web application."
            align="center"
          />
          <Reveal className="arch">
            {architecture.map((col) => (
              <div key={col.label} className="arch__col">
                <span className="arch__label">{col.label}</span>
                {col.nodes.map((n) => (
                  <div key={n.id} className="card arch__node">
                    <TechLogo id={n.id} />
                    <div>
                      <strong>{n.name}</strong>
                      <span>{n.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="supporting-title">
        <div className="container">
          <SectionHeading id="supporting-title" eyebrow="Supporting tools" title="Beyond the core stack" />
          <div className="grid grid--3">
            {supportingStack.map((g, i) => (
              <Reveal key={g.group} delay={i * 80}>
                <article className="card stack-list" style={{ height: '100%' }}>
                  <h3>{g.group}</h3>
                  <ul>
                    {g.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="note" style={{ marginTop: 'var(--space-6)' }}>
              <Info size={16} aria-hidden="true" />
              Technology choices are made per project. We recommend the simplest stack that meets your requirements for
              performance, security and long-term maintenance.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Not sure which technology is right for you?"
        text="We’ll help you weigh the options and choose a stack that fits your goals, budget and team."
        secondary={{ label: 'View Services', to: '/services/' }}
      />
    </>
  );
}
