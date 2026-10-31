import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Code,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  PlayCircle,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useContent } from '../content/ContentContext';
import type { LearningMode } from '../data/courses';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/animations/Reveal';
import { Highlight } from '../components/ui/Highlight';
import { EnrollmentDialog } from '../components/courses/EnrollmentDialog';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { courses, instructors } = useContent();

  const course = courses.find((c) => c.slug === slug || c.id === slug);

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeModule, setActiveModule] = useState<string | null>(course?.modules[0]?.id || null);

  // Enrollment modal
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedEnrollMode, setSelectedEnrollMode] = useState<LearningMode | undefined>();

  if (!course) {
    return <Navigate to="/courses/" replace />;
  }

  const instructor = instructors.find((inst) => inst.id === course.instructorId);

  const openEnroll = (mode?: LearningMode) => {
    setSelectedEnrollMode(mode);
    setEnrollModalOpen(true);
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="course-hero page-hero" aria-labelledby="course-hero-title">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/courses/">Courses</Link>
              </li>
              <li aria-current="page">{course.title}</li>
            </ol>
          </nav>

          <div className="course-hero__grid">
            <div className="course-hero__content">
              <div className="crumb-wrap">
                <span className="crumb">{course.category}</span>
                <span className="badge badge--neutral" style={{ marginLeft: 8 }}>
                  {course.skillLevel}
                </span>
              </div>

              <h1 id="course-hero-title">
                <Highlight text={course.title} />
              </h1>

              <p className="lead">{course.introduction}</p>

              <div className="course-hero__meta-bar">
                <div className="course-hero__meta-item">
                  <Clock size={18} aria-hidden="true" />
                  <div>
                    <small>Duration</small>
                    <strong>{course.duration}</strong>
                  </div>
                </div>
                <div className="course-hero__meta-item">
                  <BookOpen size={18} aria-hidden="true" />
                  <div>
                    <small>Syllabus</small>
                    <strong>{course.modules.length} Modules</strong>
                  </div>
                </div>
                <div className="course-hero__meta-item">
                  <GraduationCap size={18} aria-hidden="true" />
                  <div>
                    <small>Credential</small>
                    <strong>Verified Certificate</strong>
                  </div>
                </div>
              </div>

              <div className="course-hero__actions">
                <Button onClick={() => openEnroll()} icon={<ArrowRight size={18} />}>
                  Enroll in this Course
                </Button>
                <Button href="#syllabus" variant="outline">
                  View Syllabus
                </Button>
              </div>
            </div>

            <div className="course-hero__side-card card">
              <h3>Available Learning Modes</h3>
              <p className="muted" style={{ fontSize: '0.88rem' }}>
                Select your preferred mode to enroll with customized pricing and scheduling:
              </p>

              <div className="course-hero__modes-list">
                {course.modes.online.enabled && (
                  <div className="course-mode-row">
                    <div className="course-mode-row__info">
                      <span className="mode-badge mode-badge--online">Online</span>
                      <strong>{course.modes.online.fee || 'Contact for fee'}</strong>
                      <span className="course-mode-row__sub">{course.modes.online.schedule}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => openEnroll('online')}
                    >
                      Enroll Online
                    </button>
                  </div>
                )}

                {course.modes.onsite.enabled && (
                  <div className="course-mode-row">
                    <div className="course-mode-row__info">
                      <span className="mode-badge mode-badge--onsite">Onsite</span>
                      <strong>{course.modes.onsite.fee || 'Contact for fee'}</strong>
                      <span className="course-mode-row__sub">{course.modes.onsite.city || 'Campus'}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => openEnroll('onsite')}
                    >
                      Enroll Onsite
                    </button>
                  </div>
                )}

                {course.modes.hybrid.enabled && (
                  <div className="course-mode-row">
                    <div className="course-mode-row__info">
                      <span className="mode-badge mode-badge--hybrid">Hybrid</span>
                      <strong>{course.modes.hybrid.fee || 'Contact for fee'}</strong>
                      <span className="course-mode-row__sub">Online + Labs</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => openEnroll('hybrid')}
                    >
                      Enroll Hybrid
                    </button>
                  </div>
                )}

                {course.modes.selfPaced.enabled && (
                  <div className="course-mode-row">
                    <div className="course-mode-row__info">
                      <span className="mode-badge mode-badge--selfpaced">Self-Paced</span>
                      <strong>{course.modes.selfPaced.fee || 'Contact for fee'}</strong>
                      <span className="course-mode-row__sub">Flexible Video Lessons</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => openEnroll('selfPaced')}
                    >
                      Start Self-Paced
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSE DESCRIPTION & LEARNING OUTCOMES */}
      <section className="section" aria-labelledby="overview-title">
        <div className="container">
          <div className="grid grid--2 course-overview-grid" style={{ gap: 'var(--space-7)' }}>
            <div>
              <SectionHeading id="overview-title" eyebrow="Program Overview" title="What You Will Learn" />
              <p className="lead">{course.description}</p>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="course-prerequisites card feature" style={{ marginTop: 'var(--space-5)' }}>
                  <h4>Prerequisites</h4>
                  <ul>
                    {course.prerequisites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="card course-outcomes-card">
              <span className="icon-wrap" aria-hidden="true">
                <CheckCircle size={24} />
              </span>
              <h3>Core Learning Outcomes</h3>
              <ul className="course-outcomes-list">
                {course.learningOutcomes.map((outcome, i) => (
                  <li key={i}>
                    <CheckCircle size={16} className="course-outcomes-icon" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SYLLABUS & MODULES BREAKDOWN */}
      <section id="syllabus" className="section section--alt" aria-labelledby="syllabus-title">
        <div className="container">
          <SectionHeading
            id="syllabus-title"
            eyebrow="Detailed Curriculum"
            title="Comprehensive Syllabus"
            lead="Step-by-step technical progression designed to transform beginners into job-ready software practitioners."
          />

          <div className="course-modules-accordion">
            {course.modules.map((mod, i) => {
              const isOpen = activeModule === mod.id;
              return (
                <div key={mod.id || i} className={`course-module-item card${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="course-module-header"
                    onClick={() => setActiveModule(isOpen ? null : mod.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="course-module-title-wrap">
                      <span className="course-module-index">0{i + 1}</span>
                      <div>
                        <h4>{mod.title}</h4>
                        {mod.description && <p className="muted">{mod.description}</p>}
                      </div>
                    </div>
                    <span className="course-module-chevron" aria-hidden="true">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="course-module-body">
                      <h5>Included Lessons & Labs:</h5>
                      <ul className="course-lessons-list">
                        {mod.lessons.map((lesson, idx) => (
                          <li key={idx}>
                            <span className="course-lesson-dot" />
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LEARNING MODES COMPARISON & DETAILS */}
      <section className="section" aria-labelledby="modes-detail-title">
        <div className="container">
          <SectionHeading
            id="modes-detail-title"
            eyebrow="Learning Formats"
            title="Configured Learning Modes for This Course"
            lead="Review the specific timetable, venue, and fee details tailored for this curriculum."
            align="center"
          />

          <div className="grid grid--2 course-detail-modes-grid">
            {course.modes.online.enabled && (
              <div className="card feature course-detail-mode-card">
                <div className="course-detail-mode-card__top">
                  <Globe size={24} className="icon-wrap" />
                  <span className="badge badge--primary">Online Format</span>
                </div>
                <h3>Live Online Classes</h3>
                <p>Interactive sessions via {course.modes.online.platform || 'live web conferencing'} with instant instructor Q&A.</p>
                <div className="course-mode-specs">
                  <div><strong>Fee:</strong> {course.modes.online.fee}</div>
                  <div><strong>Schedule:</strong> {course.modes.online.schedule}</div>
                  <div><strong>Timings:</strong> {course.modes.online.timings} ({course.modes.online.timeZone || 'PKT'})</div>
                  <div><strong>Format:</strong> {course.modes.online.format === 'both' ? 'Live Classes + HD Recordings' : 'Live Interactive'}</div>
                </div>
                <Button size="sm" onClick={() => openEnroll('online')}>
                  Enroll in Online Batch
                </Button>
              </div>
            )}

            {course.modes.onsite.enabled && (
              <div className="card feature course-detail-mode-card">
                <div className="course-detail-mode-card__top">
                  <MapPin size={24} className="icon-wrap" />
                  <span className="badge badge--secondary">Onsite Campus</span>
                </div>
                <h3>Physical Campus Immersion</h3>
                <p>Attend in-person lectures and hands-on coding labs at our physical training center.</p>
                <div className="course-mode-specs">
                  <div><strong>Fee:</strong> {course.modes.onsite.fee}</div>
                  <div><strong>Campus:</strong> {course.modes.onsite.campusName || 'Vision Giants Center'}</div>
                  <div><strong>Address:</strong> {course.modes.onsite.campusAddress}</div>
                  <div><strong>Class Schedule:</strong> {course.modes.onsite.schedule} ({course.modes.onsite.timings})</div>
                  <div><strong>Seats Limit:</strong> {course.modes.onsite.availableSeats} students per batch</div>
                </div>
                <Button size="sm" onClick={() => openEnroll('onsite')}>
                  Enroll in Onsite Batch
                </Button>
              </div>
            )}

            {course.modes.hybrid.enabled && (
              <div className="card feature course-detail-mode-card">
                <div className="course-detail-mode-card__top">
                  <Layers size={24} className="icon-wrap" />
                  <span className="badge badge--neutral">Hybrid Model</span>
                </div>
                <h3>Hybrid (Online + Campus Labs)</h3>
                <p>Attend weekday evening theory online and weekend practical coding clinics at our campus lab.</p>
                <div className="course-mode-specs">
                  <div><strong>Fee:</strong> {course.modes.hybrid.fee}</div>
                  <div><strong>Online Schedule:</strong> {course.modes.hybrid.onlineSchedule || 'Weekdays Online'}</div>
                  <div><strong>Campus Labs:</strong> {course.modes.hybrid.onsiteSchedule || 'Weekend Onsite Labs'}</div>
                  <div><strong>Venue:</strong> {course.modes.hybrid.campusLocation}</div>
                  <div><strong>Distribution:</strong> {course.modes.hybrid.sessionBreakdown}</div>
                </div>
                <Button size="sm" onClick={() => openEnroll('hybrid')}>
                  Enroll in Hybrid Batch
                </Button>
              </div>
            )}

            {course.modes.selfPaced.enabled && (
              <div className="card feature course-detail-mode-card">
                <div className="course-detail-mode-card__top">
                  <PlayCircle size={24} className="icon-wrap" />
                  <span className="badge badge--neutral">Self-Paced</span>
                </div>
                <h3>Self-Paced Learning</h3>
                <p>Complete the curriculum on your own time with pre-recorded HD modules and automated challenges.</p>
                <div className="course-mode-specs">
                  <div><strong>Fee:</strong> {course.modes.selfPaced.fee}</div>
                  <div><strong>Access Duration:</strong> {course.modes.selfPaced.accessDuration || '12 Months Access'}</div>
                  <div><strong>Video Content:</strong> {course.modes.selfPaced.recordedLessonsCount} Recorded Lessons</div>
                  <div><strong>Resources:</strong> {course.modes.selfPaced.learningResources}</div>
                </div>
                <Button size="sm" onClick={() => openEnroll('selfPaced')}>
                  Start Self-Paced
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. INSTRUCTOR SPOTLIGHT */}
      {instructor && (
        <section className="section section--alt" aria-labelledby="instructor-title">
          <div className="container">
            <SectionHeading id="instructor-title" eyebrow="Course Mentor" title="Meet Your Lead Instructor" />

            <div className="card course-lead-instructor-card">
              <div className="course-lead-instructor-card__head">
                <div className="course-lead-instructor-card__avatar-wrap">
                  {instructor.photo ? (
                    <img src={instructor.photo} alt={instructor.name} />
                  ) : (
                    <Users size={32} />
                  )}
                </div>
                <div>
                  <h3>{instructor.name}</h3>
                  <span className="course-lead-instructor-card__role">{instructor.designation}</span>
                  <span className="course-lead-instructor-card__exp">{instructor.experience}</span>
                </div>
              </div>

              <p className="course-lead-instructor-card__bio">{instructor.bio}</p>

              {instructor.skills && instructor.skills.length > 0 && (
                <div className="course-job-card__skills" style={{ marginTop: 'var(--space-3)' }}>
                  {instructor.skills.map((s) => (
                    <span key={s} className="badge badge--neutral">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {instructor.linkedinUrl && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <a
                    href={instructor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="client-card__link"
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 6. PRACTICAL PROJECTS */}
      {course.practicalProjects && course.practicalProjects.length > 0 && (
        <section className="section" aria-labelledby="projects-title">
          <div className="container">
            <SectionHeading
              id="projects-title"
              eyebrow="Hands-On Experience"
              title="Real-World Capstone Projects You Will Build"
              lead="Graduates leave with verified live repositories deployed to modern cloud hosting."
            />

            <div className="grid grid--3">
              {course.practicalProjects.map((project, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="card feature" style={{ height: '100%' }}>
                    <span className="icon-wrap" aria-hidden="true">
                      <Code size={22} />
                    </span>
                    <h4>Project #{i + 1}</h4>
                    <p>{project}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      {course.faqs && course.faqs.length > 0 && (
        <section className="section section--alt" aria-labelledby="faq-title">
          <div className="container">
            <SectionHeading
              id="faq-title"
              eyebrow="Frequently Asked Questions"
              title="Common Questions About This Course"
              align="center"
            />

            <div className="course-faqs-accordion">
              {course.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className={`course-faq-item card${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="course-faq-question"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <span className="course-faq-chevron" aria-hidden="true">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="course-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. BOTTOM ENROLLMENT CTA */}
      <section className="section section--tight" aria-labelledby="bottom-cta-title">
        <div className="container">
          <Reveal className="cta">
            <div>
              <h2 id="bottom-cta-title">
                <Highlight text={`Ready to Master ${course.title}?`} />
              </h2>
              <p>
                Batch sizes are limited to ensure personalized instructor attention and high-caliber project reviews.
              </p>
            </div>
            <div className="cta__actions">
              <Button onClick={() => openEnroll()} icon={<ArrowRight size={18} />}>
                Enroll Now
              </Button>
              <Button to="/courses/" variant="outline">
                All Courses
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ENROLLMENT DIALOG */}
      {enrollModalOpen && (
        <EnrollmentDialog
          course={course}
          courses={courses}
          initialMode={selectedEnrollMode}
          onClose={() => setEnrollModalOpen(false)}
        />
      )}
    </>
  );
}

