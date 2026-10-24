import { ArrowRight, Briefcase, GraduationCap, Handshake, Sparkles, Compass, Code, Server, Layers, PenTool } from 'lucide-react';
import { openPositions, disciplines } from '../data/careers';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { PortalVisual } from '../components/visuals/IsoVisuals';

const principles = [
  { icon: GraduationCap, title: 'Keep learning', text: 'We share knowledge openly and make room to explore new tools and techniques.' },
  { icon: Handshake, title: 'Collaborate closely', text: 'Designers and developers work side by side, and everyone’s input matters.' },
  { icon: Compass, title: 'Own your work', text: 'We trust people to take responsibility, make decisions and see them through.' },
  { icon: Sparkles, title: 'Care about craft', text: 'We take pride in clean code, thoughtful design and the details users notice.' },
];

const disciplineIcons = [Code, Server, Layers, PenTool];

const steps = [
  { title: 'Introduce yourself', text: 'Send us a short message about who you are and the kind of work you enjoy.' },
  { title: 'Share your work', text: 'Include links to your portfolio, GitHub or CV so we can learn about your experience.' },
  { title: 'Start a conversation', text: 'When a suitable opportunity opens, we’ll reach out to talk about next steps.' },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumb="Careers"
        eyebrow="Careers"
        title="Build Your Future With Us."
        lead="We’re always interested in meeting talented, curious people who love building great digital products. Learn how we work and how to get in touch."
        actions={
          <Button to="/contact/?type=careers" icon={<ArrowRight size={18} />}>
            Express Your Interest
          </Button>
        }
        visual={<PortalVisual />}
      />

      <section className="section section--tight" aria-labelledby="culture-title">
        <div className="container">
          <SectionHeading
            id="culture-title"
            eyebrow="Culture"
            title="How we work together"
            lead="The working principles we aim to live by every day."
          />
          <div className="grid grid--4">
            {principles.map(({ icon: Icon, title, text }, i) => (
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

      <section className="section section--alt" aria-labelledby="positions-title">
        <div className="container">
          <SectionHeading id="positions-title" eyebrow="Open positions" title="Current opportunities" />
          {openPositions.length > 0 ? (
            <div className="grid grid--3">
              {openPositions.map((job, i) => (
                <Reveal key={job.id} delay={(i % 3) * 80}>
                  <article className="card card--interactive job-card" style={{ height: '100%' }}>
                    <h3>{job.title}</h3>
                    <p className="muted">
                      {job.type} · {job.location}
                    </p>
                    <p>{job.summary}</p>
                    <Button to="/contact/?type=careers" variant="outline" size="sm" icon={<ArrowRight size={15} />}>
                      Apply<span className="visually-hidden"> for {job.title}</span>
                    </Button>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="card empty-state">
              <span className="icon-wrap" aria-hidden="true">
                <Briefcase size={22} />
              </span>
              <div>
                <h3>No open positions right now</h3>
                <p>
                  We don’t have any vacancies listed at the moment, but we’re happy to hear from people who would like
                  to work with us in the future.
                </p>
              </div>
              <Button to="/contact/?type=careers" icon={<ArrowRight size={16} />}>
                Get in touch
              </Button>
            </Reveal>
          )}

          <div style={{ marginTop: 'var(--space-7)' }}>
            <Reveal>
              <h3 style={{ marginBottom: 'var(--space-5)' }}>Disciplines we work across</h3>
            </Reveal>
            <div className="grid grid--4">
              {disciplines.map((d, i) => {
                const Icon = disciplineIcons[i] ?? Code;
                return (
                  <Reveal key={d.title} delay={i * 80}>
                    <article className="card" style={{ height: '100%' }}>
                      <span className="icon-wrap" aria-hidden="true">
                        <Icon size={20} />
                      </span>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{d.title}</h4>
                      <p>{d.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="apply-title">
        <div className="container">
          <SectionHeading
            id="apply-title"
            eyebrow="How to apply"
            title="Getting in touch"
            lead="There’s no complicated process. Here’s how to introduce yourself."
          />
          <ol className="grid grid--3 steps">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80} className="card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Interested in working with us?"
        text="Tell us about yourself and the kind of work you’d love to do. We’ll keep your details in mind for future opportunities."
        primary={{ label: 'Express Your Interest', to: '/contact/?type=careers' }}
        secondary={{ label: 'About Us', to: '/about/' }}
      />
    </>
  );
}
