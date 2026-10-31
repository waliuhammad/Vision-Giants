import { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  Cloud,
  Code,
  Cpu,
  Globe,
  MapPin,
  Palette,
  Play,
  Search,
  Send,
  Smartphone,
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
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/animations/Reveal';
import { ApplicationForm } from '../components/ui/ApplicationForm';
import { getDb, isFirebaseConfigured } from '../config/firebase';

const firestore = () => import('firebase/firestore/lite');

export default function CareersPage() {
  const { positions: allPositions } = useContent();
  const openPositions = allPositions.filter((p) => p.published !== false);

  // Dynamic Careers Page content (loaded from Firestore pages/careers or default)
  const [pageData, setPageData] = useState<CareersPageData>(defaultCareersPageData);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', 'careers'));
        if (snap.exists()) {
          setPageData(careersPageDataFromDoc(snap.data()));
        }
      } catch (err) {
        console.warn('Could not load custom careers page content; using defaults', err);
      }
    })();
  }, []);

  // Filters state
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [arrangementFilter, setArrangementFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  // Selected job for detailed view modal
  const [selectedJob, setSelectedJob] = useState<Position | null>(null);
  // Job currently applying for in modal
  const [applyingJob, setApplyingJob] = useState<Position | null>(null);

  // Derive unique filter options
  const departments = useMemo(() => {
    const list = Array.from(new Set(openPositions.map((p) => p.department).filter(Boolean)));
    return ['all', ...list];
  }, [openPositions]);

  const types = useMemo(() => {
    const list = Array.from(new Set(openPositions.map((p) => p.type).filter(Boolean)));
    return ['all', ...list];
  }, [openPositions]);

  const arrangements = useMemo(() => {
    const list = Array.from(new Set(openPositions.map((p) => p.workArrangement).filter(Boolean)));
    return ['all', ...list];
  }, [openPositions]);

  const experiences = useMemo(() => {
    const list = Array.from(new Set(openPositions.map((p) => p.experience).filter(Boolean)));
    return ['all', ...list];
  }, [openPositions]);

  // Filtered positions list
  const filteredPositions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return openPositions.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        (p.skills && p.skills.some((s) => s.toLowerCase().includes(q)));
      const matchesDept = departmentFilter === 'all' || p.department.toLowerCase().includes(departmentFilter.toLowerCase());
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      const matchesArrangement = arrangementFilter === 'all' || p.workArrangement === arrangementFilter;
      const matchesExp = experienceFilter === 'all' || p.experience === experienceFilter;
      return matchesSearch && matchesDept && matchesType && matchesArrangement && matchesExp;
    });
  }, [openPositions, search, departmentFilter, typeFilter, arrangementFilter, experienceFilter]);

  // Handle track card click to filter positions
  const handleTrackClick = (trackId: string) => {
    if (trackId === 'web') setDepartmentFilter('Engineering');
    else if (trackId === 'mobile') setDepartmentFilter('Mobile');
    else if (trackId === 'design') setDepartmentFilter('Design');
    else if (trackId === 'cloud') setDepartmentFilter('Engineering');
    else if (trackId === 'ai') setDepartmentFilter('Engineering');
    else setDepartmentFilter('all');

    const el = document.getElementById('open-positions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Track icons helper
  const renderTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code size={24} />;
      case 'smartphone':
        return <Smartphone size={24} />;
      case 'palette':
        return <Palette size={24} />;
      case 'cloud':
        return <Cloud size={24} />;
      case 'cpu':
        return <Cpu size={24} />;
      default:
        return <Code size={24} />;
    }
  };

  // Stats ribbon icon helper
  const renderStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <Users size={32} />;
      case 'trophy':
        return <Award size={32} />;
      case 'briefcase':
        return <Briefcase size={32} />;
      case 'globe':
        return <Globe size={32} />;
      default:
        return <Users size={32} />;
    }
  };

  return (
    <>
      {/* 1. HERO SECTION (MATCHING REFERENCE PICTURE) */}
      <section className="careers-hero-section">
        <div className="container">
          <div className="careers-hero-grid">
            <Reveal>
              <div className="careers-hero-content">
                <span className="careers-dash-eyebrow">{pageData.heroEyebrow}</span>
                <h1 className="careers-hero-title">
                  {pageData.heroTitleLine1}
                  <span>{pageData.heroTitleLine2}</span>
                </h1>
                <p className="careers-hero-lead">{pageData.heroDescription}</p>

                <div className="careers-hero-actions">
                  <Button href={pageData.heroPrimaryCtaLink} icon={<ArrowRight size={18} />}>
                    {pageData.heroPrimaryCtaText}
                  </Button>
                  <a href={pageData.heroSecondaryCtaLink} className="btn--watch">
                    <Play size={16} fill="currentColor" />
                    <span>{pageData.heroSecondaryCtaText}</span>
                  </a>
                </div>

                <div className="careers-social-proof">
                  <div className="careers-avatar-stack">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Team Engineer"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Team Engineer"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                      alt="Team Engineer"
                    />
                  </div>
                  <span className="careers-social-proof__text">
                    Join {pageData.heroSocialProofCount} {pageData.heroSocialProofText}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="careers-hero-image-wrap">
                <img
                  src={pageData.heroImage}
                  alt="Engineering Career at Vision Giants"
                  className="careers-hero-portrait"
                />
                <div className="careers-floating-badge">
                  <span className="careers-floating-badge__number">
                    {pageData.heroExperienceBadgeYears}
                  </span>
                  <span className="careers-floating-badge__label">
                    <Award size={14} className="careers-floating-badge__icon" />
                    {pageData.heroExperienceBadgeText}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. STATS RIBBON (NAVY BLUE FULL WIDTH) */}
      <section className="careers-stats-ribbon">
        <div className="container">
          <div className="careers-stats-grid">
            {pageData.stats.map((stat, idx) => (
              <div key={idx} className="careers-stat-item">
                <div className="careers-stat-item__icon">{renderStatIcon(stat.icon)}</div>
                <div className="careers-stat-item__content">
                  <span className="careers-stat-item__value">{stat.value}</span>
                  <span className="careers-stat-item__label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAREER TRACKS (TOP OPPORTUNITIES) */}
      <section className="careers-tracks-section">
        <div className="container">
          <div className="careers-section-head">
            <div>
              <span className="careers-dash-eyebrow">{pageData.tracksEyebrow}</span>
              <h2 className="careers-section-head__title">{pageData.tracksHeading}</h2>
            </div>
            <a href="#open-positions" className="careers-section-head__link">
              <span>View All Openings</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="careers-tracks-grid">
            {pageData.tracks.map((track, i) => (
              <Reveal key={track.id} delay={i * 60}>
                <div
                  className="careers-track-card"
                  onClick={() => handleTrackClick(track.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrackClick(track.id)}
                >
                  <div
                    className="careers-track-card__icon-wrap"
                    style={{
                      backgroundColor: `${track.accentColor}18`,
                      color: track.accentColor,
                    }}
                  >
                    {renderTrackIcon(track.icon)}
                  </div>
                  <h4 className="careers-track-card__title">{track.title}</h4>
                  <p className="careers-track-card__desc">{track.description}</p>
                  <span className="careers-track-card__link">
                    <span>Learn More</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US / WE BUILD FUTURES (SPLIT SECTION) */}
      <section className="careers-why-section" id="why-us">
        <div className="container">
          <div className="careers-why-grid">
            <Reveal>
              <div className="careers-why-image-wrap">
                <img
                  src={pageData.whyImage}
                  alt="Team collaboration at Vision Giants"
                  className="careers-why-image"
                />
                <div className="careers-why-badge">
                  <span>{pageData.whyBadge}</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="careers-why-content">
                <span className="careers-dash-eyebrow">{pageData.whyEyebrow}</span>
                <h2 className="careers-why-title">{pageData.whyHeading}</h2>
                <p className="careers-why-desc">{pageData.whyDescription}</p>

                <ul className="careers-checklist">
                  {pageData.whyChecklist.map((item, idx) => (
                    <li key={idx} className="careers-checklist__item">
                      <CheckCircle2 size={18} className="careers-checklist__icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button href={pageData.whyCtaLink} variant="primary">
                  {pageData.whyCtaText}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. OPEN POSITIONS SECTION (WITH FILTERS & DIRECT APPLICATION) */}
      <section className="section section--alt" id="open-positions" aria-labelledby="jobs-heading">
        <div className="container">
          <SectionHeading
            id="jobs-heading"
            eyebrow={pageData.positionsEyebrow}
            title={pageData.positionsHeading}
            lead={pageData.positionsLead}
            align="center"
          />

          {/* Search & Filters */}
          <div className="course-search-card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="course-search-input-wrap">
              <Search size={18} className="course-search-icon" aria-hidden="true" />
              <input
                type="text"
                className="course-search-input"
                placeholder="Search job title, technical skills (e.g. React, Flutter, Node.js)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="course-search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="course-filter-pills" style={{ marginTop: 'var(--space-3)' }}>
              <span className="course-filter-label">Department:</span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  className={`course-filter-pill ${departmentFilter === dept ? 'is-active' : ''}`}
                  onClick={() => setDepartmentFilter(dept)}
                >
                  {dept === 'all' ? 'All Roles' : dept}
                </button>
              ))}
            </div>

            <div className="course-filter-pills" style={{ marginTop: 'var(--space-2)' }}>
              <span className="course-filter-label">Work Mode:</span>
              {arrangements.map((arr) => (
                <button
                  key={arr}
                  type="button"
                  className={`course-filter-pill ${arrangementFilter === arr ? 'is-active' : ''}`}
                  onClick={() => setArrangementFilter(arr)}
                >
                  {arr === 'all' ? 'All Arrangements' : arr}
                </button>
              ))}

              <span className="course-filter-label" style={{ marginLeft: 'var(--space-3)' }}>
                Employment:
              </span>
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`course-filter-pill ${typeFilter === t ? 'is-active' : ''}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t === 'all' ? 'All Types' : t}
                </button>
              ))}

              {experiences.length > 2 && (
                <>
                  <span className="course-filter-label" style={{ marginLeft: 'var(--space-3)' }}>
                    Level:
                  </span>
                  {experiences.map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      className={`course-filter-pill ${experienceFilter === exp ? 'is-active' : ''}`}
                      onClick={() => setExperienceFilter(exp)}
                    >
                      {exp === 'all' ? 'All Levels' : exp}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="grid grid--2">
            {filteredPositions.map((job, idx) => (
              <Reveal key={job.id} delay={(idx % 2) * 80}>
                <div
                  className="card card--interactive course-job-card"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span className="badge badge--neutral">{job.department}</span>
                      <span className="muted" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {job.location} ({job.workArrangement})
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{job.title}</h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem', marginBottom: '14px', lineHeight: 1.55 }}>
                      {job.summary}
                    </p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="course-job-card__skills" style={{ marginBottom: '16px' }}>
                        {job.skills.slice(0, 4).map((s) => (
                          <span key={s} className="badge badge--neutral">
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="badge badge--neutral">+{job.skills.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="muted" style={{ fontSize: '0.85rem' }}>
                      <Clock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
                      {job.type}
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                        View Details
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => setApplyingJob(job)}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filteredPositions.length === 0 && (
            <div className="admin-table-empty card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Briefcase size={36} style={{ color: 'var(--color-muted)', margin: '0 auto 12px' }} />
              <h3>No matching positions found</h3>
              <p className="muted" style={{ marginBottom: '16px' }}>
                Try adjusting your search query or reset the filters to see all available vacancies.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setDepartmentFilter('all');
                  setTypeFilter('all');
                  setArrangementFilter('all');
                  setExperienceFilter('all');
                }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 6. TEAM TESTIMONIALS (STUDENT & TEAM STORIES) */}
      <section className="careers-testimonials-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <span className="careers-dash-eyebrow">{pageData.testimonialsEyebrow}</span>
            <h2 className="careers-section-head__title" style={{ textAlign: 'center' }}>
              {pageData.testimonialsHeading}
            </h2>
          </div>

          <div className="careers-testimonials-grid">
            {pageData.testimonials.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 80}>
                <article className="careers-testimonial-card">
                  <img src={item.photo} alt={item.name} className="careers-testimonial-card__avatar" />
                  <div className="careers-testimonial-card__content">
                    <p className="careers-testimonial-card__quote">“{item.quote}”</p>
                    <strong className="careers-testimonial-card__name">{item.name}</strong>
                    <span className="careers-testimonial-card__role">{item.role}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER (MATCHING REFERENCE PICTURE) */}
      <section className="careers-cta-ribbon-section">
        <div className="container">
          <div className="careers-cta-ribbon">
            <div className="careers-cta-ribbon__left">
              <div className="careers-cta-ribbon__icon-wrap">
                <Send size={26} />
              </div>
              <div>
                <h3 className="careers-cta-ribbon__title">{pageData.ctaHeading}</h3>
                <p className="careers-cta-ribbon__desc">{pageData.ctaDescription}</p>
              </div>
            </div>

            <a href={pageData.ctaButtonLink} className="btn--amber">
              <span>{pageData.ctaButtonText}</span>
            </a>
          </div>
        </div>
      </section>

      {/* MODAL: JOB DETAILS */}
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
              <button
                type="button"
                className="btn-icon"
                onClick={() => setSelectedJob(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>About The Role</h4>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {selectedJob.description || selectedJob.summary}
                </p>
              </div>

              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>Key Responsibilities</h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>Required Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedJob.skills.map((s) => (
                      <span key={s} className="badge badge--neutral">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>Qualifications</h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {selectedJob.qualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.salaryRange && (
                <div style={{ marginBottom: '16px', background: 'var(--color-surface-2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', display: 'block' }}>
                    COMPENSATION
                  </span>
                  <strong style={{ color: 'var(--color-navy)' }}>{selectedJob.salaryRange}</strong>
                </div>
              )}
            </div>

            <div className="admin-modal-foot" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const job = selectedJob;
                  setSelectedJob(null);
                  setApplyingJob(job);
                }}
              >
                Apply for this Position
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DIRECT APPLICATION FORM */}
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
                <span className="badge badge--neutral" style={{ marginBottom: 4 }}>
                  Job Application
                </span>
                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Apply: {applyingJob.title}</h2>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setApplyingJob(null)}
                aria-label="Close"
              >
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
