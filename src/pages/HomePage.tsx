import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRight, CodeXml, Smartphone, Cpu, Palette, Lightbulb, Users, Layers, ShieldCheck } from 'lucide-react';
import { technologies } from '../data/technologies';
import type { Project } from '../data/portfolio';
import { useContent, usePageText } from '../content/ContentContext';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceCard } from '../components/ui/ServiceCard';
import { ProjectCarousel } from '../components/ui/ProjectCarousel';
import { ProjectDialog } from '../components/ui/ProjectDialog';
import { FeaturedProject } from '../components/ui/FeaturedProject';
import { TechLogo } from '../components/visuals/TechLogos';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { HeroShowcase } from '../components/visuals/HeroShowcase';
import { HeroParticles } from '../components/visuals/HeroParticles';
import { Highlight } from '../components/ui/Highlight';
import { PartnersSection } from '../components/ui/PartnersSection';

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

const HOME_SERVICES_COUNT = 6;

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

export default function HomePage() {
  const t = usePageText('home');
  const { services, projects } = useContent();
  const [active, setActive] = useState<Project | null>(null);
  const [featured, ...moreProjects] = projects;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroParticles />
        <div className="container">
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow enter">{t('heroEyebrow')}</p>
              <h1 id="hero-title" className="enter" style={delay(80)}>
                <Highlight text={t('heroTitle')} />
              </h1>
              <p className="lead enter" style={delay(160)}>
                {t('heroLead')}
              </p>
              <div className="hero__actions enter" style={delay(240)}>
                <Button to="/contact/" icon={<ArrowRight size={18} />}>
                  Start Your Project
                </Button>
                <Button to="/services/website-development/" variant="outline">
                  Explore Our Work
                </Button>
              </div>
              {projects.length > 0 && (
                <ul className="hero__facts enter" style={delay(320)}>
                  <li>
                    <strong>{projects.length}</strong> live websites in our portfolio
                  </li>
                  <li>
                    <strong>{services.length}</strong> services under one roof
                  </li>
                </ul>
              )}
            </div>
            <HeroShowcase projects={projects} />
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
        </div>
      </section>

      <PartnersSection eyebrow={t('partnersEyebrow')} title={t('partnersTitle')} lead={t('partnersLead')} />

      <section id="services" className="section" aria-labelledby="services-title">
        <div className="container">
          <SectionHeading
            id="services-title"
            eyebrow={t('servicesEyebrow')}
            title={t('servicesTitle')}
            lead={t('servicesLead')}
            aside={
              <Link to="/services/" className="text-link section-heading__link">
                View all services <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid grid--3">
            {services.slice(0, HOME_SERVICES_COUNT).map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 90}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="section showcase-band" aria-labelledby="work-title">
          <div className="showcase-band__glow" aria-hidden="true" />
          <div className="container">
            <SectionHeading
              id="work-title"
              eyebrow={t('workEyebrow')}
              title={t('workTitle')}
              lead={t('workLead')}
              aside={
                <Button to="/services/website-development/" variant="outline" icon={<ArrowRight size={16} />}>
                  View all projects
                </Button>
              }
            />
            <FeaturedProject project={featured} onOpen={setActive} />
            {moreProjects.length > 0 && (
              <div className="showcase-band__more">
                <p className="showcase-band__more-title">More from our portfolio</p>
                <ProjectCarousel projects={moreProjects} label="More projects" />
              </div>
            )}
          </div>
          <ProjectDialog project={active} onClose={() => setActive(null)} />
        </section>
      )}

      <section className="section" aria-labelledby="why-title">
        <div className="container why">
          <SectionHeading
            id="why-title"
            eyebrow={t('whyEyebrow')}
            title={t('whyTitle')}
            lead={t('whyLead')}
          />
          <div className="grid why-grid">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 2) * 90}>
                <article className="card card--interactive why-card" style={{ height: '100%' }}>
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

      <section className="section section--alt" aria-labelledby="tech-title">
        <div className="container tech-strip">
          <SectionHeading
            id="tech-title"
            eyebrow={t('techEyebrow')}
            title={t('techTitle')}
            lead={t('techLead')}
          />
          <ul className="tech-strip__list">
            {technologies.map((t, i) => (
              <Reveal as="li" key={t.id} delay={i * 70}>
                <TechLogo id={t.id} className="tech-strip__logo" />
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.category}</small>
                </span>
              </Reveal>
            ))}
          </ul>
          <Link to="/technologies/" className="text-link">
            See how we use them <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CTASection
        title={t('ctaTitle')}
        text={t('ctaText')}
        primary={{ label: 'Start Your Project', to: '/contact/' }}
      />
    </>
  );
}
