import { useState, useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Compass,
  FileCheck,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  PlayCircle,
  Search,
  Sparkles,
  Users,
  Video,
  X,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router';
import { useContent } from '../content/ContentContext';
import type { Course, LearningMode } from '../data/courses';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/animations/Reveal';
import { Highlight } from '../components/ui/Highlight';
import { EnrollmentDialog } from '../components/courses/EnrollmentDialog';
import { PortalVisual } from '../components/visuals/IsoVisuals';

export default function CoursesPage() {
  const { courses: allCourses, categories, instructors } = useContent();
  const publishedCourses = allCourses.filter((c) => c.published !== false);

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

  return (
    <>
      {/* 1. HERO SECTION */}
      <PageHero
        crumb="Training Academy"
        eyebrow="Vision Giants Academy"
        title="Learn. Build. Grow. Your Future Starts Here."
        lead="Develop in-demand technology skills through practical training, expert guidance, and real-world projects. Join our learning programs online or at our physical training center."
        actions={
          <div className="page-hero__actions">
            <Button href="#courses" icon={<ArrowRight size={18} />}>
              Explore Courses
            </Button>
            <Button variant="outline" onClick={() => openEnroll()}>
              Enroll Now
            </Button>
          </div>
        }
        visual={<PortalVisual />}
      />

      {/* 2. LEARNING MODES SECTION */}
      <section className="section" aria-labelledby="modes-title">
        <div className="container">
          <SectionHeading
            id="modes-title"
            eyebrow="Flexible Learning Paths"
            title="Four Formats Designed Around Your Schedule"
            lead="Choose the learning method that fits your location, lifestyle, and career goals. We offer both physical campus immersion and global live online classes."
            align="center"
          />

          <div className="grid grid--4 course-modes-grid">
            {/* Mode A: Online Learning */}
            <Reveal delay={60}>
              <article className="card card--interactive course-mode-card">
                <span className="icon-wrap" aria-hidden="true">
                  <Globe size={24} />
                </span>
                <span className="badge badge--primary">Global Reach</span>
                <h3>Online Learning</h3>
                <p>
                  Learn from anywhere through live online classes, instructor guidance, interactive sessions, and
                  practical assignments.
                </p>
                <ul className="course-mode-card__list">
                  <li>
                    <CheckCircle size={15} /> Live Online Classes
                  </li>
                  <li>
                    <CheckCircle size={15} /> Real-Time Instructor Interaction
                  </li>
                  <li>
                    <CheckCircle size={15} /> Online Resources & Recordings
                  </li>
                  <li>
                    <CheckCircle size={15} /> Remote Peer Group Collaboration
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setSelectedMode('online');
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Online Courses
                </button>
              </article>
            </Reveal>

            {/* Mode B: Onsite Learning */}
            <Reveal delay={120}>
              <article className="card card--interactive course-mode-card">
                <span className="icon-wrap" aria-hidden="true">
                  <MapPin size={24} />
                </span>
                <span className="badge badge--secondary">Physical Campus</span>
                <h3>Onsite Learning</h3>
                <p>
                  Learn in a professional classroom environment with face-to-face instructor support, practical
                  computer labs, and collaborative learning.
                </p>
                <ul className="course-mode-card__list">
                  <li>
                    <CheckCircle size={15} /> Physical Innovation Campus
                  </li>
                  <li>
                    <CheckCircle size={15} /> Direct 1-on-1 Instructor Support
                  </li>
                  <li>
                    <CheckCircle size={15} /> Practical High-Spec Computer Labs
                  </li>
                  <li>
                    <CheckCircle size={15} /> In-Person Professional Networking
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setSelectedMode('onsite');
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Onsite Courses
                </button>
              </article>
            </Reveal>

            {/* Mode C: Hybrid Learning */}
            <Reveal delay={180}>
              <article className="card card--interactive course-mode-card">
                <span className="icon-wrap" aria-hidden="true">
                  <Layers size={24} />
                </span>
                <span className="badge badge--neutral">Best of Both</span>
                <h3>Hybrid Learning</h3>
                <p>
                  Enjoy the flexibility of combining online classes with physical classroom sessions for practical lab experiments.
                </p>
                <ul className="course-mode-card__list">
                  <li>
                    <CheckCircle size={15} /> Weekday Live Online Sessions
                  </li>
                  <li>
                    <CheckCircle size={15} /> Weekend Onsite Campus Labs
                  </li>
                  <li>
                    <CheckCircle size={15} /> Flexible Schedule for Working Pros
                  </li>
                  <li>
                    <CheckCircle size={15} /> Hands-on Capstone Projects
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setSelectedMode('hybrid');
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Hybrid Courses
                </button>
              </article>
            </Reveal>

            {/* Mode D: Self-Paced Learning */}
            <Reveal delay={240}>
              <article className="card card--interactive course-mode-card">
                <span className="icon-wrap" aria-hidden="true">
                  <PlayCircle size={24} />
                </span>
                <span className="badge badge--neutral">Anytime</span>
                <h3>Self-Paced Learning</h3>
                <p>
                  Learn at your own speed through recorded lectures, detailed walkthroughs, and digital learning materials.
                </p>
                <ul className="course-mode-card__list">
                  <li>
                    <CheckCircle size={15} /> Complete Recorded Lessons
                  </li>
                  <li>
                    <CheckCircle size={15} /> 100% Flexible Study Schedule
                  </li>
                  <li>
                    <CheckCircle size={15} /> Downloadable Learning Materials
                  </li>
                  <li>
                    <CheckCircle size={15} /> Automated Self-Assessment
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setSelectedMode('selfPaced');
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Self-Paced
                </button>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. COURSE CATEGORIES */}
      <section className="section section--alt" aria-labelledby="categories-title">
        <div className="container">
          <SectionHeading
            id="categories-title"
            eyebrow="Specialization Tracks"
            title="Explore Popular Technology Fields"
            lead="From full-stack development to mobile engineering and user experience design."
            align="center"
          />

          <div className="course-categories-pills">
            <button
              type="button"
              className={`course-cat-pill${selectedCategory === 'all' ? ' is-active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories ({publishedCourses.length})
            </button>
            {categories.filter((c) => c.active !== false).map((cat) => {
              const count = publishedCourses.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
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
        </div>
      </section>

      {/* 4. COURSE CATALOG & FILTERS */}
      <section id="courses" className="section" aria-labelledby="catalog-title">
        <div className="container">
          <SectionHeading
            id="catalog-title"
            eyebrow="Academy Catalog"
            title="Available Courses & Bootcamps"
            lead="Curated, practical programs taught by veteran software engineers and architects."
          />

          {/* Catalog Filter Controls */}
          <div className="course-filters card">
            <div className="course-filters__search">
              <Search size={18} className="course-filters__icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search courses by keyword, technology, or topic..."
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

      {/* 5. INSTRUCTORS SECTION */}
      {instructors.length > 0 && (
        <section className="section section--alt" aria-labelledby="instructors-title">
          <div className="container">
            <SectionHeading
              id="instructors-title"
              eyebrow="Expert Mentors"
              title="Learn Directly From Industry Practitioners"
              lead="Our instructors are senior engineers and architects actively building commercial systems."
              align="center"
            />

            <div className="grid grid--3 course-instructors-grid">
              {instructors.map((inst, i) => (
                <Reveal key={inst.id} delay={(i % 3) * 80}>
                  <article className="card card--interactive course-instructor-card" style={{ height: '100%' }}>
                    <div className="course-instructor-card__avatar-wrap">
                      {inst.photo ? (
                        <img src={inst.photo} alt={inst.name} className="course-instructor-card__avatar" />
                      ) : (
                        <div className="course-instructor-card__avatar-fallback">
                          <Users size={32} />
                        </div>
                      )}
                    </div>
                    <h4>{inst.name}</h4>
                    <span className="course-instructor-card__role">{inst.designation}</span>
                    <span className="course-instructor-card__exp">{inst.experience}</span>
                    <p className="course-instructor-card__bio">{inst.bio}</p>

                    {inst.skills && inst.skills.length > 0 && (
                      <div className="course-instructor-card__skills">
                        {inst.skills.map((s) => (
                          <span key={s} className="badge badge--neutral">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {inst.linkedinUrl && (
                      <a
                        href={inst.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="course-instructor-card__social"
                        aria-label={`${inst.name} LinkedIn Profile`}
                      >
                        <span>LinkedIn Profile</span>
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. STUDENT PROJECTS & CERTIFICATES */}
      <section className="section" aria-labelledby="certificates-title">
        <div className="container">
          <div className="grid grid--2 course-cert-grid" style={{ alignItems: 'center', gap: 'var(--space-7)' }}>
            <div>
              <SectionHeading
                id="certificates-title"
                eyebrow="Industry Verification"
                title="Verified Credentials & Portfolio-Ready Code"
              />
              <p className="lead">
                Every graduate leaves with more than a certificate: you build production repositories, deploy live apps,
                and receive a digitally verifiable graduation credential recognized by tech employers.
              </p>
              <ul className="course-cert-bullets">
                <li>
                  <FileCheck size={18} className="course-cert-bullet-icon" />
                  <span>
                    <strong>Verified Certificate of Completion</strong> with a unique verification URL for LinkedIn and resumes.
                  </span>
                </li>
                <li>
                  <Code size={18} className="course-cert-bullet-icon" />
                  <span>
                    <strong>Public GitHub Capstone Portfolio</strong> featuring multi-tier apps with live deployed URLs.
                  </span>
                </li>
                <li>
                  <GraduationCap size={18} className="course-cert-bullet-icon" />
                  <span>
                    <strong>Direct Interview Placements</strong> for top graduates at Vision Giants and partner software houses.
                  </span>
                </li>
              </ul>
              <div style={{ marginTop: 'var(--space-5)' }}>
                <Button onClick={() => openEnroll()}>Apply for Next Batch</Button>
              </div>
            </div>

            <div className="course-cert-card-col">
              <Reveal delay={100}>
                <div className="card feature course-cert-card">
                  <span className="icon-wrap" aria-hidden="true">
                    <FileCheck size={26} />
                  </span>
                  <h3>Vision Giants Academy Certification</h3>
                  <p>
                    Awarded upon completing all hands-on modules, meeting milestone deadlines, and successfully defending
                    your graduation capstone project in front of our technical review board.
                  </p>
                  <div className="course-cert-badge-row">
                    <span className="badge badge--primary">Verifiable QR Code</span>
                    <span className="badge badge--secondary">LinkedIn Addable</span>
                    <span className="badge badge--neutral">Lifetime Alumni Access</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STUDENT TESTIMONIALS */}
      <section className="section section--alt" aria-labelledby="student-feedback-title">
        <div className="container">
          <SectionHeading
            id="student-feedback-title"
            eyebrow="Student Feedback"
            title="Stories From Our Tech Academy Graduates"
            lead="See how our practical curriculum helped learners transition into engineering careers."
            align="center"
          />

          <div className="grid grid--3 course-feedback-grid">
            <Reveal delay={60}>
              <blockquote className="card course-feedback-card">
                <p>
                  “The project-first approach made all the difference. Instead of theoretical syntax slides, we were
                  pushing code to GitHub and deploying to cloud containers every week.”
                </p>
                <footer>
                  <strong>Full Stack Graduate</strong>
                  <span className="muted">Now Junior Engineer at SaaS Startup</span>
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={120}>
              <blockquote className="card course-feedback-card">
                <p>
                  “The hybrid mode gave me the best of both worlds: I could study online after work, and spend Saturdays
                  at the campus lab getting direct debugging help from the lead instructor.”
                </p>
                <footer>
                  <strong>Mobile App Graduate</strong>
                  <span className="muted">Published 2 Apps on Play Store</span>
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={180}>
              <blockquote className="card course-feedback-card">
                <p>
                  “The UI/UX design mentorship helped me build a real Behance case study that landed me my first remote
                  design contract within three weeks of graduation.”
                </p>
                <footer>
                  <strong>UI/UX Design Graduate</strong>
                  <span className="muted">Product Design Freelancer</span>
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="section section--tight" aria-labelledby="courses-cta-title">
        <div className="container">
          <Reveal className="cta">
            <div>
              <h2 id="courses-cta-title">
                <Highlight text="Start Learning Today. Build Your Future Tomorrow." />
              </h2>
              <p>
                Choose your preferred learning path and develop the skills needed to succeed in the technology industry.
              </p>
            </div>
            <div className="cta__actions">
              <Button href="#courses" icon={<ArrowRight size={18} />}>
                Explore Our Courses
              </Button>
              <Button variant="outline" onClick={() => openEnroll()}>
                Enroll in a Course
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ENROLLMENT DIALOG */}
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

