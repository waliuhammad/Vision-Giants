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
// CubeVisual replaced with real team photo — import removed
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
          <div className="container page-hero__grid page-hero__inner">
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
                <div className="about-hero__custom-image-wrap">
                  <img
                    src="/images/about/hero.jpg"
                    alt="Vision Giants team collaborating in a modern office"
                    className="about-hero__custom-image"
                    loading="eager"
                    width={560}
                    height={420}
                  />
                  <div className="about-hero__badge">
                    <span className="about-hero__badge-dot" aria-hidden="true" />
                    <span>Team of Experts</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      {/* CEO MESSAGE */}
      <section className="section section--tight ceo-message-section" aria-labelledby="ceo-message-title">
        <div className="container">
          <div className="ceo-message-card">
            <div className="ceo-message__photo-wrap">
              <img
                src="/images/team/jalal-khan.jpg"
                alt="Jalal Khan – Founder & CEO, Vision Giants"
                className="ceo-message__photo"
                loading="lazy"
                width={220}
                height={220}
              />
            </div>
            <div className="ceo-message__body">
              <span className="eyebrow">CEO Message</span>
              <blockquote className="ceo-message__quote" id="ceo-message-title">
                "At Vision Giants, we believe that technology should do more than impress — it should solve
                real problems, open new opportunities, and create lasting value for every business we serve.
                Our team of engineers, designers, and innovators is committed to building digital products
                that don't just meet expectations, but exceed them. Thank you for trusting us with your vision."
              </blockquote>
              <div className="ceo-message__attribution">
                <strong className="ceo-message__name">Jalal Khan</strong>
                <span className="ceo-message__title">Founder &amp; CEO, Vision Giants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            {(() => {
              const ceo = about.teamMembers.find((m) => m.id === 'jalal-khan') || about.teamMembers[0];
              const others = about.teamMembers.filter((m) => m.id !== ceo.id).slice(0, 8);
              return (
                <>
                  {ceo && (
                    <div className="team-leader-wrap">
                      <Reveal delay={50}>
                        <div className="team-leader-card">
                          <TeamCard member={ceo} />
                        </div>
                      </Reveal>
                    </div>
                  )}
                  <div className="grid grid--4 team-members-grid--secondary">
                    {others.map((member, i) => (
                      <Reveal key={member.id || member.name} delay={(i % 4) * 80}>
                        <div className="team-member-compact-card">
                          <TeamCard member={member} />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </>
              );
            })()}
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
