import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Code,
  Cpu,
  HeartHandshake,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Star,
  Target,
  Eye,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { useContent } from '../content/ContentContext';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceCard } from '../components/ui/ServiceCard';
import { TeamCard } from '../components/ui/TeamCard';
import { Reveal } from '../components/animations/Reveal';
import { CubeVisual } from '../components/visuals/IsoVisuals';
import { Highlight } from '../components/ui/Highlight';

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  'shield-check': ShieldCheck,
  'check-circle': CheckCircle,
  users: Users,
  'heart-handshake': HeartHandshake,
  'trending-up': TrendingUp,
  code: Code,
  award: Award,
  cpu: Cpu,
  'message-square': MessageSquare,
  clock: Clock,
  wrench: Wrench,
  star: Star,
  target: Target,
  eye: Eye,
};

function getIcon(name?: string, fallback: LucideIcon = Star): LucideIcon {
  if (!name) return fallback;
  return iconMap[name.toLowerCase()] ?? fallback;
}

export default function AboutPage() {
  const { about, services } = useContent();
  const { visibility } = about;

  return (
    <>
      {/* 1. HERO SECTION */}
      {visibility.hero && (
        <section className="page-hero about-hero" aria-labelledby="about-hero-title">
          <div className="bg-grid" aria-hidden="true" />
          <div className="container">
            <nav className="breadcrumbs enter" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li aria-current="page">About</li>
              </ol>
            </nav>

            <div className="page-hero__grid">
              <div className="page-hero__copy enter">
                <p className="eyebrow">{about.heroEyebrow}</p>
                <h1 id="about-hero-title">
                  <Highlight text={about.heroHeadline} />
                </h1>
                <p className="lead">{about.heroDescription}</p>
                <div className="page-hero__actions">
                  <Button to={about.heroCtaLink} icon={<ArrowRight size={18} />}>
                    {about.heroCtaText}
                  </Button>
                  <Button to="/services/" variant="outline">
                    Explore Services
                  </Button>
                </div>
              </div>

              <div className="page-hero__visual enter" aria-hidden="true">
                {about.heroImage ? (
                  <div className="about-hero__custom-image-wrap">
                    <img
                      src={about.heroImage}
                      alt={about.heroImageAlt || 'Vision Giants team'}
                      className="about-hero__custom-image"
                    />
                  </div>
                ) : (
                  <CubeVisual />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. WHO WE ARE */}
      {visibility.whoWeAre && (
        <section className="section section--tight" aria-labelledby="who-title">
          <div className="container">
            <div className="intro-grid">
              <Reveal>
                <p className="eyebrow">{about.whoWeAreEyebrow}</p>
                <h2 id="who-title">
                  <Highlight text={about.whoWeAreHeading} />
                </h2>
                <div className="prose" style={{ marginTop: 'var(--space-4)' }}>
                  {about.whoWeAreText.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="card about-highlights-card">
                  <h3 className="about-highlights-card__title">How We Deliver Value</h3>
                  <ul className="about-highlights-list">
                    {(about.whoWeAreBullets || []).map((bullet, idx) => (
                      <li key={idx} className="about-highlights-list__item">
                        <span className="icon-wrap" aria-hidden="true">
                          <CheckCircle size={18} />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* 3. MISSION & VISION */}
      {visibility.missionVision && (
        <section className="section section--alt" aria-labelledby="mission-vision-title">
          <div className="container">
            <SectionHeading
              id="mission-vision-title"
              eyebrow="Purpose & Direction"
              title="Driven by Purpose, Guided by Vision"
              lead="Our compass for client success and sustainable engineering excellence."
              align="center"
            />
            <div className="grid grid--2 about-mission-grid">
              <Reveal delay={80}>
                <article className="card feature about-mission-card">
                  <span className="icon-wrap" aria-hidden="true">
                    <Target size={26} />
                  </span>
                  <div>
                    <h3 className="about-mission-card__heading">{about.missionHeading}</h3>
                    <p className="about-mission-card__text">{about.missionText}</p>
                  </div>
                </article>
              </Reveal>

              <Reveal delay={160}>
                <article className="card feature about-mission-card">
                  <span className="icon-wrap" aria-hidden="true">
                    <Eye size={26} />
                  </span>
                  <div>
                    <h3 className="about-mission-card__heading">{about.visionHeading}</h3>
                    <p className="about-mission-card__text">{about.visionText}</p>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* 4. OUR CORE VALUES */}
      {visibility.values && (
        <section className="section" aria-labelledby="values-title">
          <div className="container">
            <SectionHeading
              id="values-title"
              eyebrow={about.valuesEyebrow}
              title={about.valuesHeading}
              lead={about.valuesLead}
              align="center"
            />
            <div className="grid grid--3">
              {about.valuesList.map((val, i) => {
                const Icon = getIcon(val.icon, Star);
                return (
                  <Reveal key={val.id || val.title} delay={(i % 3) * 80}>
                    <article className="card card--interactive about-value-card" style={{ height: '100%' }}>
                      <span className="icon-wrap" aria-hidden="true">
                        <Icon size={22} />
                      </span>
                      <h3>{val.title}</h3>
                      <p>{val.description}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. OUR EXPERTISE */}
      {visibility.expertise && (
        <section className="section section--alt" aria-labelledby="expertise-title">
          <div className="container">
            <SectionHeading
              id="expertise-title"
              eyebrow={about.expertiseEyebrow}
              title={about.expertiseHeading}
              lead={about.expertiseLead}
              aside={
                <Button to="/services/" variant="outline" icon={<ArrowRight size={16} />}>
                  All Services
                </Button>
              }
            />
            <div className="grid grid--3">
              {services.slice(0, 6).map((service, i) => (
                <Reveal key={service.id} delay={(i % 3) * 80}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE US */}
      {visibility.whyChooseUs && (
        <section className="section" aria-labelledby="why-title">
          <div className="container">
            <SectionHeading
              id="why-title"
              eyebrow={about.whyEyebrow}
              title={about.whyHeading}
              lead={about.whyLead}
              align="center"
            />
            <div className="grid grid--3">
              {about.whyList.map((reason, i) => {
                const Icon = getIcon(reason.icon, CheckCircle);
                return (
                  <Reveal key={reason.id || reason.title} delay={(i % 3) * 80}>
                    <article className="card card--interactive about-why-card" style={{ height: '100%' }}>
                      <span className="icon-wrap" aria-hidden="true">
                        <Icon size={22} />
                      </span>
                      <h3>{reason.title}</h3>
                      <p>{reason.description}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. OUR TEAM */}
      {visibility.team && about.teamMembers.length > 0 && (
        <section className="section section--alt" aria-labelledby="team-title">
          <div className="container">
            <SectionHeading
              id="team-title"
              eyebrow={about.teamEyebrow}
              title={about.teamHeading}
              lead={about.teamLead}
              aside={
                <Button to="/team/" variant="outline" icon={<ArrowRight size={16} />}>
                  Meet Full Team
                </Button>
              }
            />
            <div className="grid grid--4">
              {about.teamMembers.slice(0, 8).map((member, i) => (
                <Reveal key={member.id || member.name} delay={(i % 4) * 80}>
                  <TeamCard member={member} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FINAL CALL TO ACTION */}
      {visibility.cta && (
        <section className="section section--tight" aria-labelledby="cta-title">
          <div className="container">
            <Reveal className="cta">
              <div>
                <h2 id="cta-title">
                  <Highlight text={about.ctaHeading} />
                </h2>
                <p>{about.ctaDescription}</p>
              </div>
              <div className="cta__actions">
                <Button to={about.ctaButtonLink} icon={<ArrowRight size={18} />}>
                  {about.ctaButtonText}
                </Button>
                <Button to="/services/" variant="outline">
                  Our Services
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
