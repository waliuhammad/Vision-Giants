import { useState, useMemo } from 'react';
import {
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Filter,
  GraduationCap,
  HeartHandshake,
  Layers,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Code,
  Laptop,
} from 'lucide-react';
import { Link } from 'react-router';
import { useContent } from '../content/ContentContext';
import {
  hiringProcessSteps,
  workBenefits,
  internshipRoles,
  type Position,
} from '../data/careers';
import { PageHero } from '../components/ui/PageHero';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/animations/Reveal';
import { Highlight } from '../components/ui/Highlight';
import { PortalVisual } from '../components/visuals/IsoVisuals';

export default function CareersPage() {
  const { positions: allPositions } = useContent();
  const openPositions = allPositions.filter((p) => p.published !== false);

  // Filters state
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [arrangementFilter, setArrangementFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  // Selected job for detailed view modal
  const [selectedJob, setSelectedJob] = useState<Position | null>(null);

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
      const matchesDept = departmentFilter === 'all' || p.department === departmentFilter;
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      const matchesArrangement = arrangementFilter === 'all' || p.workArrangement === arrangementFilter;
      const matchesExp = experienceFilter === 'all' || p.experience === experienceFilter;
      return matchesSearch && matchesDept && matchesType && matchesArrangement && matchesExp;
    });
  }, [openPositions, search, departmentFilter, typeFilter, arrangementFilter, experienceFilter]);

  return (
    <>
      {/* 1. HERO SECTION */}
      <PageHero
        crumb="Careers"
        eyebrow="Join Vision Giants"
        title="Build Your Future With Us"
        lead="Join a team of creative thinkers, developers, and innovators who turn ideas into technology. We design, build, and deploy world-class digital experiences."
        actions={
          <div className="page-hero__actions">
            <Button href="#positions" icon={<ArrowRight size={18} />}>
              Explore Open Positions
            </Button>
            <Button to="/careers/apply/" variant="outline">
              Submit Your CV
            </Button>
          </div>
        }
        visual={<PortalVisual />}
      />

      {/* 2. WHY WORK WITH US? */}
      <section className="section" aria-labelledby="why-work-title">
        <div className="container">
          <SectionHeading
            id="why-work-title"
            eyebrow="Why Work With Us"
            title="Grow Your Career in a Forward-Thinking Environment"
            lead="We create an atmosphere where high engineering standards meet continuous mentorship and personal career growth."
            align="center"
          />
          <div className="grid grid--3">
            {workBenefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 80}>
                <article className="card card--interactive career-benefit-card" style={{ height: '100%' }}>
                  <span className="icon-wrap" aria-hidden="true">
                    {i === 0 && <TrendingUp size={22} />}
                    {i === 1 && <GraduationCap size={22} />}
                    {i === 2 && <Laptop size={22} />}
                    {i === 3 && <HeartHandshake size={22} />}
                    {i === 4 && <Compass size={22} />}
                    {i === 5 && <Sparkles size={22} />}
                  </span>
                  <h3>{b.title}</h3>
                  <p>{b.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR WORK CULTURE */}
      <section className="section section--alt" aria-labelledby="culture-title">
        <div className="container">
          <SectionHeading
            id="culture-title"
            eyebrow="Our Work Culture"
            title="Where Craftsmanship Meets Team Collaboration"
            lead="We prioritize psychological safety, open discourse, clean architectural conventions, and continuous learning."
            align="center"
          />

          <div className="grid grid--3 career-culture-grid">
            <Reveal delay={60}>
              <div className="card feature career-culture-card">
                <span className="icon-wrap" aria-hidden="true">
                  <Users size={24} />
                </span>
                <h3>Collaborative Squads</h3>
                <p>
                  Engineers, designers, and project leads collaborate closely in focused squads with minimal hierarchy
                  and complete autonomy over technical execution.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card feature career-culture-card">
                <span className="icon-wrap" aria-hidden="true">
                  <Code size={24} />
                </span>
                <h3>Quality-Driven Engineering</h3>
                <p>
                  We believe code is craft. Rigorous peer reviews, automated CI/CD pipelines, and clean architecture ensure
                  we deliver systems we are genuinely proud of.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="card feature career-culture-card">
                <span className="icon-wrap" aria-hidden="true">
                  <GraduationCap size={24} />
                </span>
                <h3>Continuous Learning</h3>
                <p>
                  Weekly tech demos, sponsored conference attendances, book stipends, and internal hackathons keep our
                  skills sharp and modern.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. OPEN POSITIONS & FILTERS */}
      <section id="positions" className="section" aria-labelledby="positions-title">
        <div className="container">
          <SectionHeading
            id="positions-title"
            eyebrow="Open Positions"
            title="Current Career Opportunities"
            lead="Find your next role at Vision Giants and help us build scalable software for visionary clients worldwide."
            aside={
              <Button to="/careers/apply/" variant="outline" size="sm" icon={<ArrowRight size={15} />}>
                General Application
              </Button>
            }
          />

          {/* Interactive Filters Bar */}
          <div className="career-filters card">
            <div className="career-filters__search">
              <Search size={18} className="career-filters__icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by job title, department, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="career-filters__input"
                aria-label="Search jobs"
              />
              {search && (
                <button
                  type="button"
                  className="career-filters__clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="career-filters__dropdowns">
              <div className="career-filters__group">
                <label htmlFor="dept-filter">Dept:</label>
                <select
                  id="dept-filter"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments
                    .filter((d) => d !== 'all')
                    .map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              <div className="career-filters__group">
                <label htmlFor="type-filter">Type:</label>
                <select id="type-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  {types
                    .filter((t) => t !== 'all')
                    .map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>

              <div className="career-filters__group">
                <label htmlFor="arrangement-filter">Mode:</label>
                <select
                  id="arrangement-filter"
                  value={arrangementFilter}
                  onChange={(e) => setArrangementFilter(e.target.value)}
                >
                  <option value="all">All Arrangements</option>
                  {arrangements
                    .filter((a) => a !== 'all')
                    .map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                </select>
              </div>

              <div className="career-filters__group">
                <label htmlFor="exp-filter">Level:</label>
                <select id="exp-filter" value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}>
                  <option value="all">All Levels</option>
                  {experiences
                    .filter((exp) => exp !== 'all')
                    .map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {filteredPositions.length > 0 ? (
            <div className="grid grid--2 career-jobs-grid" style={{ marginTop: 'var(--space-6)' }}>
              {filteredPositions.map((job, i) => (
                <Reveal key={job.id} delay={(i % 2) * 80}>
                  <article className="card card--interactive career-job-card" style={{ height: '100%' }}>
                    <div className="career-job-card__head">
                      <div>
                        <span className="badge badge--primary">{job.department || 'Engineering'}</span>
                        <h3 className="career-job-card__title">{job.title}</h3>
                      </div>
                      <span className="career-job-card__type">{job.type}</span>
                    </div>

                    <div className="career-job-card__meta">
                      <span>
                        <MapPin size={15} aria-hidden="true" />
                        {job.location} ({job.workArrangement})
                      </span>
                      <span>
                        <Briefcase size={15} aria-hidden="true" />
                        {job.experience}
                      </span>
                      {job.deadline && (
                        <span>
                          <Clock size={15} aria-hidden="true" />
                          Apply by {job.deadline}
                        </span>
                      )}
                    </div>

                    <p className="career-job-card__summary">{job.summary}</p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="career-job-card__skills">
                        {job.skills.map((skill) => (
                          <span key={skill} className="badge badge--neutral">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="career-job-card__footer">
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </button>
                      <Button
                        to={`/careers/apply/?position=${encodeURIComponent(job.id)}`}
                        size="sm"
                        icon={<ArrowRight size={15} />}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card career-empty-state" style={{ marginTop: 'var(--space-6)' }}>
              <span className="icon-wrap" aria-hidden="true">
                <Briefcase size={26} />
              </span>
              <h3>No matching positions found</h3>
              <p>
                We don’t have a role matching your exact filter criteria right now, but we are always eager to talk to
                exceptionally talented engineers and designers.
              </p>
              <div className="career-empty-state__actions">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setSearch('');
                    setDepartmentFilter('all');
                    setTypeFilter('all');
                    setArrangementFilter('all');
                    setExperienceFilter('all');
                  }}
                >
                  Clear Filters
                </button>
                <Button to="/careers/apply/" size="sm" icon={<ArrowRight size={15} />}>
                  Send General Application
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="career-modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div
            className="career-modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-job-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="career-modal__head">
              <div>
                <span className="badge badge--primary">{selectedJob.department}</span>
                <h2 id="modal-job-title">{selectedJob.title}</h2>
                <div className="career-modal__meta">
                  <span>
                    <MapPin size={15} /> {selectedJob.location} · {selectedJob.workArrangement}
                  </span>
                  <span>
                    <Briefcase size={15} /> {selectedJob.type} · {selectedJob.experience}
                  </span>
                  {selectedJob.salaryRange && (
                    <span>
                      <strong>Salary:</strong> {selectedJob.salaryRange}
                    </span>
                  )}
                  {selectedJob.deadline && (
                    <span>
                      <Clock size={15} /> Deadline: {selectedJob.deadline}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="career-modal__close"
                onClick={() => setSelectedJob(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="career-modal__body">
              {selectedJob.description && (
                <div className="career-modal__section">
                  <h3>About the Role</h3>
                  <p>{selectedJob.description}</p>
                </div>
              )}

              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="career-modal__section">
                  <h3>Key Responsibilities</h3>
                  <ul>
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div className="career-modal__section">
                  <h3>Required Skills & Technologies</h3>
                  <div className="career-job-card__skills">
                    {selectedJob.skills.map((s) => (
                      <span key={s} className="badge badge--neutral">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                <div className="career-modal__section">
                  <h3>Qualifications & Requirements</h3>
                  <ul>
                    {selectedJob.qualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.applicationInstructions && (
                <div className="career-modal__section">
                  <h3>How to Apply</h3>
                  <p>{selectedJob.applicationInstructions}</p>
                </div>
              )}
            </div>

            <div className="career-modal__footer">
              <button type="button" className="btn btn--outline" onClick={() => setSelectedJob(null)}>
                Close
              </button>
              <Button
                to={`/careers/apply/?position=${encodeURIComponent(selectedJob.id)}`}
                icon={<ArrowRight size={16} />}
              >
                Apply for this Position
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. INTERNSHIPS SECTION */}
      <section className="section section--alt" aria-labelledby="internships-title">
        <div className="container">
          <SectionHeading
            id="internships-title"
            eyebrow="Student & Graduate Tracks"
            title="Accelerate Your Future With Our Internship Program"
            lead="Kickstart your professional software engineering career with dedicated 1-on-1 mentorship, real production code, and clear pathways to full-time employment."
          />

          <div className="grid grid--4 career-internships-grid">
            {internshipRoles.map((role, i) => (
              <Reveal key={role.title} delay={(i % 4) * 60}>
                <article className="card card--interactive career-internship-card">
                  <div className="career-internship-card__top">
                    <span className="badge badge--secondary">Internship</span>
                    <span className="career-internship-card__duration">{role.duration}</span>
                  </div>
                  <h4>{role.title}</h4>
                  <p className="career-internship-card__track">{role.track}</p>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>{role.mode}</p>
                  <Button
                    to={`/careers/apply/?position=${encodeURIComponent(role.title.toLowerCase().replace(/ /g, '-'))}`}
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight size={14} />}
                  >
                    Apply Now
                  </Button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HIRING PROCESS */}
      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <SectionHeading
            id="process-title"
            eyebrow="Hiring Process"
            title="Our Transparent, 6-Step Recruitment Journey"
            lead="We respect your time. Our hiring pipeline is clear, communicative, and structured around your strengths."
            align="center"
          />

          <div className="grid grid--3 career-process-grid">
            {hiringProcessSteps.map((step, i) => (
              <Reveal key={step.step} delay={(i % 3) * 80}>
                <div className="card feature career-process-card">
                  <span className="career-process-card__number">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TEAM TESTIMONIALS */}
      <section className="section section--alt" aria-labelledby="testimonials-title">
        <div className="container">
          <SectionHeading
            id="testimonials-title"
            eyebrow="Life at Vision Giants"
            title="What Our Engineers & Designers Say"
            lead="Authentic perspectives from the people who build technology with us every day."
            align="center"
          />

          <div className="grid grid--3 career-testimonials-grid">
            <Reveal delay={60}>
              <blockquote className="card career-testimonial-card">
                <p>
                  “The best part about engineering at Vision Giants is the emphasis on code quality. We are given the time
                  and tooling to design systems right, write comprehensive tests, and deploy with confidence.”
                </p>
                <footer>
                  <strong>Frontend Architect</strong>
                  <span className="muted">Engineering Squad</span>
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={120}>
              <blockquote className="card career-testimonial-card">
                <p>
                  “From day one, the mentorship and transparency have been incredible. You have real ownership of client
                  features and direct communication with leadership.”
                </p>
                <footer>
                  <strong>Mobile Developer</strong>
                  <span className="muted">Mobile Systems Squad</span>
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={180}>
              <blockquote className="card career-testimonial-card">
                <p>
                  “Designers and engineers actually collaborate like true partners here. Ideas are challenged constructively,
                  and everyone is motivated to ship exceptional products.”
                </p>
                <footer>
                  <strong>UI/UX Designer</strong>
                  <span className="muted">Product Design Squad</span>
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="section section--tight" aria-labelledby="careers-cta-title">
        <div className="container">
          <Reveal className="cta">
            <div>
              <h2 id="careers-cta-title">
                <Highlight text="Ready to Become Part of Our Team?" />
              </h2>
              <p>
                Explore current opportunities or send an open application with your resume and portfolio.
              </p>
            </div>
            <div className="cta__actions">
              <Button href="#positions" icon={<ArrowRight size={18} />}>
                Explore Opportunities
              </Button>
              <Button to="/careers/apply/" variant="outline">
                Submit Your CV
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
