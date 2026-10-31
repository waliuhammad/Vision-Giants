import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Code,
  Smartphone,
  Palette,
  Cloud,
  Cpu,
  Headphones,
  Zap,
  Users,
  Lightbulb,
  Layers,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
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
import {
  defaultHomePageHeroData,
  homePageHeroDataFromDoc,
  type HomePageHeroData,
} from '../content/homeHeroData';
import { getDb, isFirebaseConfigured } from '../config/firebase';

const firestore = () => import('firebase/firestore/lite');

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

function CapIcon({ name }: { name: string }) {
  switch (name) {
    case 'code':
      return <Code size={20} />;
    case 'zap':
      return <Zap size={20} />;
    case 'headset':
      return <Headphones size={20} />;
    case 'smartphone':
      return <Smartphone size={20} />;
    case 'palette':
      return <Palette size={20} />;
    case 'cloud':
      return <Cloud size={20} />;
    case 'cpu':
      return <Cpu size={20} />;
    default:
      return <CheckCircle2 size={20} />;
  }
}

function MenuIcon({ name }: { name: string }) {
  switch (name) {
    case 'code':
      return <Code size={18} />;
    case 'smartphone':
      return <Smartphone size={18} />;
    case 'palette':
      return <Palette size={18} />;
    case 'cloud':
      return <Cloud size={18} />;
    default:
      return <Code size={18} />;
  }
}

export default function HomePage() {
  const t = usePageText('home');
  const { services, projects } = useContent();
  const [active, setActive] = useState<Project | null>(null);
  const [featured, ...moreProjects] = projects;

  const [heroData, setHeroData] = useState<HomePageHeroData>(defaultHomePageHeroData);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', 'home-hero'));
        if (snap.exists()) {
          setHeroData(homePageHeroDataFromDoc(snap.data()));
        }
      } catch (err) {
        console.warn('Could not load custom home hero content; using defaults', err);
      }
    })();
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — EXACT MATCH TO REFERENCE IMAGE
         ═══════════════════════════════════════════════════════════════ */}
      <section className="hph-section" aria-labelledby="home-hero-title">
        {/* Background Image with Deep Blue Glow & Gradient */}
        <div
          className="hph-bg"
          style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
          aria-hidden="true"
        />
        <div className="hph-overlay" aria-hidden="true" />

        <div className="container hph-container">
          <div className="hph-grid">
            {/* Left Content Column */}
            <div className="hph-copy">
              <Reveal>
                <div className="hph-badge-pill">
                  <span>{heroData.badgeText}</span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 id="home-hero-title" className="hph-title">
                  {heroData.titleLine1}
                  <span className="hph-title-accent">{heroData.titleLine2}</span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="hph-lead">{heroData.lead}</p>
              </Reveal>

              <Reveal delay={200}>
                <div className="hph-actions">
                  <Link to={heroData.primaryCtaLink} className="hph-btn-primary">
                    <span>{heroData.primaryCtaText}</span>
                    <ArrowRight size={17} />
                  </Link>
                  <Link to={heroData.secondaryCtaLink} className="hph-btn-glass">
                    <span>{heroData.secondaryCtaText}</span>
                  </Link>
                </div>
              </Reveal>

              {/* 3 Pill Badges at bottom left */}
              <Reveal delay={260}>
                <div className="hph-capabilities">
                  {heroData.capabilities.map((cap) => (
                    <div key={cap.id} className="hph-cap-item">
                      <div className="hph-cap-icon-box">
                        <CapIcon name={cap.icon} />
                      </div>
                      <div className="hph-cap-text">
                        <strong>{cap.title}</strong>
                        {cap.subtitle && <span>{cap.subtitle}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right Column: Holographic Glass Cards & Developer Badge */}
            <div className="hph-visual">
              {/* Floating Holographic Services Menu */}
              <Reveal delay={120}>
                <div className="hph-holo-panel">
                  {heroData.menuItems.map((item, idx) => (
                    <div key={idx} className="hph-holo-row">
                      <div className="hph-holo-icon">
                        <MenuIcon name={item.icon} />
                      </div>
                      <span className="hph-holo-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* 50+ Expert Developers Badge */}
              <Reveal delay={220}>
                <div className="hph-expert-card">
                  <div className="hph-expert-icon">
                    <Users size={28} />
                  </div>
                  <div className="hph-expert-info">
                    <strong>{heroData.expertBadgeCount}</strong>
                    <span>{heroData.expertBadgeLabel}</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SERVICES SECTION
         ═══════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════
          SHOWCASE / PORTFOLIO
         ═══════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════
          WHY VISION GIANTS
         ═══════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════
          TECHNOLOGY STRIP
         ═══════════════════════════════════════════════════════════════ */}
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
