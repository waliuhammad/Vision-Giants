import { useState, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cloud,
  Code,
  Palette,
  Play,
  Search,
  Sparkles,
  Smartphone,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { Link } from 'react-router';
import { useContent } from '../content/ContentContext';
import type { Course, LearningMode } from '../data/courses';
import {
  defaultCoursesPageData,
  coursesPageDataFromDoc,
  type CoursesPageData,
  type CourseTopProgram,
} from '../content/coursesPageData';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/animations/Reveal';
import { EnrollmentDialog } from '../components/courses/EnrollmentDialog';
import { getDb, isFirebaseConfigured } from '../config/firebase';

const firestore = () => import('firebase/firestore/lite');

export default function CoursesPage() {
  const { courses: allCourses, categories } = useContent();
  const publishedCourses = allCourses.filter((c) => c.published !== false);

  // Dynamic Courses Page content (loaded from Firestore pages/courses or default)
  const [pageData, setPageData] = useState<CoursesPageData>(defaultCoursesPageData);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', 'courses'));
        if (snap.exists()) {
          setPageData(coursesPageDataFromDoc(snap.data()));
        }
      } catch (err) {
        console.warn('Could not load custom courses page content; using defaults', err);
      }
    })();
  }, []);

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedMode, setSelectedMode] = useState<LearningMode | 'all'>('all');

  // Enrollment modal state
  const [enrollModalCourse, setEnrollModalCourse] = useState<Course | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollInitialMode, setEnrollInitialMode] = useState<LearningMode | undefined>();

  // Filtered courses
  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return publishedCourses.filter((course) => {
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.introduction.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.prerequisites.some((p) => p.toLowerCase().includes(q)) ||
        course.learningOutcomes.some((o) => o.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'all' ||
        course.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLevel =
        selectedLevel === 'all' ||
        course.skillLevel.toLowerCase() === selectedLevel.toLowerCase();

      const matchesMode =
        selectedMode === 'all' ||
        (selectedMode === 'online' && course.modes.online.enabled) ||
        (selectedMode === 'onsite' && course.modes.onsite.enabled) ||
        (selectedMode === 'hybrid' && course.modes.hybrid.enabled) ||
        (selectedMode === 'selfPaced' && course.modes.selfPaced.enabled);

      return matchesSearch && matchesCat && matchesLevel && matchesMode;
    });
  }, [publishedCourses, search, selectedCategory, selectedLevel, selectedMode]);

  const openEnroll = (course?: Course, mode?: LearningMode) => {
    setEnrollModalCourse(course || publishedCourses[0] || null);
    setEnrollInitialMode(mode);
    setEnrollModalOpen(true);
  };

  const getProgramIcon = (iconName: CourseTopProgram['icon']) => {
    switch (iconName) {
      case 'code':
        return <Code size={22} />;
      case 'smartphone':
        return <Smartphone size={22} />;
      case 'palette':
        return <Palette size={22} />;
      case 'cloud':
        return <Cloud size={22} />;
      case 'sparkles':
        return <Sparkles size={22} />;
      case 'book':
      default:
        return <BookOpen size={22} />;
    }
  };

  const getStatIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy size={28} className="courses-stat-item__icon" />;
      case 'book':
        return <BookOpen size={28} className="courses-stat-item__icon" />;
      case 'building':
        return <Building2 size={28} className="courses-stat-item__icon" />;
      case 'users':
      default:
        return <Users size={28} className="courses-stat-item__icon" />;
    }
  };

  return (
    <>
      {/* ====================================================================
          1. HERO SECTION (MATCHING REFERENCE IMAGE 100%)
          ==================================================================== */}
      <section className="courses-hero-section" aria-labelledby="courses-hero-title">
        <div className="container">
          <div className="courses-hero-grid">
            {/* Left Content Column */}
            <div>
              <Reveal delay={40}>
                <span className="courses-dash-eyebrow">{pageData.heroEyebrow}</span>
              </Reveal>

              <Reveal delay={80}>
                <h1 id="courses-hero-title" className="courses-hero-title">
                  {pageData.heroTitleLine1}
                  <span>{pageData.heroTitleLine2}</span>
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="courses-hero-lead">{pageData.heroDescription}</p>
              </Reveal>

              <Reveal delay={160}>
                <div className="courses-hero-actions">
                  <Button
                    href="#courses-catalog"
                    icon={<ArrowRight size={18} />}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('courses-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {pageData.heroPrimaryCtaText}
                  </Button>

                  <button
                    type="button"
                    className="btn--watch"
                    onClick={() => setVideoModalOpen(true)}
                  >
                    <Play size={16} fill="currentColor" />
                    <span>{pageData.heroSecondaryCtaText}</span>
                  </button>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="courses-social-proof">
                  <div className="courses-avatar-stack" aria-hidden="true">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Student Alumni"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Student Alumni"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                      alt="Student Alumni"
                    />
                  </div>
                  <span className="courses-social-proof__text">{pageData.heroSocialProofText}</span>
                </div>
              </Reveal>
            </div>

            {/* Right Portrait & Floating 20+ Badge */}
            <div className="courses-hero-image-wrap">
              <Reveal delay={140}>
                <img
                  src={pageData.heroImage}
                  alt="Student at Vision Giants Academy"
                  className="courses-hero-portrait"
                />
                <div className="courses-floating-badge" aria-label="Years of Excellence">
                  <span className="courses-floating-badge__number">
                    {pageData.heroExperienceBadgeYears}
                  </span>
                  <span className="courses-floating-badge__label">
                    <Award size={14} className="courses-floating-badge__icon" />
                    {pageData.heroExperienceBadgeText}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. STATS RIBBON (NAVY BLUE 4 COLUMNS WITH DIVIDERS)
          ==================================================================== */}
      <section className="courses-stats-ribbon" aria-label="Key Academy Metrics">
        <div className="container">
          <div className="courses-stats-grid">
            {pageData.stats.map((st, idx) => (
              <div key={idx} className="courses-stat-item">
                {getStatIcon(st.icon)}
                <div className="courses-stat-item__content">
                  <span className="courses-stat-item__value">{st.value}</span>
                  <span className="courses-stat-item__label">{st.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. TOP COURSES / PROGRAMS (5 CLEAN CARDS IN A ROW)
          ==================================================================== */}
      <section className="courses-programs-section" aria-labelledby="programs-section-title">
        <div className="container">
          <div className="courses-section-head">
            <div>
              <span className="courses-dash-eyebrow">{pageData.programsEyebrow}</span>
              <h2 id="programs-section-title" className="courses-section-head__title">
                {pageData.programsHeading}
              </h2>
            </div>
            <a
              href="#courses-catalog"
              className="courses-section-head__link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('courses-catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {pageData.programsViewAllText}
            </a>
          </div>

          <div className="courses-programs-grid">
            {pageData.programs.map((prog, i) => (
              <Reveal key={prog.id} delay={i * 60}>
                <a
                  href="#courses-catalog"
                  className="courses-program-card"
                  onClick={(e) => {
                    e.preventDefault();
                    // If matches category, select it
                    const match = categories.find((c) =>
                      prog.title.toLowerCase().includes(c.name.toLowerCase()) ||
                      c.name.toLowerCase().includes(prog.title.toLowerCase())
                    );
                    if (match) setSelectedCategory(match.name);
                    document.getElementById('courses-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div
                    className="courses-program-card__icon-wrap"
                    style={{
                      background: `${prog.accentColor}14`,
                      color: prog.accentColor,
                    }}
                  >
                    {getProgramIcon(prog.icon)}
                  </div>
                  <h3 className="courses-program-card__title">{prog.title}</h3>
                  <p className="courses-program-card__desc">{prog.description}</p>
                  <span className="courses-program-card__link" style={{ color: prog.accentColor }}>
                    Learn More →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. WHY CHOOSE US (SPLIT SECTION WITH FLOATING 100% BADGE)
          ==================================================================== */}
      <section className="courses-why-section" aria-labelledby="why-section-title">
        <div className="container">
          <div className="courses-why-grid">
            {/* Left Photo & Floating Badge */}
            <div className="courses-why-image-wrap">
              <Reveal delay={80}>
                <img
                  src={pageData.whyImage}
                  alt="Students learning in tech classroom"
                  className="courses-why-image"
                />
                <div className="courses-why-badge">
                  <Trophy size={20} />
                  <span>{pageData.whyBadge}</span>
                </div>
              </Reveal>
            </div>

            {/* Right Content & Checklist */}
            <div>
              <Reveal delay={60}>
                <span className="courses-dash-eyebrow">{pageData.whyEyebrow}</span>
                <h2 id="why-section-title" className="courses-why-title">
                  {pageData.whyHeading}
                </h2>
                <p className="courses-why-desc">{pageData.whyDescription}</p>

                <ul className="courses-checklist">
                  {pageData.whyChecklist.map((item, idx) => (
                    <li key={idx} className="courses-checklist__item">
                      <CheckCircle2 size={18} className="courses-checklist__icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button href={pageData.whyCtaLink} variant="primary">
                  {pageData.whyCtaText}
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. COMPLETE INTERACTIVE COURSE CATALOG & FILTERS
          ==================================================================== */}
      <section id="courses-catalog" className="section" aria-labelledby="catalog-title">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto var(--space-6)' }}>
            <span className="courses-dash-eyebrow">{pageData.catalogEyebrow}</span>
            <h2 id="catalog-title" className="courses-section-head__title" style={{ marginTop: 8 }}>
              {pageData.catalogHeading}
            </h2>
            <p className="courses-hero-lead" style={{ margin: '8px auto 0' }}>
              {pageData.catalogLead}
            </p>
          </div>

          {/* Category filter pills */}
          <div className="course-categories-pills" style={{ marginBottom: 'var(--space-5)' }}>
            <button
              type="button"
              className={`course-cat-pill${selectedCategory === 'all' ? ' is-active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Courses ({publishedCourses.length})
            </button>
            {categories.filter((c) => c.active !== false).map((cat) => {
              const count = publishedCourses.filter(
                (p) => p.category.toLowerCase() === cat.name.toLowerCase()
              ).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`course-cat-pill${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? ' is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>

          {/* Search and Filters Bar */}
          <div className="course-filters card">
            <div className="course-filters__search">
              <Search size={18} className="course-filters__icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search courses by title, keywords, or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="course-filters__input"
                aria-label="Search courses"
              />
              {search && (
                <button
                  type="button"
                  className="course-filters__clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="course-filters__dropdowns">
              <div className="course-filters__group">
                <label htmlFor="filter-cat">Category:</label>
                <select
                  id="filter-cat"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="course-filters__group">
                <label htmlFor="filter-level">Skill Level:</label>
                <select
                  id="filter-level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div className="course-filters__group">
                <label htmlFor="filter-mode">Learning Mode:</label>
                <select
                  id="filter-mode"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as LearningMode | 'all')}
                >
                  <option value="all">All Modes</option>
                  <option value="online">Online Live</option>
                  <option value="onsite">Onsite Campus</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="selfPaced">Self-Paced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Listing Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid--3 course-catalog-grid" style={{ marginTop: 'var(--space-6)' }}>
              {filteredCourses.map((course, i) => (
                <Reveal key={course.id} delay={(i % 3) * 80}>
                  <article className="card card--interactive course-card" style={{ height: '100%' }}>
                    <div className="course-card__top">
                      <span className="badge badge--primary">{course.category}</span>
                      <span className="course-card__level">{course.skillLevel}</span>
                    </div>

                    <h3 className="course-card__title">
                      <Link to={`/courses/${course.slug}/`}>{course.title}</Link>
                    </h3>

                    <p className="course-card__intro">{course.introduction}</p>

                    <div className="course-card__meta">
                      <span>
                        <Clock size={15} aria-hidden="true" />
                        {course.duration}
                      </span>
                      <span>
                        <BookOpen size={15} aria-hidden="true" />
                        {course.modules.length} Modules
                      </span>
                    </div>

                    {/* Modes Available Badges */}
                    <div className="course-card__modes">
                      <span className="course-card__modes-label">Modes:</span>
                      {course.modes.online.enabled && <span className="mode-badge mode-badge--online">Online</span>}
                      {course.modes.onsite.enabled && <span className="mode-badge mode-badge--onsite">Onsite</span>}
                      {course.modes.hybrid.enabled && <span className="mode-badge mode-badge--hybrid">Hybrid</span>}
                      {course.modes.selfPaced.enabled && <span className="mode-badge mode-badge--selfpaced">Self-Paced</span>}
                    </div>

                    <div className="course-card__footer">
                      <Link to={`/courses/${course.slug}/`} className="btn btn--outline btn--sm">
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={() => openEnroll(course)}
                      >
                        Enroll Now
                      </button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card course-empty-state" style={{ marginTop: 'var(--space-6)' }}>
              <BookOpen size={32} className="muted" aria-hidden="true" />
              <h3>No courses found</h3>
              <p>We could not find any courses matching your selected criteria. Try resetting the filters.</p>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSelectedMode('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          6. STUDENT SUCCESS STORIES (WHAT OUR STUDENTS SAY)
          ==================================================================== */}
      <section className="courses-testimonials-section" aria-labelledby="testimonials-section-title">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <span className="courses-dash-eyebrow">{pageData.testimonialsEyebrow}</span>
            <h2 id="testimonials-section-title" className="courses-section-head__title" style={{ marginTop: 6 }}>
              {pageData.testimonialsHeading}
            </h2>
          </div>

          <div className="courses-testimonials-grid">
            {pageData.testimonials.map((t, idx) => (
              <Reveal key={t.id} delay={idx * 80}>
                <article className="courses-testimonial-card">
                  <img src={t.photo} alt={t.name} className="courses-testimonial-card__avatar" />
                  <div className="courses-testimonial-card__content">
                    <p className="courses-testimonial-card__quote">“{t.quote}”</p>
                    <span className="courses-testimonial-card__name">{t.name}</span>
                    <span className="courses-testimonial-card__outcome">{t.outcome}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. BOOK A FREE DEMO CLASS CTA RIBBON
          ==================================================================== */}
      <section className="courses-cta-ribbon-section" aria-label="Book Demo Class">
        <div className="container">
          <div className="courses-cta-ribbon">
            <div className="courses-cta-ribbon__left">
              <div className="courses-cta-ribbon__icon-wrap">
                <Calendar size={28} />
              </div>
              <div>
                <h3 className="courses-cta-ribbon__title">{pageData.demoCtaHeading}</h3>
                <p className="courses-cta-ribbon__desc">{pageData.demoCtaDescription}</p>
              </div>
            </div>

            <button
              type="button"
              className="btn--amber"
              onClick={() => openEnroll()}
            >
              {pageData.demoCtaButtonText}
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          VIDEO WALKTHROUGH MODAL
          ==================================================================== */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="modal-backdrop"
          onClick={() => setVideoModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 23, 48, 0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 720,
              width: '100%',
              background: '#0b1730',
              color: '#ffffff',
              padding: 'var(--space-5)',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-float)',
            }}
          >
            <button
              type="button"
              onClick={() => setVideoModalOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: 36,
                height: 36,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close video"
            >
              <X size={20} />
            </button>

            <h3 style={{ color: '#ffffff', marginBottom: 'var(--space-3)' }}>
              Vision Giants Academy Experience
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', marginBottom: 'var(--space-4)', fontSize: '0.95rem' }}>
              Get an insider preview of our live project workflows, modern coding lab facilities, and personalized mentorship methodology.
            </p>

            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#000',
              }}
            >
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Vision Giants Academy Walkthrough"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ENROLLMENT DIALOG
          ==================================================================== */}
      {enrollModalOpen && (
        <EnrollmentDialog
          course={enrollModalCourse}
          courses={publishedCourses}
          initialMode={enrollInitialMode}
          onClose={() => setEnrollModalOpen(false)}
        />
      )}
    </>
  );
}
