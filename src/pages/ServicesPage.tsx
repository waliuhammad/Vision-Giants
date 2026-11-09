import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  Heart,
  Plus,
  ShieldCheck,
  Star,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useContent, usePageText, useServicesPage } from '../content/ContentContext';
import { getServiceIcon, getServiceImage } from '../data/services';
import { faqs } from '../data/faq';
import { Reveal } from '../components/animations/Reveal';
import { Highlight } from '../components/ui/Highlight';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CTASection } from '../components/ui/CTASection';

const whyIconMap: Record<string, LucideIcon> = {
  award: Award,
  star: Star,
  target: Target,
  'shield-check': ShieldCheck,
  shield: ShieldCheck,
  heart: Heart,
  users: Users,
  zap: Zap,
};

function getWhyIcon(name?: string): LucideIcon {
  if (!name) return Award;
  return whyIconMap[name.toLowerCase()] ?? Award;
}

export default function ServicesPage() {
  const t = usePageText('services');
  const { services } = useContent();
  const servicesPage = useServicesPage();
  const [showAllServices, setShowAllServices] = useState(false);

  const vis = servicesPage.visibility;

  // By default, display 8 cards (matching the 4x2 grid in the design), with an expand toggle for more
  const initialDisplayCount = 8;
  const hasMoreServices = services.length > initialDisplayCount;
  const displayedServices = showAllServices ? services : services.slice(0, initialDisplayCount);

  return (
    <div className="services-page-wrap">
      {/* 1. TOP HERO BANNER (WITH NOTCHED BREADCRUMB) */}
      {vis.hero && (
        <section className="services-hero-banner" aria-label="Services Header">
          <div
            className="services-hero-banner__inner"
            style={{
              backgroundImage: `url(${servicesPage.heroBackgroundImage})`,
            }}
          >
            <div className="services-hero-banner__overlay" />

            <div className="services-hero-banner__content">
              <Reveal>
                <h1 className="services-hero-banner__title">
                  {servicesPage.heroTitle || 'Services'}
                </h1>
              </Reveal>
            </div>

            {/* Bottom-right curved tab with breadcrumb */}
            <div className="services-hero-banner__notch" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="services-hero-banner__notch-sep">→</span>
              <span>{servicesPage.heroTitle || 'Services'}</span>
            </div>
          </div>
        </section>
      )}

      {/* 2. SECTION 1: WHAT WE DO */}
      {vis.whatWeDo && (
        <section className="services-intro-section" aria-labelledby="what-we-do-heading">
          <div className="container">
            <div className="services-intro-grid">
              {/* Left Column: Eyebrow + Large Bold Heading */}
              <div>
                <Reveal>
                  <span className="services-section-tag">
                    <span className="services-section-tag__dot" />
                    {servicesPage.whatWeDoBadge || 'What we do'}
                  </span>
                </Reveal>

                <Reveal delay={60}>
                  <h2 id="what-we-do-heading" className="services-intro__heading">
                    {servicesPage.whatWeDoHeading}
                  </h2>
                </Reveal>
              </div>

              {/* Right Column: Paragraphs + Key Focus Areas Checklist */}
              <div>
                <Reveal delay={100}>
                  <p className="services-intro__desc">
                    {servicesPage.whatWeDoDescription1}
                  </p>
                </Reveal>

                {servicesPage.whatWeDoDescription2 && (
                  <Reveal delay={140}>
                    <p className="services-intro__desc">
                      {servicesPage.whatWeDoDescription2}
                    </p>
                  </Reveal>
                )}

                {servicesPage.whatWeDoFocusPoints && servicesPage.whatWeDoFocusPoints.length > 0 && (
                  <div className="services-focus">
                    <Reveal delay={180}>
                      <h3 className="services-focus__title">
                        {servicesPage.whatWeDoFocusHeading || 'Key Areas We Focus On'}
                      </h3>
                    </Reveal>

                    <Reveal delay={220}>
                      <ul className="services-focus__grid">
                        {servicesPage.whatWeDoFocusPoints.map((point, index) => (
                          <li key={index} className="services-focus__item">
                            <span className="services-focus__check" aria-hidden="true">
                              <Check size={13} strokeWidth={3} />
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. SECTION 2: WHY CHOOSE US */}
      {vis.whyChooseUs && (
        <section className="services-why-section" aria-labelledby="why-choose-us-heading">
          <div className="container">
            <Reveal>
              <span className="services-section-tag">
                <span className="services-section-tag__dot" />
                {servicesPage.whyChooseUsBadge || 'Why Choose Us?'}
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h2 id="why-choose-us-heading" className="services-why__heading">
                {servicesPage.whyChooseUsHeading}
              </h2>
            </Reveal>

            <div className="services-why-grid">
              {/* Left Column: Strategic Transformation Image */}
              <Reveal delay={100}>
                <div className="services-why__image-wrap">
                  <img
                    src={servicesPage.whyChooseUsImage}
                    alt={servicesPage.whyChooseUsImageAlt || 'Transformation advisor'}
                    className="services-why__image"
                    loading="lazy"
                  />
                </div>
              </Reveal>

              {/* Right Column: 4 Benefit Cards */}
              <div className="services-why__cards">
                {servicesPage.whyChooseUsReasons.map((reason, idx) => {
                  const IconComponent = getWhyIcon(reason.icon);
                  return (
                    <Reveal key={reason.id || idx} delay={120 + idx * 50}>
                      <article className="services-why-card">
                        <div className="services-why-card__icon-wrap" aria-hidden="true">
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <h3 className="services-why-card__title">{reason.title}</h3>
                          <p className="services-why-card__desc">{reason.description}</p>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SECTION 3: SIGNATURE 4-COLUMN SERVICES GRID */}
      {vis.services && (
        <section className="services-catalog-section" aria-labelledby="our-services-heading">
          <div className="container">
            <div className="services-catalog__header">
              <Reveal>
                <span className="services-section-tag services-section-tag--center">
                  <span className="services-section-tag__dot" />
                  {servicesPage.servicesGridBadge || 'Our Services'}
                </span>
              </Reveal>

              <Reveal delay={60}>
                <h2 id="our-services-heading" className="services-catalog__title">
                  <Highlight text={servicesPage.servicesGridHeading} />
                </h2>
              </Reveal>

              {servicesPage.servicesGridLead && (
                <Reveal delay={100}>
                  <p className="services-catalog__lead">{servicesPage.servicesGridLead}</p>
                </Reveal>
              )}
            </div>

            {/* 4-Column Responsive Grid */}
            <div className="services-grid-new">
              {displayedServices.map((service, index) => {
                const Icon = getServiceIcon(service.icon);
                const image = getServiceImage(service);
                // Check if this card is highlighted (Card #2 accent style)
                const isFeatured =
                  service.isFeatured ||
                  service.id === servicesPage.featuredServiceId ||
                  (!servicesPage.featuredServiceId && index === 1);

                return (
                  <Reveal key={service.id} delay={60 + (index % 4) * 40}>
                    <Link
                      to={`/services/${service.id}`}
                      className={`service-card-new ${isFeatured ? 'service-card-new--featured' : ''}`}
                    >
                      <div className="service-card-new__top">
                        <h3 className="service-card-new__title">{service.title}</h3>
                        <span className="service-card-new__arrow" aria-hidden="true">
                          <ArrowUpRight size={17} />
                        </span>
                      </div>

                      <p className="service-card-new__desc">{service.short}</p>

                      <div className="service-card-new__media">
                        {image ? (
                          <img
                            src={image}
                            alt={service.title}
                            className="service-card-new__img"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              background: 'var(--color-surface-blue)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={36} style={{ opacity: 0.6 }} />
                          </div>
                        )}

                        <span className="service-card-new__badge" aria-hidden="true">
                          <Icon size={18} />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            {/* Show More / Show Fewer toggle if services catalog exceeds 8 */}
            {hasMoreServices && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAllServices(!showAllServices)}
                  className="btn btn--outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>{showAllServices ? 'Show Fewer' : 'Explore All Services'}</span>
                  <ChevronDown
                    size={17}
                    style={{
                      transform: showAllServices ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. FAQ SECTION */}
      {vis.faq && (
        <section className="section section--alt" aria-labelledby="faq-title">
          <div className="container">
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title="Frequently asked questions"
              align="center"
            />
            <div className="faq" style={{ maxWidth: '820px', margin: '2.5rem auto 0' }}>
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
      )}

      {/* 6. CALL TO ACTION SECTION */}
      {vis.cta && (
        <CTASection
          title={t('ctaTitle') || 'Ready to Accelerate Your Transformation?'}
          text={
            t('ctaText') ||
            'Share a few details about your vision and goals. Our certified team will craft a tailored execution roadmap.'
          }
        />
      )}
    </div>
  );
}
