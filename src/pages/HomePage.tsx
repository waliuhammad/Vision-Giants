import { ArrowRight, ArrowDown, CodeXml, Smartphone, Cpu, Palette, Lightbulb, Users, Layers, ShieldCheck } from 'lucide-react';
import type { CSSProperties } from 'react';
import { company } from '../data/company';
import { useContent } from '../content/ContentContext';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceCard } from '../components/ui/ServiceCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { ProcessTimeline } from '../components/ui/ProcessTimeline';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { HeroGlobe } from '../components/visuals/HeroGlobe';

const capabilities = [
  { icon: CodeXml, label: 'Web Applications & Platforms' },
  { icon: Smartphone, label: 'Mobile Apps & Solutions' },
  { icon: Cpu, label: 'Custom Software & Integrations' },
  { icon: Palette, label: 'UI/UX & Product Design' },
];

const values = [
  {
    icon: Lightbulb,
    title: 'Thoughtful Engineering',
    text: 'Clean architecture, readable code and sensible technology choices that keep your product easy to evolve.',
  },
  {
    icon: Users,
    title: 'User-Focused Design',
    text: 'Interfaces shaped around real user needs, tested early and refined through every iteration.',
  },
  {
    icon: Layers,
    title: 'Scalable Solutions',
    text: 'Systems designed to handle growth, from your first users to a much larger audience.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Collaboration',
    text: 'Clear scope, regular demos and honest communication, so you always know where your project stands.',
  },
];

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

export default function HomePage() {
  const { services, projects } = useContent();
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="bg-grid" aria-hidden="true" />
        <div className="container">
          <div className="hero__grid">
            <div>
              <p className="eyebrow enter">{company.tagline}</p>
              <h1 id="hero-title" className="enter" style={delay(80)}>
                Building <span className="text-gradient">Digital Solutions</span> That Move Businesses Forward.
              </h1>
              <p className="lead enter" style={delay(160)}>
                We design and develop modern digital experiences, web applications and software solutions that help
                businesses grow.
              </p>
              <div className="hero__actions enter" style={delay(240)}>
                <Button to="/contact/" icon={<ArrowRight size={18} />}>
                  Start a Project
                </Button>
                <Button to="/portfolio/" variant="ghost" icon={<ArrowRight size={16} />}>
                  Explore Our Work
                </Button>
              </div>
            </div>
            <HeroGlobe />
          </div>

          <ul className="capabilities enter" style={delay(320)} aria-label="Core capabilities">
            {capabilities.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span className="icon-wrap" aria-hidden="true">
                  <Icon size={19} />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <a href="#services" className="scroll-cue" aria-label="Scroll to services">
            Scroll down
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="services" className="section" aria-labelledby="services-title">
        <div className="container">
          <SectionHeading
            id="services-title"
            eyebrow="What we do"
            title="End-to-end digital solutions for your business"
            lead="A complete range of design and development services to help you plan, build and scale digital products."
            aside={
              <Button to="/services/" variant="outline" icon={<ArrowRight size={16} />}>
                All services
              </Button>
            }
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

      <section className="section section--alt" aria-labelledby="work-title">
        <div className="container">
          <SectionHeading
            id="work-title"
            eyebrow="Our work"
            title="Featured project concepts"
            lead="Demonstration projects that show how we approach product design and engineering across different industries."
            aside={
              <Button to="/portfolio/" variant="outline" icon={<ArrowRight size={16} />}>
                View portfolio
              </Button>
            }
          />
          <div className="grid grid--3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="container why">
          <SectionHeading
            id="why-title"
            eyebrow="Why work with us"
            title="A partner focused on quality and clarity"
            lead="We combine product thinking with solid engineering to deliver software that works well today and stays maintainable tomorrow."
          />
          <div className="grid why-grid">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 2) * 90}>
                <article className="card card--interactive" style={{ height: '100%' }}>
                  <span className="icon-wrap" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="process-title">
        <div className="container">
          <SectionHeading
            id="process-title"
            eyebrow="Our process"
            title="A simple, transparent process"
            lead="A clear, structured path from first conversation to a product in the hands of your users."
            align="center"
          />
          <ProcessTimeline />
        </div>
      </section>

      <CTASection />
    </>
  );
}
