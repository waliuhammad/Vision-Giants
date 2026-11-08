import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  Compass,
} from 'lucide-react';
import { useContent } from '../content/ContentContext';
import { ApplicationForm } from '../components/ui/ApplicationForm';
import { Reveal } from '../components/animations/Reveal';

export default function ApplyPage() {
  const { positions } = useContent();
  const [searchParams] = useSearchParams();
  const initialPositionParam = searchParams.get('position') || '';

  const [activePositionId, setActivePositionId] = useState<string>(initialPositionParam);

  useEffect(() => {
    if (initialPositionParam) {
      setActivePositionId(initialPositionParam);
    }
  }, [initialPositionParam]);

  const activePosition = useMemo(() => {
    if (!activePositionId || activePositionId === 'general') return null;
    return positions.find((p) => p.id === activePositionId) || null;
  }, [activePositionId, positions]);

  return (
    <div className="apply-page-wrapper">
      {/* ═══════════════════════════════════════════════════════════════
          NAVY BLUE HERO SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="hero hero--navy apply-hero" aria-labelledby="apply-page-title">
        <div className="hero__ambient" aria-hidden="true" />
        <div className="bg-grid hero__grid-pattern" aria-hidden="true" />
        <div className="container apply-hero__container">
          <Reveal>
            <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-3)' }}>
              <ol>
                <li>
                  <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Home</Link>
                </li>
                <li>
                  <Link to="/careers/" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Careers</Link>
                </li>
                <li aria-current="page" style={{ color: '#fff' }}>Apply</li>
              </ol>
            </nav>

            <Link to="/careers/" className="apply-back-link">
              <ArrowLeft size={16} />
              <span>Back to all open positions</span>
            </Link>

            <div className="apply-hero__content">
              <div className="badge badge--pill apply-hero__badge">
                <Sparkles size={13} />
                <span>Join Our Engineering & Product Team</span>
              </div>
              <h1 id="apply-page-title" className="apply-hero__title">
                {activePosition ? (
                  <>
                    Apply for <span className="highlight-text">{activePosition.title}</span>
                  </>
                ) : (
                  <>
                    Submit Your <span className="highlight-text">Job Application</span>
                  </>
                )}
              </h1>
              <p className="apply-hero__lead">
                {activePosition ? (
                  <>
                    Take the next step in your engineering journey. Complete the form below, upload your CV, and let’s build scalable digital solutions together.
                  </>
                ) : (
                  <>
                    We are always seeking talented engineers, designers, and innovators. Apply for an active role or send a general application, and our recruiting committee will review your profile.
                  </>
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN APPLICATION LAYOUT: SIDEBAR + FORM
         ═══════════════════════════════════════════════════════════════ */}
      <section className="section apply-main-section" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="apply-layout">
            {/* Left Sidebar */}
            <aside className="apply-sidebar">
              {activePosition ? (
                <div className="card apply-sidebar-card apply-sidebar-card--featured enter">
                  <div className="apply-role-badge">
                    <Briefcase size={14} />
                    <span>Selected Role</span>
                  </div>
                  <h3 className="apply-role-title">{activePosition.title}</h3>
                  <div className="apply-role-meta">
                    <span className="apply-meta-item">
                      <Clock size={14} />
                      {activePosition.type || 'Full-time'}
                    </span>
                    <span className="apply-meta-item">
                      <MapPin size={14} />
                      {activePosition.location || 'Hybrid / On-site'}
                    </span>
                    {activePosition.department && (
                      <span className="apply-meta-item badge badge--neutral" style={{ textTransform: 'capitalize' }}>
                        {activePosition.department}
                      </span>
                    )}
                  </div>

                  {(activePosition.description || activePosition.summary) && (
                    <p className="apply-role-desc">
                      {activePosition.summary || activePosition.description}
                    </p>
                  )}

                  {activePosition.skills && activePosition.skills.length > 0 && (
                    <div className="apply-skills-wrap">
                      <span className="apply-skills-title">Desired Tech Stack</span>
                      <div className="apply-skills-tags">
                        {activePosition.skills.map((s) => (
                          <span key={s} className="badge badge--subtle">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card apply-sidebar-card enter">
                  <div className="apply-role-badge">
                    <Compass size={14} />
                    <span>General Application</span>
                  </div>
                  <h3 className="apply-role-title">Build Your Future With Us</h3>
                  <p className="apply-role-desc">
                    Don’t see your exact role listed? Tell us about your specialized skillset. We actively hire senior full-stack developers, AI/ML engineers, mobile app developers, and UI/UX designers as new projects scale.
                  </p>
                </div>
              )}

              {/* Hiring Process Card */}
              <div className="card apply-sidebar-card enter" style={{ marginTop: 'var(--space-5)' }}>
                <h4 className="apply-sidebar-heading">
                  <Zap size={16} className="accent-icon" />
                  Our Hiring Process
                </h4>
                <ol className="apply-process-steps">
                  <li>
                    <div className="step-num">1</div>
                    <div className="step-body">
                      <strong>Application Review</strong>
                      <span>We examine your portfolio, GitHub, and CV within 3-5 business days.</span>
                    </div>
                  </li>
                  <li>
                    <div className="step-num">2</div>
                    <div className="step-body">
                      <strong>Technical Interview</strong>
                      <span>A friendly conversation about real-world architectural challenges and your experience.</span>
                    </div>
                  </li>
                  <li>
                    <div className="step-num">3</div>
                    <div className="step-body">
                      <strong>Culture & Alignment</strong>
                      <span>Meet the engineering leads and understand team dynamics and company values.</span>
                    </div>
                  </li>
                  <li>
                    <div className="step-num">4</div>
                    <div className="step-body">
                      <strong>Formal Offer</strong>
                      <span>Competitive compensation package, equipment setup, and swift onboarding.</span>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Perks Highlights */}
              <div className="card apply-sidebar-card enter" style={{ marginTop: 'var(--space-5)' }}>
                <h4 className="apply-sidebar-heading">
                  <ShieldCheck size={16} className="accent-icon" />
                  Why Vision Giants?
                </h4>
                <ul className="apply-perks-list">
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Top-tier market competitive salary & performance bonuses</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Cutting-edge stack: React, Node, Cloud, AI & Flutter</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Generous health insurance, paid leaves, and annual retreats</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Collaborative culture with zero micromanagement</span>
                  </li>
                </ul>
              </div>

              {/* Need Help Card */}
              <div className="apply-help-box enter" style={{ marginTop: 'var(--space-5)' }}>
                <Users size={18} />
                <div>
                  <span className="apply-help-label">Have questions before applying?</span>
                  <p className="apply-help-text">
                    Reach our talent acquisition team directly at{' '}
                    <a href="mailto:careers@visiongiants.com">careers@visiongiants.com</a>
                  </p>
                </div>
              </div>
            </aside>

            {/* Right Main Form Area */}
            <main className="apply-main-content">
              <ApplicationForm
                positions={positions}
                initialPositionId={activePositionId}
                onPositionChange={(posId) => setActivePositionId(posId)}
              />
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
