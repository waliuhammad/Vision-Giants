import { useEffect, useState, type FormEvent } from 'react';
import {
  BookOpen,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  GripVertical,
  LayoutTemplate,
  LoaderCircle,
  MessageSquareQuote,
  Plus,
  Save,
  Trash2,
  X,
  Globe,
  MapPin,
  Layers,
  PlayCircle,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import {
  defaultCourses,
  defaultCourseCategories,
  defaultInstructors,
  type Course,
  type CourseCategory,
  type Instructor,
  type CourseModule,
} from '../data/courses';
import {
  defaultCoursesPageData,
  coursesPageDataFromDoc,
  type CoursesPageData,
  type StudentTestimonial,
} from '../content/coursesPageData';

const firestore = () => import('firebase/firestore/lite');

export function CoursesManager() {
  const [mainTab, setMainTab] = useState<'courses' | 'content' | 'testimonials'>('courses');

  // Courses state
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [categories, setCategories] = useState<CourseCategory[]>(defaultCourseCategories);
  const [instructors, setInstructors] = useState<Instructor[]>(defaultInstructors);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing course state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'modes' | 'curriculum' | 'faqs'>('general');

  // Text helpers for arrays
  const [outcomesStr, setOutcomesStr] = useState('');
  const [prereqsStr, setPrereqsStr] = useState('');
  const [projectsStr, setProjectsStr] = useState('');

  // Page Content state (Hero, Stats, Top 5 Programs, Why Choose Us, Demo CTA)
  const [pageContent, setPageContent] = useState<CoursesPageData>(defaultCoursesPageData);
  const [contentSaving, setContentSaving] = useState(false);

  // Testimonials state & modal
  const [editingTestimonial, setEditingTestimonial] = useState<StudentTestimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs, doc, getDoc, query, orderBy }] = await Promise.all([
        getAdminDb(),
        firestore(),
      ]);

      // 1. Load courses
      const courseSnap = await getDocs(query(collection(db, 'courses'), orderBy('displayOrder', 'asc')));
      if (!courseSnap.empty) {
        const list: Course[] = courseSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            slug: String(data.slug || d.id),
            title: String(data.title || ''),
            introduction: String(data.introduction || ''),
            description: String(data.description || ''),
            thumbnail: String(data.thumbnail || ''),
            category: String(data.category || 'Full Stack Development'),
            skillLevel: (data.skillLevel as any) || 'Beginner',
            duration: String(data.duration || '12 Weeks'),
            prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites.filter((x): x is string => typeof x === 'string') : [],
            learningOutcomes: Array.isArray(data.learningOutcomes) ? data.learningOutcomes.filter((x): x is string => typeof x === 'string') : [],
            modules: Array.isArray(data.modules) ? data.modules : [],
            instructorId: String(data.instructorId || ''),
            practicalProjects: Array.isArray(data.practicalProjects) ? data.practicalProjects.filter((x): x is string => typeof x === 'string') : [],
            certificateOffered: data.certificateOffered !== false,
            certificateDetails: String(data.certificateDetails || ''),
            faqs: Array.isArray(data.faqs) ? data.faqs : [],
            displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : 0,
            published: data.published !== false,
            modes: data.modes || defaultCourses[0].modes,
          };
        });
        setCourses(list);
      } else {
        setCourses(defaultCourses);
      }

      // 2. Load categories
      const catSnap = await getDocs(collection(db, 'course_categories'));
      if (!catSnap.empty) {
        setCategories(
          catSnap.docs.map((d) => ({
            id: d.id,
            name: String(d.get('name') || ''),
            slug: String(d.get('slug') || d.id),
            description: String(d.get('description') || ''),
            order: Number(d.get('order')) || 0,
            active: d.get('active') !== false,
          }))
        );
      }

      // 3. Load instructors
      const instSnap = await getDocs(collection(db, 'instructors'));
      if (!instSnap.empty) {
        setInstructors(
          instSnap.docs.map((d) => ({
            id: d.id,
            name: String(d.get('name') || ''),
            photo: String(d.get('photo') || ''),
            designation: String(d.get('designation') || ''),
            experience: String(d.get('experience') || ''),
            skills: Array.isArray(d.get('skills')) ? d.get('skills') : [],
            bio: String(d.get('bio') || ''),
            linkedinUrl: String(d.get('linkedinUrl') || ''),
          }))
        );
      }

      // 4. Load Courses Page Content (Hero, Stats, Programs, Why Choose Us, Stories)
      const pageSnap = await getDoc(doc(db, 'pages', 'courses'));
      if (pageSnap.exists()) {
        setPageContent(coursesPageDataFromDoc(pageSnap.data()));
      }
    } catch (err) {
      console.error(err);
      setError('Could not load course data from database. Using local defaults.');
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Page Content Handlers ----------------
  const handleSavePageContent = async () => {
    setContentSaving(true);
    setError('');
    setSuccess('');
    try {
      const [db, { doc, setDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await setDoc(doc(db, 'pages', 'courses'), pageContent, { merge: true });
      setSuccess('Courses page layout and sections saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save page sections. Please check permissions.');
    } finally {
      setContentSaving(false);
    }
  };

  const updatePageContent = (patch: Partial<CoursesPageData>) => {
    setPageContent((prev) => ({ ...prev, ...patch }));
  };

  const updateStat = (index: number, patch: { value?: string; label?: string }) => {
    const next = [...pageContent.stats];
    next[index] = { ...next[index], ...patch };
    updatePageContent({ stats: next });
  };

  const updateProgram = (index: number, patch: { title?: string; description?: string }) => {
    const next = [...pageContent.programs];
    next[index] = { ...next[index], ...patch };
    updatePageContent({ programs: next });
  };

  const updateChecklist = (index: number, text: string) => {
    const next = [...pageContent.whyChecklist];
    next[index] = text;
    updatePageContent({ whyChecklist: next });
  };

  // ---------------- Testimonials Handlers ----------------
  const handleSaveTestimonial = (e: FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    let updatedList: StudentTestimonial[];
    if (isNewTestimonial) {
      updatedList = [...pageContent.testimonials, editingTestimonial];
    } else {
      updatedList = pageContent.testimonials.map((t) =>
        t.id === editingTestimonial.id ? editingTestimonial : t
      );
    }

    updatePageContent({ testimonials: updatedList });
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!window.confirm('Delete this student story?')) return;
    updatePageContent({
      testimonials: pageContent.testimonials.filter((t) => t.id !== id),
    });
  };

  // ---------------- Drag & Drop Courses Reordering ----------------
  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!courses || fromIndex === toIndex) return;
    const next = [...courses];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setCourses(next);
    handleSaveAll(next);
  };

  const handleSaveAll = async (listToSave: Course[]) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const [db, { doc, writeBatch, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);

      listToSave.forEach((c, idx) => {
        const ref = doc(db, 'courses', c.id);
        batch.set(
          ref,
          {
            slug: c.slug.trim(),
            title: c.title.trim(),
            introduction: c.introduction.trim(),
            description: c.description.trim(),
            thumbnail: c.thumbnail || '',
            category: c.category,
            skillLevel: c.skillLevel,
            duration: c.duration.trim(),
            prerequisites: c.prerequisites || [],
            learningOutcomes: c.learningOutcomes || [],
            modules: c.modules || [],
            instructorId: c.instructorId || '',
            practicalProjects: c.practicalProjects || [],
            certificateOffered: c.certificateOffered !== false,
            certificateDetails: c.certificateDetails || '',
            faqs: c.faqs || [],
            displayOrder: idx + 1,
            published: c.published !== false,
            modes: c.modes,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      setCourses(listToSave);
      setSuccess('Courses updated successfully! Changes are live on the website.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save courses to Firestore. Check permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setActiveTab('general');
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      slug: `course-${Date.now()}`,
      title: '',
      introduction: '',
      description: '',
      thumbnail: '',
      category: categories[0]?.name || 'Full Stack Development',
      skillLevel: 'Beginner',
      duration: '12 Weeks',
      prerequisites: [],
      learningOutcomes: [],
      modules: [],
      instructorId: instructors[0]?.id || '',
      practicalProjects: [],
      certificateOffered: true,
      certificateDetails: 'Official Vision Giants Academy certificate with verifiable verification code.',
      faqs: [],
      displayOrder: (courses?.length || 0) + 1,
      published: true,
      modes: {
        online: {
          enabled: true,
          fee: '$350',
          schedule: 'Live Mon & Wed 7:00 PM EST',
          format: 'both',
        },
        onsite: {
          enabled: false,
          fee: '$500',
          campusName: 'Vision Giants Campus, Tech Park',
          schedule: 'Tue & Thu 3:00 PM - 6:00 PM',
        },
        hybrid: {
          enabled: true,
          fee: '$420',
          schedule: 'Online lectures weekdays + Sat physical lab',
        },
        selfPaced: {
          enabled: false,
          fee: '$180',
          accessDuration: 'Lifetime access',
        },
      },
    };
    setEditingCourse(newCourse);
    setOutcomesStr('');
    setPrereqsStr('');
    setProjectsStr('');
  };

  const handleOpenEdit = (c: Course) => {
    setIsNew(false);
    setActiveTab('general');
    setEditingCourse(JSON.parse(JSON.stringify(c)));
    setOutcomesStr(c.learningOutcomes.join('\n'));
    setPrereqsStr(c.prerequisites.join('\n'));
    setProjectsStr(c.practicalProjects.join('\n'));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course permanently?')) return;
    setSaving(true);
    setError('');
    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'courses', id));
      const next = (courses || []).filter((c) => c.id !== id);
      setCourses(next);
      setSuccess('Course deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete course.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModal = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    if (!editingCourse.title.trim()) {
      setError('Course title is required.');
      return;
    }

    const cleanedCourse: Course = {
      ...editingCourse,
      title: editingCourse.title.trim(),
      slug: (editingCourse.slug || editingCourse.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      learningOutcomes: outcomesStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      prerequisites: prereqsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      practicalProjects: projectsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    let nextList: Course[];
    if (isNew) {
      nextList = [...(courses || []), cleanedCourse];
    } else {
      nextList = (courses || []).map((c) => (c.id === cleanedCourse.id ? cleanedCourse : c));
    }

    setEditingCourse(null);
    await handleSaveAll(nextList);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoaderCircle size={24} className="spin" />
          <span>Loading course academy…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Courses & Academy Management</h1>
          <p className="admin-page__sub">
            Customize the Courses Academy page to match the exact academy layout: Hero, Stats Ribbon, Top Programs, Why Choose Us, and Course Catalog.
          </p>
        </div>
        <div className="admin-page__actions">
          {mainTab === 'courses' && (
            <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenAdd}>
              <Plus size={16} /> Add New Course
            </button>
          )}
          {mainTab === 'content' && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleSavePageContent}
              disabled={contentSaving}
            >
              <Save size={16} />
              {contentSaving ? 'Saving…' : 'Save Page Changes'}
            </button>
          )}
          {mainTab === 'testimonials' && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleSavePageContent}
              disabled={contentSaving}
            >
              <Save size={16} />
              {contentSaving ? 'Saving…' : 'Save Testimonials'}
            </button>
          )}
          <a href="/courses/" target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm">
            <ExternalLink size={16} /> View Live Page
          </a>
        </div>
      </header>

      {/* MAIN TOP NAVIGATION TABS */}
      <div
        className="admin-modal-tabs"
        style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-5)' }}
      >
        <button
          type="button"
          className={`admin-tab-btn${mainTab === 'courses' ? ' is-active' : ''}`}
          onClick={() => setMainTab('courses')}
        >
          <BookOpen size={16} style={{ display: 'inline', marginRight: 6 }} />
          Course Catalog ({courses?.length || 0})
        </button>
        <button
          type="button"
          className={`admin-tab-btn${mainTab === 'content' ? ' is-active' : ''}`}
          onClick={() => setMainTab('content')}
        >
          <LayoutTemplate size={16} style={{ display: 'inline', marginRight: 6 }} />
          Hero, Stats & Page Sections
        </button>
        <button
          type="button"
          className={`admin-tab-btn${mainTab === 'testimonials' ? ' is-active' : ''}`}
          onClick={() => setMainTab('testimonials')}
        >
          <MessageSquareQuote size={16} style={{ display: 'inline', marginRight: 6 }} />
          Student Stories ({pageContent.testimonials.length})
        </button>
      </div>

      {error && (
        <div className="admin-notice admin-notice--error" role="alert">
          <CircleAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="admin-notice admin-notice--success" role="status">
          <CircleCheck size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: COURSE CATALOG (WITH DRAG & DROP REORDERING) */}
      {/* ========================================================================= */}
      {mainTab === 'courses' && (
        <div className="card admin-table-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 80, textAlign: 'center' }}>Position</th>
                  <th>Course Title & Category</th>
                  <th>Duration & Level</th>
                  <th>Enabled Modes</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses && courses.length > 0 ? (
                  courses.map((course, idx) => (
                    <tr
                      key={course.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        setDragIndex(idx);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (dropTarget !== idx) setDropTarget(idx);
                      }}
                      onDragEnd={() => {
                        setDragIndex(null);
                        setDropTarget(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragIndex !== null && dragIndex !== idx) {
                          handleReorder(dragIndex, idx);
                        }
                        setDragIndex(null);
                        setDropTarget(null);
                      }}
                      className={`admin-draggable-row${dragIndex === idx ? ' is-dragging' : ''}${dropTarget === idx ? ' is-drop-target' : ''}`}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <div className="admin-drag-handle" title="Drag and drop to change position">
                          <GripVertical size={16} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{idx + 1}</span>
                        </div>
                      </td>
                      <td>
                        <strong>{course.title}</strong>
                        <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
                          {course.category} · /courses/{course.slug}
                        </p>
                      </td>
                      <td>
                        {course.duration}
                        <span className="badge badge--neutral" style={{ marginLeft: 6 }}>
                          {course.skillLevel}
                        </span>
                      </td>
                      <td>
                        <div className="admin-modes-summary">
                          {course.modes.online.enabled && <span className="mode-badge mode-badge--online">Online</span>}
                          {course.modes.onsite.enabled && <span className="mode-badge mode-badge--onsite">Onsite</span>}
                          {course.modes.hybrid.enabled && <span className="mode-badge mode-badge--hybrid">Hybrid</span>}
                          {course.modes.selfPaced.enabled && <span className="mode-badge mode-badge--selfpaced">Self-Paced</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${course.published ? 'badge--primary' : 'badge--neutral'}`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn--outline btn--sm"
                          style={{ marginRight: 6 }}
                          onClick={() => handleOpenEdit(course)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn--outline btn--sm btn--danger"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="admin-table-empty">
                      No courses created yet. Click &quot;Add New Course&quot; to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HERO, STATS & PAGE SECTIONS (MATCHING REFERENCE IMAGE) */}
      {/* ========================================================================= */}
      {mainTab === 'content' && (
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {/* 1. Hero Section */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>1. Hero Section (Image + Dual Title)</h2>
            <div className="grid grid--2">
              <div className="field">
                <label>Dash Eyebrow</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroEyebrow}
                  onChange={(e) => updatePageContent({ heroEyebrow: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Title Line 1 (Dark Navy Text)</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroTitleLine1}
                  onChange={(e) => updatePageContent({ heroTitleLine1: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Title Line 2 (Brand Blue Accent)</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroTitleLine2}
                  onChange={(e) => updatePageContent({ heroTitleLine2: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Hero Portrait Image URL</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroImage}
                  onChange={(e) => updatePageContent({ heroImage: e.target.value })}
                />
              </div>
            </div>

            <div className="field" style={{ marginTop: '12px' }}>
              <label>Hero Lead Description</label>
              <textarea
                className="input"
                rows={3}
                value={pageContent.heroDescription}
                onChange={(e) => updatePageContent({ heroDescription: e.target.value })}
              />
            </div>

            <div className="grid grid--2" style={{ marginTop: '12px' }}>
              <div className="field">
                <label>Primary Button Text</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroPrimaryCtaText}
                  onChange={(e) => updatePageContent({ heroPrimaryCtaText: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Secondary Button (Video) Text</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroSecondaryCtaText}
                  onChange={(e) => updatePageContent({ heroSecondaryCtaText: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Floating Badge Years (e.g. 20+)</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroExperienceBadgeYears}
                  onChange={(e) => updatePageContent({ heroExperienceBadgeYears: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Floating Badge Label</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroExperienceBadgeText}
                  onChange={(e) => updatePageContent({ heroExperienceBadgeText: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Social Proof Text</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroSocialProofText}
                  onChange={(e) => updatePageContent({ heroSocialProofText: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 2. Key Stats Ribbon (4 Metrics) */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>2. Navy Blue Full-Width Stats Ribbon (4 Metrics)</h2>
            <div className="grid grid--4">
              {pageContent.stats.map((stat, idx) => (
                <div key={idx} style={{ background: 'var(--color-surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted)', display: 'block', marginBottom: 6 }}>
                    METRIC #{idx + 1} ({stat.icon.toUpperCase()})
                  </span>
                  <div className="field">
                    <label style={{ fontSize: '0.8rem' }}>Number / Stat</label>
                    <input
                      type="text"
                      className="input"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, { value: e.target.value })}
                    />
                  </div>
                  <div className="field" style={{ marginTop: 8 }}>
                    <label style={{ fontSize: '0.8rem' }}>Label</label>
                    <input
                      type="text"
                      className="input"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, { label: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Top Programs (5 Cards in a Row) */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>3. Top Courses / Programs Cards (5 Cards)</h2>
            <div className="grid grid--2">
              <div className="field">
                <label>Section Eyebrow</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.programsEyebrow}
                  onChange={(e) => updatePageContent({ programsEyebrow: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Section Title</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.programsHeading}
                  onChange={(e) => updatePageContent({ programsHeading: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
              {pageContent.programs.map((prog, idx) => (
                <div
                  key={prog.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '220px 1fr',
                    gap: '12px',
                    alignItems: 'center',
                    background: 'var(--color-surface-2)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <input
                    type="text"
                    className="input"
                    value={prog.title}
                    onChange={(e) => updateProgram(idx, { title: e.target.value })}
                  />
                  <input
                    type="text"
                    className="input"
                    value={prog.description}
                    onChange={(e) => updateProgram(idx, { description: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Why Choose Us Section */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>4. Why Choose Us: “We Don’t Just Teach, We Build Futures”</h2>
            <div className="grid grid--2">
              <div className="field">
                <label>Section Eyebrow</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.whyEyebrow}
                  onChange={(e) => updatePageContent({ whyEyebrow: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Section Heading</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.whyHeading}
                  onChange={(e) => updatePageContent({ whyHeading: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Left Classroom Photo URL</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.whyImage}
                  onChange={(e) => updatePageContent({ whyImage: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Floating Amber Badge Text (e.g. 100% Personal Attention)</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.whyBadge}
                  onChange={(e) => updatePageContent({ whyBadge: e.target.value })}
                />
              </div>
            </div>

            <div className="field" style={{ marginTop: '12px' }}>
              <label>Description Paragraph</label>
              <textarea
                className="input"
                rows={3}
                value={pageContent.whyDescription}
                onChange={(e) => updatePageContent({ whyDescription: e.target.value })}
              />
            </div>

            <h4 style={{ fontSize: '0.95rem', marginTop: '16px', marginBottom: '8px' }}>Checklist Points (4 Items)</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {pageContent.whyChecklist.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', width: 24 }}>
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    className="input"
                    value={item}
                    onChange={(e) => updateChecklist(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 5. Book Free Demo Class CTA Ribbon */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>5. Book a Free Demo Class Ribbon</h2>
            <div className="grid grid--2">
              <div className="field">
                <label>Banner Heading</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.demoCtaHeading}
                  onChange={(e) => updatePageContent({ demoCtaHeading: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Amber Button Label</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.demoCtaButtonText}
                  onChange={(e) => updatePageContent({ demoCtaButtonText: e.target.value })}
                />
              </div>
            </div>
            <div className="field" style={{ marginTop: '12px' }}>
              <label>Banner Description</label>
              <input
                type="text"
                className="input"
                value={pageContent.demoCtaDescription}
                onChange={(e) => updatePageContent({ demoCtaDescription: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STUDENT STORIES & TESTIMONIALS */}
      {/* ========================================================================= */}
      {mainTab === 'testimonials' && (
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Student Success Stories (Testimonials)</h2>
              <p className="muted" style={{ fontSize: '0.88rem', margin: '4px 0 0' }}>
                Manage cards shown under &quot;What Our Students Say&quot;.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => {
                setIsNewTestimonial(true);
                setEditingTestimonial({
                  id: `t-${Date.now()}`,
                  name: '',
                  role: 'Full Stack Graduate',
                  outcome: 'Placed at Tech Company',
                  quote: '',
                  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                });
              }}
            >
              <Plus size={15} /> Add Student Story
            </button>
          </div>

          <div className="grid grid--3">
            {pageContent.testimonials.map((t) => (
              <div key={t.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img
                      src={t.photo}
                      alt={t.name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.98rem', display: 'block' }}>{t.name || 'Unnamed'}</strong>
                      <span className="muted" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                        {t.outcome || t.role}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.55 }}>
                    “{t.quote}”
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => {
                      setIsNewTestimonial(false);
                      setEditingTestimonial(t);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm btn--danger"
                    onClick={() => handleDeleteTestimonial(t.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT / CREATE TESTIMONIAL MODAL */}
      {editingTestimonial && (
        <div className="admin-modal-backdrop" onClick={() => setEditingTestimonial(null)}>
          <div className="admin-modal card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="admin-modal__head">
              <h2>{isNewTestimonial ? 'Add Student Story' : 'Edit Student Story'}</h2>
              <button type="button" className="admin-modal__close" onClick={() => setEditingTestimonial(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="admin-modal__form">
              <div className="field">
                <label>Student Name</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Specialization / Track</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={editingTestimonial.role}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Placement / Outcome Badge (e.g. Hired at Top Firm)</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={editingTestimonial.outcome}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, outcome: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Photo URL</label>
                <input
                  type="text"
                  className="input"
                  value={editingTestimonial.photo}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, photo: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label>Testimonial Quote</label>
                <textarea
                  rows={4}
                  required
                  className="input"
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                />
              </div>

              <div className="admin-modal__actions" style={{ marginTop: 16 }}>
                <button type="button" className="btn btn--outline" onClick={() => setEditingTestimonial(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / CREATE COURSE MODAL */}
      {editingCourse && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCourse(null)}>
          <div className="admin-modal admin-modal--large card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <h2>{isNew ? 'Create New Course' : `Edit Course: ${editingCourse.title}`}</h2>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setEditingCourse(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB BAR */}
            <div className="admin-modal-tabs">
              <button
                type="button"
                className={`admin-tab-btn${activeTab === 'general' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General Details
              </button>
              <button
                type="button"
                className={`admin-tab-btn${activeTab === 'modes' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('modes')}
              >
                Learning Modes & Fees
              </button>
              <button
                type="button"
                className={`admin-tab-btn${activeTab === 'curriculum' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Curriculum & Modules ({editingCourse.modules.length})
              </button>
              <button
                type="button"
                className={`admin-tab-btn${activeTab === 'faqs' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('faqs')}
              >
                FAQs & Projects
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="admin-modal__form">
              {/* TAB 1: GENERAL */}
              {activeTab === 'general' && (
                <>
                  <div className="grid grid--2">
                    <div className="admin-field">
                      <label>Course Title *</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                        placeholder="e.g. Full Stack Web Development Mastery"
                      />
                    </div>
                    <div className="admin-field">
                      <label>Slug (URL) *</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.slug}
                        onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid--3">
                    <div className="admin-field">
                      <label>Category</label>
                      <select
                        value={editingCourse.category}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-field">
                      <label>Skill Level</label>
                      <select
                        value={editingCourse.skillLevel}
                        onChange={(e) => setEditingCourse({ ...editingCourse, skillLevel: e.target.value as any })}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <div className="admin-field">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        placeholder="e.g. 12 Weeks (300+ hrs)"
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Thumbnail Image URL</label>
                    <input
                      type="text"
                      value={editingCourse.thumbnail}
                      onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="admin-field">
                    <label>Short Introduction (1-2 sentences)</label>
                    <textarea
                      rows={2}
                      value={editingCourse.introduction}
                      onChange={(e) => setEditingCourse({ ...editingCourse, introduction: e.target.value })}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Full Overview / Description</label>
                    <textarea
                      rows={4}
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid--2">
                    <div className="admin-field">
                      <label>Lead Instructor</label>
                      <select
                        value={editingCourse.instructorId}
                        onChange={(e) => setEditingCourse({ ...editingCourse, instructorId: e.target.value })}
                      >
                        <option value="">-- Select Instructor --</option>
                        {instructors.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name} ({inst.designation})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-field admin-field--checkbox" style={{ alignSelf: 'center', marginTop: 18 }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={editingCourse.published}
                          onChange={(e) => setEditingCourse({ ...editingCourse, published: e.target.checked })}
                        />
                        <span>Publish this course to live academy catalog</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: LEARNING MODES & FEES */}
              {activeTab === 'modes' && (
                <div className="admin-modes-editor">
                  <p className="admin-subtext">
                    Configure separate pricing, class schedules, and specific features for each learning format.
                  </p>

                  {/* ONLINE */}
                  <div className="admin-mode-block card">
                    <div className="admin-mode-block__head">
                      <div className="admin-mode-title">
                        <Globe size={18} />
                        <h4>Online Learning</h4>
                      </div>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={editingCourse.modes.online.enabled}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              modes: {
                                ...editingCourse.modes,
                                online: { ...editingCourse.modes.online, enabled: e.target.checked },
                              },
                            })
                          }
                        />
                        <span>Enable Online</span>
                      </label>
                    </div>
                    {editingCourse.modes.online.enabled && (
                      <div className="grid grid--2">
                        <div className="admin-field">
                          <label>Fee (e.g. $350 or Free)</label>
                          <input
                            type="text"
                            value={editingCourse.modes.online.fee}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  online: { ...editingCourse.modes.online, fee: e.target.value },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="admin-field">
                          <label>Live Schedule</label>
                          <input
                            type="text"
                            value={editingCourse.modes.online.schedule || ''}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  online: { ...editingCourse.modes.online, schedule: e.target.value },
                                },
                              })
                            }
                            placeholder="e.g. Mon & Wed 7:00 PM EST"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ONSITE */}
                  <div className="admin-mode-block card">
                    <div className="admin-mode-block__head">
                      <div className="admin-mode-title">
                        <MapPin size={18} />
                        <h4>Onsite Physical Classroom</h4>
                      </div>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={editingCourse.modes.onsite.enabled}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              modes: {
                                ...editingCourse.modes,
                                onsite: { ...editingCourse.modes.onsite, enabled: e.target.checked },
                              },
                            })
                          }
                        />
                        <span>Enable Onsite</span>
                      </label>
                    </div>
                    {editingCourse.modes.onsite.enabled && (
                      <div className="grid grid--2">
                        <div className="admin-field">
                          <label>Fee (e.g. $500)</label>
                          <input
                            type="text"
                            value={editingCourse.modes.onsite.fee}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  onsite: { ...editingCourse.modes.onsite, fee: e.target.value },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="admin-field">
                          <label>Campus Location</label>
                          <input
                            type="text"
                            value={editingCourse.modes.onsite.campusName || ''}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  onsite: { ...editingCourse.modes.onsite, campusName: e.target.value },
                                },
                              })
                            }
                            placeholder="e.g. Vision Giants Campus Lab 4"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* HYBRID */}
                  <div className="admin-mode-block card">
                    <div className="admin-mode-block__head">
                      <div className="admin-mode-title">
                        <Layers size={18} />
                        <h4>Hybrid (Online + Onsite Labs)</h4>
                      </div>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={editingCourse.modes.hybrid.enabled}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              modes: {
                                ...editingCourse.modes,
                                hybrid: { ...editingCourse.modes.hybrid, enabled: e.target.checked },
                              },
                            })
                          }
                        />
                        <span>Enable Hybrid</span>
                      </label>
                    </div>
                    {editingCourse.modes.hybrid.enabled && (
                      <div className="grid grid--2">
                        <div className="admin-field">
                          <label>Fee (e.g. $420)</label>
                          <input
                            type="text"
                            value={editingCourse.modes.hybrid.fee}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  hybrid: { ...editingCourse.modes.hybrid, fee: e.target.value },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="admin-field">
                          <label>Hybrid Schedule</label>
                          <input
                            type="text"
                            value={editingCourse.modes.hybrid.schedule || ''}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  hybrid: { ...editingCourse.modes.hybrid, schedule: e.target.value },
                                },
                              })
                            }
                            placeholder="e.g. Weekdays online + Saturday physical lab"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SELF-PACED */}
                  <div className="admin-mode-block card">
                    <div className="admin-mode-block__head">
                      <div className="admin-mode-title">
                        <PlayCircle size={18} />
                        <h4>Self-Paced Online (Recorded)</h4>
                      </div>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={editingCourse.modes.selfPaced.enabled}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              modes: {
                                ...editingCourse.modes,
                                selfPaced: { ...editingCourse.modes.selfPaced, enabled: e.target.checked },
                              },
                            })
                          }
                        />
                        <span>Enable Self-Paced</span>
                      </label>
                    </div>
                    {editingCourse.modes.selfPaced.enabled && (
                      <div className="grid grid--2">
                        <div className="admin-field">
                          <label>Fee (e.g. $180)</label>
                          <input
                            type="text"
                            value={editingCourse.modes.selfPaced.fee}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  selfPaced: { ...editingCourse.modes.selfPaced, fee: e.target.value },
                                },
                              })
                            }
                          />
                        </div>
                        <div className="admin-field">
                          <label>Access Duration</label>
                          <input
                            type="text"
                            value={editingCourse.modes.selfPaced.accessDuration || ''}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                modes: {
                                  ...editingCourse.modes,
                                  selfPaced: { ...editingCourse.modes.selfPaced, accessDuration: e.target.value },
                                },
                              })
                            }
                            placeholder="e.g. Lifetime Access"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CURRICULUM */}
              {activeTab === 'curriculum' && (
                <div className="admin-curriculum-editor">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="admin-subtext">Add structured chapters/modules with topics and lessons.</p>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => {
                        const newMod: CourseModule = {
                          id: `mod-${Date.now()}`,
                          title: `Module ${editingCourse.modules.length + 1}: `,
                          description: '',
                          lessons: ['Lesson 1', 'Lesson 2'],
                        };
                        setEditingCourse({ ...editingCourse, modules: [...editingCourse.modules, newMod] });
                      }}
                    >
                      <Plus size={14} /> Add Module
                    </button>
                  </div>

                  <div className="admin-modules-list" style={{ marginTop: 14 }}>
                    {editingCourse.modules.map((mod, mIdx) => (
                      <div key={mod.id || mIdx} className="admin-module-card card">
                        <div className="admin-module-card__head">
                          <strong>Module #{mIdx + 1}</strong>
                          <button
                            type="button"
                            className="btn-icon admin-danger"
                            onClick={() => {
                              const next = [...editingCourse.modules];
                              next.splice(mIdx, 1);
                              setEditingCourse({ ...editingCourse, modules: next });
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Module Title</label>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={(e) => {
                                const next = [...editingCourse.modules];
                                next[mIdx].title = e.target.value;
                                setEditingCourse({ ...editingCourse, modules: next });
                              }}
                            />
                          </div>
                          <div className="admin-field">
                            <label>Description (optional)</label>
                            <input
                              type="text"
                              value={mod.description || ''}
                              onChange={(e) => {
                                const next = [...editingCourse.modules];
                                next[mIdx].description = e.target.value;
                                setEditingCourse({ ...editingCourse, modules: next });
                              }}
                            />
                          </div>
                        </div>
                        <div className="admin-field">
                          <label>Lessons / Topics (comma-separated)</label>
                          <input
                            type="text"
                            value={mod.lessons.join(', ')}
                            onChange={(e) => {
                              const next = [...editingCourse.modules];
                              next[mIdx].lessons = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              setEditingCourse({ ...editingCourse, modules: next });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: FAQS & PROJECTS */}
              {activeTab === 'faqs' && (
                <>
                  <div className="grid grid--2">
                    <div className="admin-field">
                      <label>Learning Outcomes (one per line)</label>
                      <textarea
                        rows={4}
                        value={outcomesStr}
                        onChange={(e) => setOutcomesStr(e.target.value)}
                        placeholder="Build production full-stack apps&#10;Deploy to cloud Docker containers"
                      />
                    </div>
                    <div className="admin-field">
                      <label>Prerequisites (one per line)</label>
                      <textarea
                        rows={4}
                        value={prereqsStr}
                        onChange={(e) => setPrereqsStr(e.target.value)}
                        placeholder="Basic programming fundamentals&#10;Familiarity with HTML/CSS"
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Hands-on Projects (one per line)</label>
                    <textarea
                      rows={3}
                      value={projectsStr}
                      onChange={(e) => setProjectsStr(e.target.value)}
                      placeholder="E-Commerce API with Stripe&#10;Realtime Chat application"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                    <label style={{ fontWeight: 600 }}>Course FAQs</label>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => {
                        const next = [
                          ...(editingCourse.faqs || []),
                          { question: 'What are the class timings?', answer: 'Timings depend on your selected mode.' },
                        ];
                        setEditingCourse({ ...editingCourse, faqs: next });
                      }}
                    >
                      <Plus size={14} /> Add FAQ
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                    {(editingCourse.faqs || []).map((faq, fIdx) => (
                      <div key={fIdx} className="card" style={{ padding: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn-icon admin-danger"
                            onClick={() => {
                              const next = [...editingCourse.faqs];
                              next.splice(fIdx, 1);
                              setEditingCourse({ ...editingCourse, faqs: next });
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="admin-field">
                          <label>Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const next = [...editingCourse.faqs];
                              next[fIdx].question = e.target.value;
                              setEditingCourse({ ...editingCourse, faqs: next });
                            }}
                          />
                        </div>
                        <div className="admin-field">
                          <label>Answer</label>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const next = [...editingCourse.faqs];
                              next[fIdx].answer = e.target.value;
                              setEditingCourse({ ...editingCourse, faqs: next });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="admin-modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setEditingCourse(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
