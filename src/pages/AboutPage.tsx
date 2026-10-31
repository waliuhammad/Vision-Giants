import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  Clock,
  Code,
  Cpu,
  ExternalLink,
  Eye,
  HeartHandshake,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
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
  const { about, services, clients: globalClients } = useContent();
  const visibility = about.visibility;
  const activeClients = (about.clientsList?.length ? about.clientsList : globalClients)
    .filter((c) => c.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      {/* 1. HERO SECTION */}
      {visibility.hero && (
        <section className="page-hero page-hero--about" aria-labelledby="about-hero-title">
          <div className="container page-hero__inner">
            <div className="page-hero__body">
              <Reveal>
                <div className="crumb-wrap">
                  <span className="crumb">{about.heroEyebrow}</span>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h1 id="about-hero-title">
                  <Highlight text={about.heroHeadline} />
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="lead">{about.heroDescription}</p>
              </Reveal>

              <Reveal delay={180}>
                <div className="page-hero__actions">
                  <Button to={about.heroCtaLink} icon={<ArrowRight size={18} />}>
                    {about.heroCtaText}
                  </Button>
                  <Button to="/services/" variant="outline">
                    Our Services
                  </Button>
                </div>
              </Reveal>
            </div>

            <div className="page-hero__visual" aria-hidden="true">
              {about.heroImage ? (
                <div className="about-hero__custom-image-wrap">
                  <img
                    src={about.heroImage}
                    alt={about.heroImageAlt || 'About Vision Giants'}
                    className="about-hero__custom-image"
                    loading="eager"
                  />
                </div>
              ) : (
                <CubeVisual />
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2. WHO WE ARE */}
      {visibility.whoWeAre && (
        <section className="section" aria-labelledby="who-title">
          <div className="container">
            <div className="grid grid--2 about-highlights-grid" style={{ alignItems: 'center', gap: 'var(--space-6)' }}>
              <div>
                <SectionHeading
                  id="who-title"
                  eyebrow={about.whoWeAreEyebrow}
                  title={about.whoWeAreHeading}
                />
                <p className="lead" style={{ marginBottom: 'var(--space-4)' }}>
                  {about.whoWeAreText}
                </p>
                {about.whoWeAreBullets && about.whoWeAreBullets.length > 0 && (
                  <ul className="about-bullets">
                    {about.whoWeAreBullets.map((bullet, i) => (
                      <li key={i} className="about-bullet-item">
                        <CheckCircle size={18} className="about-bullet-icon" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="about-who-card-col">
                <Reveal delay={100}>
                  <div className="card about-highlights-card">
                    <span className="icon-wrap" aria-hidden="true">
                      <Cpu size={24} />
                    </span>
                    <h3>Engineering High-Performance Solutions</h3>
                    <p>
                      We don’t believe in one-size-fits-all templates. Every architecture is tailored to handle high
                      traffic, scale smoothly, and maintain uncompromising responsiveness across mobile, tablet, and desktop devices.
                    </p>
                    <div className="about-metric-row">
                      <div className="about-metric">
                        <strong>99.9%</strong>
                        <span>Uptime Focused</span>
                      </div>
                      <div className="about-metric">
                        <strong>100%</strong>
                        <span>Transparent Agile</span>
                      </div>
                      <div className="about-metric">
                        <strong>Global</strong>
                        <span>Client Presence</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. OUR MISSION & VISION */}
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

      {/* 6b. TRUSTED BY OUR CLIENTS (Directly above Our Team) */}
      {visibility.clients && (
        <section className="section section--tight client-showcase-section" aria-labelledby="clients-title">
          <div className="container">
            <SectionHeading
              id="clients-title"
              eyebrow={about.clientsEyebrow || 'Our Clients'}
              title={about.clientsHeading || 'Trusted by Our Clients'}
              lead={about.clientsLead || 'Building lasting partnerships through technology, innovation, and exceptional digital solutions.'}
              align="center"
              aside={
                about.clientsCtaText ? (
                  <Button to={about.clientsCtaLink || '/contact/'} variant="outline" size="sm" icon={<ArrowRight size={15} />}>
                    {about.clientsCtaText}
                  </Button>
                ) : undefined
              }
            />

            {activeClients.length > 0 ? (
              <div className="client-grid">
                {activeClients.map((client, i) => (
                  <Reveal key={client.id || client.name} delay={(i % 5) * 60}>
                    <div className="client-card" title={`${client.name} — ${client.industry}`}>
                      <div className="client-card__logo-wrap">
                        {client.logo ? (
                          <img
                            src={client.logo}
                            alt={`${client.name} logo`}
                            className="client-card__logo"
                            loading="lazy"
                          />
                        ) : (
                          <span className="client-card__fallback-badge">
                            <Building2 size={24} aria-hidden="true" />
                            <span className="client-card__name-fallback">{client.name}</span>
                          </span>
                        )}
                      </div>
                      <div className="client-card__info">
                        <h4 className="client-card__title">{client.name}</h4>
                        <span className="client-card__industry">{client.industry}</span>
                        {client.description && (
                          <p className="client-card__desc">{client.description}</p>
                        )}
                        {client.websiteUrl && (
                          <a
                            href={client.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="client-card__link"
                            aria-label={`Visit ${client.name} website`}
                          >
                            <span>Visit website</span>
                            <ExternalLink size={13} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="card client-empty-state">
                <Building2 size={32} className="muted" aria-hidden="true" />
                <h3>Client Partnerships</h3>
                <p>
                  We partner with forward-thinking enterprises, fast-growing startups, and ambitious founders.
                </p>
                <Button to="/contact/" variant="outline" size="sm">
                  Become a Partner
                </Button>
              </div>
            )}
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
