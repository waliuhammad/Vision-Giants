import { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  BarChart2,
  Briefcase,
  Clock,
  Code,
  Cpu,
  DollarSign,
  Gift,
  Globe,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Palette,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useContent } from '../content/ContentContext';
import { type Position } from '../data/careers';
import {
  defaultCareersPageData,
  careersPageDataFromDoc,
  type CareersPageData,
} from '../content/careersPageData';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/animations/Reveal';
import { ApplicationForm } from '../components/ui/ApplicationForm';
import { getDb, isFirebaseConfigured } from '../config/firebase';

const firestore = () => import('firebase/firestore/lite');

/* ── Why-card icon resolver ── */
function WhyIcon({ name }: { name: string }) {
  switch (name) {
    case 'trending': return <TrendingUp size={32} />;
    case 'users':    return <Users size={32} />;
    case 'lightbulb': return <Lightbulb size={32} />;
    case 'heart':    return <HeartHandshake size={32} />;
    case 'trophy':   return <Trophy size={32} />;
    default:         return <Star size={32} />;
  }
}

/* ── Perk icon resolver ── */
function PerkIcon({ name }: { name: string }) {
  switch (name) {
    case 'salary':   return <DollarSign size={28} />;
    case 'clock':    return <Clock size={28} />;
    case 'learning': return <GraduationCap size={28} />;
    case 'health':   return <Shield size={28} />;
    case 'outings':  return <Globe size={28} />;
    case 'bonus':    return <Gift size={28} />;
    default:         return <Star size={28} />;
  }
}

/* ── Job-card department icon ── */
function DeptIcon({ dept }: { dept: string }) {
  const d = dept?.toLowerCase() ?? '';
  if (d.includes('design')) return <Palette size={20} />;
  if (d.includes('mobile')) return <Smartphone size={20} />;
  if (d.includes('marketing')) return <BarChart2 size={20} />;
  if (d.includes('support')) return <HeartHandshake size={20} />;
  if (d.includes('cloud') || d.includes('devops')) return <Cpu size={20} />;
  return <Code size={20} />;
}

/* ── Dept accent colours (matches reference) ── */
const DEPT_COLORS: Record<string, string> = {
  engineering: '#2563eb',
  development: '#2563eb',
  mobile:      '#10b981',
  design:      '#f59e0b',
  marketing:   '#f97316',
  support:     '#ec4899',
  sales:       '#8b5cf6',
};
function deptColor(dept: string) {
  const key = dept?.toLowerCase() ?? '';
  for (const [k, v] of Object.entries(DEPT_COLORS)) {
    if (key.includes(k)) return v;
  }
  return '#2563eb';
}

/* ── Star rating helper ── */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="crp-stars">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
      ))}
    </div>
  );
}

export default function CareersPage() {
  const { positions: allPositions } = useContent();
  const openPositions = allPositions.filter((p) => p.published !== false);

  const [pageData, setPageData] = useState<CareersPageData>(defaultCareersPageData);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', 'careers'));
        if (snap.exists()) setPageData(careersPageDataFromDoc(snap.data()));
      } catch (err) {
        console.warn('Could not load careers page content; using defaults', err);
      }
    })();
  }, []);

  /* ── Filters ── */
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Position | null>(null);
  const [applyingJob, setApplyingJob] = useState<Position | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const departments = useMemo(() => {
    const list = Array.from(new Set(openPositions.map((p) => p.department).filter(Boolean)));
    return ['all', ...list];
  }, [openPositions]);

  const filteredPositions = useMemo(() => {
    if (deptFilter === 'all') return openPositions;
    return openPositions.filter((p) =>
      p.department?.toLowerCase().includes(deptFilter.toLowerCase())
    );
  }, [openPositions, deptFilter]);

  const testimonials = pageData.cultureTestimonials ?? pageData.testimonials ?? [];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO — dark navy bg, full-width image, left-aligned content
         ═══════════════════════════════════════════════════════════════ */}
      <section className="crp-hero">
        {/* Background image fills right half */}
        <div
          className="crp-hero__bg"
          style={{ backgroundImage: `url(${pageData.heroImage})` }}
          aria-hidden="true"
        />
        <div className="crp-hero__overlay" aria-hidden="true" />

        <div className="container crp-hero__inner">
          <Reveal>
            <div className="crp-hero__content">
              {/* Badge pill */}
              <span className="crp-hero__badge">{pageData.heroBadgeText}</span>

              {/* Title */}
              <h1 className="crp-hero__title">
                {pageData.heroTitleLine1}
                <br />
                <span className="crp-hero__title-accent">{pageData.heroTitleLine2}</span>
              </h1>

              {/* Description */}
              <p className="crp-hero__lead">{pageData.heroDescription}</p>

              {/* CTAs */}
              <div className="crp-hero__actions">
                <Button href={pageData.heroPrimaryCtaLink} icon={<ArrowRight size={17} />}>
                  {pageData.heroPrimaryCtaText}
                </Button>
                <a href={pageData.heroSecondaryCtaLink} className="crp-btn-outline">
                  {pageData.heroSecondaryCtaText}
                </a>
              </div>

              {/* Social proof */}
              <div className="crp-hero__proof">
                <div className="crp-avatar-stack">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" />
                  ))}
                </div>
                <div className="crp-hero__proof-text">
                  <span className="crp-hero__proof-count">{pageData.heroSocialProofCount}</span>
                  {' '}{pageData.heroSocialProofText}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. WHY WORK WITH US — white bg, center, 5 icon cards
         ═══════════════════════════════════════════════════════════════ */}
      <section className="crp-why-section">
        <div className="container">
          <div className="crp-section-head crp-section-head--center">
            <span className="crp-eyebrow">{pageData.whyEyebrow}</span>
            <h2 className="crp-why__heading">{pageData.whyHeading}</h2>
            <p className="crp-why__lead">{pageData.whyDescription}</p>
          </div>

          <div className="crp-why-cards">
            {pageData.whyCards.map((card, i) => (
              <Reveal key={card.id} delay={i * 60}>
                <div className="crp-why-card">
                  <div className="crp-why-card__icon">
                    <WhyIcon name={card.icon} />
                  </div>
                  <h4 className="crp-why-card__title">{card.title}</h4>
                  <p className="crp-why-card__desc">{card.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. OPEN POSITIONS — tab filters + 3-col job cards
         ═══════════════════════════════════════════════════════════════ */}
      <section className="crp-positions-section" id="open-positions">
        <div className="container">
          <div className="crp-section-head crp-section-head--center">
            <span className="crp-eyebrow">{pageData.positionsEyebrow}</span>
            <h2 className="crp-positions__heading">{pageData.positionsHeading}</h2>
            <p className="crp-positions__lead">{pageData.positionsLead}</p>
          </div>

          {/* Department filter tabs */}
          <div className="crp-dept-tabs">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                className={`crp-dept-tab${deptFilter === dept ? ' is-active' : ''}`}
                onClick={() => setDeptFilter(dept)}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          {/* 3-col grid of job cards */}
          {filteredPositions.length > 0 ? (
            <div className="crp-jobs-grid">
              {filteredPositions.map((job, idx) => {
                const color = deptColor(job.department);
                return (
                  <Reveal key={job.id} delay={(idx % 3) * 60}>
                    <div className="crp-job-card">
                      {/* Header icon + title */}
                      <div className="crp-job-card__head">
                        <div
                          className="crp-job-card__icon"
                          style={{ background: `${color}18`, color }}
                        >
                          <DeptIcon dept={job.department} />
                        </div>
                        <div>
                          <h4 className="crp-job-card__title">{job.title}</h4>
                          <div className="crp-job-card__meta">
                            <span>{job.department}</span>
                            <span className="crp-dot">·</span>
                            <span>{job.experience}</span>
                            <span className="crp-dot">·</span>
                            <span>{job.workArrangement}</span>
                          </div>
                        </div>
                      </div>

                      <p className="crp-job-card__summary">{job.summary}</p>

                      {job.location && (
                        <div className="crp-job-card__location">
                          <MapPin size={13} />
                          <span>{job.location}</span>
                        </div>
                      )}

                      <div className="crp-job-card__footer">
                        <button
                          type="button"
                          className="crp-apply-link"
                          style={{ color }}
                          onClick={() => setApplyingJob(job)}
                        >
                          Apply Now <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="crp-empty">
              <Briefcase size={36} />
              <h3>No matching positions</h3>
              <p>Try selecting a different department or check back later.</p>
              <button
                type="button"
                className="crp-btn-outline crp-btn-outline--dark"
                onClick={() => setDeptFilter('all')}
              >
                View All Openings
              </button>
            </div>
          )}

          {/* View all link */}
          {/* Removed "View All Openings" button as requested */}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. OUR CULTURE — 2×2 bento photos + testimonial carousel
         ═══════════════════════════════════════════════════════════════ */}
      <section className="crp-culture-section">
        <div className="container">
          <div className="crp-culture-grid">
            {/* Left: 2×2 bento photo grid */}
            <Reveal>
              <div className="crp-bento">
                {pageData.culturePhotos.map((src, i) => (
                  <div key={i} className="crp-bento__cell">
                    <img src={src} alt={`Culture photo ${i + 1}`} />
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right: text + testimonial */}
            <Reveal delay={100}>
              <div className="crp-culture-content">
                <span className="crp-eyebrow">{pageData.cultureEyebrow}</span>
                <h2 className="crp-culture__heading">{pageData.cultureHeading}</h2>
                <p className="crp-culture__desc">{pageData.cultureDescription}</p>

                {/* Testimonial card */}
                {testimonials.length > 0 && (
                  <div className="crp-testimonial-card">
                    <div className="crp-testimonial-card__quote-mark">"</div>
                    <p className="crp-testimonial-card__text">
                      {testimonials[testimonialIdx]?.quote}
                    </p>
                    <div className="crp-testimonial-card__author">
                      <img
                        src={testimonials[testimonialIdx]?.photo}
                        alt={testimonials[testimonialIdx]?.name}
                        className="crp-testimonial-card__avatar"
                      />
                      <div>
                        <strong className="crp-testimonial-card__name">
                          {testimonials[testimonialIdx]?.name}
                        </strong>
                        <span className="crp-testimonial-card__role">
                          {testimonials[testimonialIdx]?.role}
                        </span>
                      </div>
                      <Stars n={testimonials[testimonialIdx]?.rating ?? 5} />
                    </div>
                  </div>
                )}

                {/* Dot navigation */}
                {testimonials.length > 1 && (
                  <div className="crp-dot-nav">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`crp-dot-nav__dot${i === testimonialIdx ? ' is-active' : ''}`}
                        onClick={() => setTestimonialIdx(i)}
                        aria-label={`Testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. BENEFITS & PERKS — dark navy full-width ribbon
         ═══════════════════════════════════════════════════════════════ */}
      <section className="crp-perks-section">
        <div className="container">
          <div className="crp-perks-head">
            <span className="crp-eyebrow crp-eyebrow--light">{pageData.perksEyebrow}</span>
            <h2 className="crp-perks__heading">{pageData.perksHeading}</h2>
          </div>

          <div className="crp-perks-grid">
            {pageData.perksList.map((perk, i) => (
              <Reveal key={perk.id} delay={i * 50}>
                <div className="crp-perk-item">
                  <div className="crp-perk-item__icon">
                    <PerkIcon name={perk.icon} />
                  </div>
                  <span className="crp-perk-item__label">{perk.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. BOTTOM CTA — "Don't See the Right Fit?"
         ═══════════════════════════════════════════════════════════════ */}
      <section className="crp-cta-section" id="submit-cv">
        <div className="container">
          <div className="crp-cta-inner">
            <div className="crp-cta-text">
              <h2 className="crp-cta__heading">{pageData.ctaHeading}</h2>
              <p className="crp-cta__desc">{pageData.ctaDescription}</p>
            </div>
            <button
              type="button"
              className="crp-cta__btn"
              onClick={() => setApplyingJob({ id: 'open', title: 'Open Application' } as Position)}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              {pageData.ctaButtonText}
            </button>
            {/* Decorative CV illustration */}
            <div className="crp-cta__illustration" aria-hidden="true">
              <div className="crp-cv-card">
                <div className="crp-cv-card__line crp-cv-card__line--wide" />
                <div className="crp-cv-card__line" />
                <div className="crp-cv-card__line" />
                <div className="crp-cv-card__line crp-cv-card__line--short" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: JOB DETAILS
         ═══════════════════════════════════════════════════════════════ */}
      {selectedJob && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setSelectedJob(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-modal-card"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-head">
              <div>
                <span className="badge badge--neutral" style={{ marginBottom: 6 }}>
                  {selectedJob.department} · {selectedJob.type}
                </span>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{selectedJob.title}</h2>
                <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
                  {selectedJob.location} · {selectedJob.workArrangement} · {selectedJob.experience}
                </p>
              </div>
              <button type="button" className="btn-icon" onClick={() => setSelectedJob(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {selectedJob.description || selectedJob.summary}
              </p>
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: 6 }}>Key Responsibilities</h4>
                  <ul style={{ paddingLeft: 20, color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {selectedJob.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: 6 }}>Required Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedJob.skills.map((s) => (
                      <span key={s} className="badge badge--neutral">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
              <Button variant="primary" onClick={() => { const j = selectedJob; setSelectedJob(null); setApplyingJob(j); }}>
                Apply for this Position
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL: APPLICATION FORM
         ═══════════════════════════════════════════════════════════════ */}
      {applyingJob && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setApplyingJob(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-modal-card"
            style={{ maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-head">
              <div>
                <span className="badge badge--neutral" style={{ marginBottom: 4 }}>Job Application</span>
                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Apply: {applyingJob.title}</h2>
              </div>
              <button type="button" className="btn-icon" onClick={() => setApplyingJob(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              <ApplicationForm positions={applyingJob ? [applyingJob] : openPositions} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
