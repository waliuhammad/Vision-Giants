import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Award, Eye, Target, Trophy, type LucideIcon } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import type { ProfileAward } from '../data/profile';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceCard } from '../components/ui/ServiceCard';
import { CTASection } from '../components/ui/CTASection';
import { Reveal } from '../components/animations/Reveal';
import { StackVisual } from '../components/visuals/IsoVisuals';

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;
const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Company profile: bio, key facts, who we are, what we do, certifications and honours. */
export default function PortfolioPage() {
  const { profile, services } = useContent();

  return (
    <>
      <section className="page-hero profile-hero" aria-labelledby="page-title">
        <div className="bg-grid" aria-hidden="true" />
        <div className="container">
          <div className="profile-hero__bio">
            <nav className="breadcrumbs enter" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li aria-current="page">Portfolio</li>
              </ol>
            </nav>
            <p className="eyebrow enter" style={delay(60)}>
              Company profile
            </p>
            <h1 id="page-title" className="visually-hidden">
              Company profile
            </h1>
            <p className="profile-hero__lead enter" style={delay(120)}>
              {profile.bio}
            </p>
          </div>

          <div className="page-hero__grid profile-hero__grid">
            <div className="enter" style={delay(200)}>
              <h2>{profile.introTitle}</h2>
              <p className="lead">{profile.introText}</p>
              {profile.facts.length > 0 && (
                <dl className="profile-facts">
                  {profile.facts.map((f) => (
                    <div key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="page-hero__actions">
                <Button to="/contact/" icon={<ArrowRight size={18} />}>
                  Work With Us
                </Button>
              </div>
            </div>
            <div className="page-hero__visual enter" style={delay(150)} aria-hidden="true">
              <StackVisual />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="who-title">
        <div className="container intro-grid">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2 id="who-title">Design and engineering under one roof</h2>
            <div className="prose" style={{ marginTop: 'var(--space-5)' }}>
              {paragraphs(profile.whoWeAre).map((p) => (
                <p key={p}>{p}</p>
              ))}
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
                  <p>{profile.mission}</p>
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
                  <p>{profile.vision}</p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="section" aria-labelledby="what-title">
          <div className="container">
            <SectionHeading
              id="what-title"
              eyebrow="What we do"
              title="Services we offer"
              lead={profile.whatWeDo}
              aside={
                <Button to="/services/" variant="outline" icon={<ArrowRight size={16} />}>
                  All services
                </Button>
              }
            />
            <div className="grid grid--3">
              {services.slice(0, 6).map((s, i) => (
                <Reveal key={s.id} delay={(i % 3) * 80}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <AwardsSection
        id="certifications"
        eyebrow="Certifications"
        title="Certified to deliver"
        items={profile.certifications}
        icon={Award}
        alt
      />
      <AwardsSection id="honours" eyebrow="Honours" title="Awards & recognition" items={profile.honours} icon={Trophy} />

      <CTASection
        title="Let’s build something meaningful together."
        text="Tell us about your idea and we’ll help you plan how to bring it to life."
        secondary={{ label: 'View Services', to: '/services/' }}
      />
    </>
  );
}

function AwardsSection({
  id,
  eyebrow,
  title,
  items,
  icon: Icon,
  alt,
}: {
  id: string;
  eyebrow: string;
  title: string;
  items: ProfileAward[];
  icon: LucideIcon;
  alt?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section className={`section${alt ? ' section--alt' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} align="center" />
        <div className="grid grid--3">
          {items.map((a, i) => (
            <Reveal key={`${a.title}-${i}`} delay={(i % 3) * 80}>
              <article className="card award-card">
                <span className="icon-wrap" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <div>
                  <h3>{a.title}</h3>
                  <p>{[a.issuer, a.year].filter(Boolean).join(' · ')}</p>
                  {a.placeholder && <span className="badge badge--neutral">Placeholder</span>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
