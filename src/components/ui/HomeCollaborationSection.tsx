import { ExternalLink, Rocket, Users, Target, Zap, Shield, Award, Handshake, Sparkles } from 'lucide-react';
import type { HomeCollaborationData, CollaborationPillar } from '../../content/homeCollaborationData';
import { Reveal } from '../animations/Reveal';

function PillarIcon({ icon }: { icon: CollaborationPillar['icon'] }) {
  switch (icon) {
    case 'rocket':
      return <Rocket size={22} className="collab-pillar__svg" />;
    case 'users':
      return <Users size={22} className="collab-pillar__svg" />;
    case 'target':
      return <Target size={22} className="collab-pillar__svg" />;
    case 'zap':
      return <Zap size={22} className="collab-pillar__svg" />;
    case 'shield':
      return <Shield size={22} className="collab-pillar__svg" />;
    case 'award':
      return <Award size={22} className="collab-pillar__svg" />;
    default:
      return <Rocket size={22} className="collab-pillar__svg" />;
  }
}

/** Default 3D geometric hexagon isometric logo matching TechNova reference */
function TechNovaLogoMark() {
  return (
    <div className="collab-default-logo">
      <svg viewBox="0 0 100 100" className="collab-default-logo__svg" aria-hidden="true">
        <defs>
          <linearGradient id="tn-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="tn-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        {/* Hexagonal prism loop */}
        <path
          d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
          fill="none"
          stroke="url(#tn-grad1)"
          strokeWidth="14"
          strokeLinejoin="round"
        />
        {/* Inner cubic core */}
        <polygon points="50,34 70,45 50,56 30,45" fill="#60a5fa" />
        <polygon points="30,45 50,56 50,78 30,67" fill="#2563eb" />
        <polygon points="50,56 70,45 70,67 50,78" fill="#1d4ed8" />
      </svg>
    </div>
  );
}

export function HomeCollaborationSection({ data }: { data: HomeCollaborationData }) {
  const {
    eyebrow,
    title,
    lead,
    badge,
    partnerName,
    partnerSubtitle,
    partnerLogo,
    description,
    pillars,
    buttonText,
    buttonUrl,
    footerQuote,
  } = data;

  return (
    <section className="collab-section" aria-labelledby="collab-title">
      <div className="container">
        {/* Section Header */}
        <div className="collab-header text-center">
          <Reveal delay={60}>
            <p className="collab-eyebrow">{eyebrow}</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 id="collab-title" className="collab-title">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="collab-lead">{lead}</p>
          </Reveal>
        </div>

        {/* Big Showcase Card */}
        <Reveal delay={240}>
          <div className="collab-card">
            {/* Left Brand Stage (with abstract tech mesh / waves background) */}
            <div className="collab-brand-side">
              {/* Decorative Mesh Background */}
              <div className="collab-mesh-bg" aria-hidden="true">
                <svg viewBox="0 0 400 400" className="collab-mesh-svg">
                  <defs>
                    <linearGradient id="mesh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(56, 189, 248, 0.25)" />
                      <stop offset="100%" stopColor="rgba(37, 99, 235, 0.05)" />
                    </linearGradient>
                  </defs>
                  {/* Subtle polygon constellation mesh */}
                  <circle cx="60" cy="280" r="3" fill="#38bdf8" opacity="0.6" />
                  <circle cx="120" cy="240" r="3" fill="#38bdf8" opacity="0.6" />
                  <circle cx="180" cy="290" r="3" fill="#38bdf8" opacity="0.6" />
                  <circle cx="80" cy="350" r="3" fill="#38bdf8" opacity="0.6" />
                  <circle cx="160" cy="360" r="3" fill="#38bdf8" opacity="0.6" />
                  <circle cx="230" cy="330" r="3" fill="#38bdf8" opacity="0.6" />
                  <circle cx="280" cy="370" r="3" fill="#38bdf8" opacity="0.6" />
                  <path
                    d="M60 280 L120 240 L180 290 L230 330 L280 370 M120 240 L80 350 L160 360 L180 290 M80 350 L60 280 M160 360 L230 330"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.28)"
                    strokeWidth="1.2"
                  />
                  {/* Smooth wavy ribbon curves */}
                  <path
                    d="M-40 180 C 80 120, 200 240, 420 160"
                    fill="none"
                    stroke="rgba(44, 67, 119, 0.12)"
                    strokeWidth="24"
                  />
                  <path
                    d="M-20 220 C 100 160, 220 280, 440 200"
                    fill="none"
                    stroke="rgba(56, 189, 248, 0.14)"
                    strokeWidth="32"
                  />
                </svg>
              </div>

              {/* Logo Presentation Square */}
              <div className="collab-logo-box">
                {partnerLogo ? (
                  <img src={partnerLogo} alt={partnerName} className="collab-custom-logo" />
                ) : (
                  <div className="collab-brand-identity">
                    <TechNovaLogoMark />
                    <div className="collab-brand-text">
                      <span className="collab-brand-name">TechNova</span>
                      <span className="collab-brand-sub">{partnerSubtitle || 'SOLUTIONS'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Central Floating Handshake Icon bridging the two sides */}
              <div className="collab-bridge-badge" title="Strategic Partnership" aria-hidden="true">
                <Handshake size={24} className="collab-bridge-icon" />
              </div>
            </div>

            {/* Right Information Side */}
            <div className="collab-info-side">
              {/* Partner Type Badge */}
              <div className="collab-pill-wrap">
                <span className="collab-pill">{badge}</span>
              </div>

              {/* Partner Name Heading */}
              <h3 className="collab-partner-heading">{partnerName}</h3>

              {/* Description */}
              <p className="collab-desc">{description}</p>

              {/* 3 Pillars Grid */}
              <div className="collab-pillars">
                {pillars.map((pillar) => (
                  <div key={pillar.id} className="collab-pillar">
                    <div className="collab-pillar__icon-box">
                      <PillarIcon icon={pillar.icon} />
                    </div>
                    <div className="collab-pillar__content">
                      <strong className="collab-pillar__title">{pillar.title}</strong>
                      <span className="collab-pillar__sub">{pillar.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Partner External Button */}
              {buttonText && buttonUrl && (
                <div className="collab-action">
                  <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="collab-btn-outline"
                  >
                    <span>{buttonText}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Footer Quote with sparkle */}
        {footerQuote && (
          <Reveal delay={300}>
            <div className="collab-footer-quote">
              <div className="collab-sparkle-wrap" aria-hidden="true">
                <Sparkles size={18} className="collab-sparkle-icon" />
              </div>
              <p className="collab-quote-text">{footerQuote}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
