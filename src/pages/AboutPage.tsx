import { ArrowRight, Lightbulb, Users, ShieldCheck, TrendingUp, Target, Eye, Search, Repeat, Wrench, MessageSquare } from 'lucide-react';
import { company } from '../data/company';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProcessTimeline } from '../components/ui/ProcessTimeline';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { CubeVisual } from '../components/visuals/IsoVisuals';

const values = [
  { icon: Lightbulb, title: 'Innovation', text: 'We explore new technologies and ideas, and adopt them when they genuinely serve the product.' },
  { icon: Users, title: 'Collaboration', text: 'We work closely with clients at every step, treating your goals as our own.' },
  { icon: ShieldCheck, title: 'Quality', text: 'We build products that are reliable, accessible, secure and maintainable.' },
  { icon: TrendingUp, title: 'Growth', text: 'We keep learning as a team and build software that helps our clients grow.' },
];

const approach = [
  { icon: Search, title: 'Start with the problem', text: 'We understand the business need and the people we are building for before choosing solutions.' },
  { icon: Repeat, title: 'Build in iterations', text: 'Small, frequent releases let us validate decisions early and adapt quickly.' },
  { icon: Wrench, title: 'Engineer for the long term', text: 'Clear structure, documentation and testing keep products maintainable as they grow.' },
  { icon: MessageSquare, title: 'Communicate openly', text: 'Regular updates and honest conversations about scope, risks and trade-offs.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About"
        eyebrow="About us"
        title="Turning Ideas into Exceptional Digital Products."
        lead="We are a team of developers, designers and problem-solvers focused on building digital products that create real value for the businesses and people who use them."
        actions={
          <Button to="/contact/" icon={<ArrowRight size={18} />}>
            Work With Us
          </Button>
        }
        visual={<CubeVisual />}
      />

      <section className="section section--tight" aria-labelledby="intro-title">
        <div className="container intro-grid">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2 id="intro-title">Design and engineering under one roof</h2>
            <div className="prose" style={{ marginTop: 'var(--space-5)' }}>
              <p>
                {company.name} is a software house that helps businesses turn ideas into dependable digital products.
                We bring strategy, design and development together so that what gets built is useful, usable and
                technically sound.
              </p>
              <p>
                Whether you need a new web application, a mobile app or custom software for your team, we work
                alongside you from discovery to launch, and we care about the details that make products feel right.
              </p>
            </div>
          </Reveal>
          <div className="grid">
            <Reveal delay={80}>
              <article className="card feature">
                <span className="icon-wrap" aria-hidden="true">
                  <Target size={22} />
                </span>
                <div>
                  <h3>Our mission</h3>
                  <p>To help businesses grow with well-crafted software that solves real problems and is a pleasure to use.</p>
                </div>
              </article>
            </Reveal>
            <Reveal delay={160}>
              <article className="card feature">
                <span className="icon-wrap" aria-hidden="true">
                  <Eye size={22} />
                </span>
                <div>
                  <h3>Our vision</h3>
                  <p>To be a trusted technology partner known for thoughtful engineering, clear communication and lasting quality.</p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="values-title">
        <div className="container">
          <SectionHeading id="values-title" eyebrow="Our values" title="What guides our work" align="center" />
          <div className="grid grid--4">
            {values.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
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

      <section className="section" aria-labelledby="approach-title">
        <div className="container">
          <SectionHeading
            id="approach-title"
            eyebrow="Our approach"
            title="How we think about building software"
            lead="Principles that shape every project, whatever its size."
          />
          <div className="grid grid--2">
            {approach.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 2) * 80}>
                <article className="card feature" style={{ height: '100%' }}>
                  <span className="icon-wrap" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
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
            lead="We follow a clear process to turn your ideas into successful digital products."
            align="center"
          />
          <ProcessTimeline />
        </div>
      </section>

      <CTASection title="Let’s build something meaningful together." />
    </>
  );
}
