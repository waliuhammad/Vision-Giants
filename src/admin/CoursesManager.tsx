import { useEffect, useState, type FormEvent } from 'react';
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Plus,
  Trash2,
  X,
  GripVertical,
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
  } from '../data/courses';

const firestore = () => import('firebase/firestore/lite');

export function CoursesManager() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [categories, setCategories] = useState<CourseCategory[]>(defaultCourseCategories);
  const [instructors, setInstructors] = useState<Instructor[]>(defaultInstructors);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'modes' | 'curriculum' | 'faqs'>('general');

  // Text helpers for arrays
  const [outcomesStr, setOutcomesStr] = useState('');
  const [prereqsStr, setPrereqsStr] = useState('');
  const [projectsStr, setProjectsStr] = useState('');

  // Uploading thumbnail
  

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs, query, orderBy }] = await Promise.all([getAdminDb(), firestore()]);

      // Load courses
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

      // Load categories
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

      // Load instructors
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
    } catch (err) {
      console.error(err);
      setError('Could not load course data from database. Using local defaults.');
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
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
      modules: [
        {
          id: 'm1',
          title: 'Module 1: Foundations & Architecture',
          description: 'Introduction to fundamentals and core toolchain.',
          lessons: ['Getting Started & Setup', 'Core Syntax & Best Practices'],
        },
      ],
      instructorId: instructors[0]?.id || '',
      practicalProjects: ['Capstone Real-World Project with Live Deployment'],
      certificateOffered: true,
      certificateDetails: 'Verified Certificate of Completion from Vision Giants Academy.',
      faqs: [{ question: 'Are live class recordings provided?', answer: 'Yes, HD recordings are available within 2 hours.' }],
      displayOrder: (courses?.length || 0) + 1,
      published: true,
      modes: {
        online: {
          enabled: true,
          fee: 'PKR 40,000',
          schedule: 'Mon, Wed, Fri',
          timings: '7:00 PM - 9:00 PM (PKT)',
          timeZone: 'GMT+5',
          platform: 'Google Meet',
          format: 'live',
        },
        onsite: {
          enabled: true,
          fee: 'PKR 48,000',
          schedule: 'Tue, Thu, Sat',
          timings: '4:00 PM - 6:30 PM (PKT)',
          campusName: 'Vision Giants Innovation Center',
          campusAddress: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
          city: 'Lahore',
          availableSeats: 25,
        },
        hybrid: {
          enabled: false,
          fee: 'PKR 45,000',
          schedule: 'Online Weekdays + Onsite Weekend Labs',
          onlineSchedule: 'Mon, Wed (Online 7:00 PM - 9:00 PM)',
          onsiteSchedule: 'Saturday (Campus Lab 2:00 PM - 6:00 PM)',
          campusLocation: 'Gulberg III Campus, Lahore',
          sessionBreakdown: '60% Online + 40% Onsite Labs',
        },
        selfPaced: {
          enabled: false,
          fee: 'PKR 25,000',
          accessDuration: '12 Months Access',
          recordedLessonsCount: 50,
          learningResources: 'Full GitHub Repos & Video Access',
          assessmentDetails: 'Automated Quizzes & Final Project Review',
        },
      },
    };
    setEditingCourse(newCourse);
    setOutcomesStr('');
    setPrereqsStr('');
    setProjectsStr('Capstone Real-World Project with Live Deployment');
  };

  const handleOpenEdit = (c: Course) => {
    setIsNew(false);
    setActiveTab('general');
    setEditingCourse(c);
    setOutcomesStr(c.learningOutcomes?.join('\n') || '');
    setPrereqsStr(c.prerequisites?.join('\n') || '');
    setProjectsStr(c.practicalProjects?.join('\n') || '');
  };

  const handleSaveModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title.trim()) return;

    const completed: Course = {
      ...editingCourse,
      slug: editingCourse.slug.trim() || editingCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      learningOutcomes: outcomesStr.split('\n').map((s) => s.trim()).filter(Boolean),
      prerequisites: prereqsStr.split('\n').map((s) => s.trim()).filter(Boolean),
      practicalProjects: projectsStr.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    let updatedList = [...(courses || [])];
    if (isNew) {
      updatedList.push(completed);
    } else {
      updatedList = updatedList.map((c) => (c.id === completed.id ? completed : c));
    }

    setCourses(updatedList);
    setEditingCourse(null);
    handleSaveAll(updatedList);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    const updated = (courses || []).filter((c) => c.id !== id);
    setCourses(updated);

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'courses', id));
      handleSaveAll(updated);
    } catch {
      handleSaveAll(updated);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!courses || fromIndex === toIndex) return;
    const next = [...courses];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setCourses(next);
    handleSaveAll(next);
  };

  // Module helpers
  const addModule = () => {
    if (!editingCourse) return;
    const nextModules = [
      ...editingCourse.modules,
      {
        id: `m-${Date.now()}`,
        title: `Module ${editingCourse.modules.length + 1}: New Topic`,
        description: '',
        lessons: ['Introduction to topic', 'Hands-on laboratory exercise'],
      },
    ];
    setEditingCourse({ ...editingCourse, modules: nextModules });
  };

  const removeModule = (idx: number) => {
    if (!editingCourse) return;
    const next = [...editingCourse.modules];
    next.splice(idx, 1);
    setEditingCourse({ ...editingCourse, modules: next });
  };

  // FAQ helpers
  const addFaq = () => {
    if (!editingCourse) return;
    setEditingCourse({
      ...editingCourse,
      faqs: [...editingCourse.faqs, { question: 'New Question', answer: 'Answer details...' }],
    });
  };

  const removeFaq = (idx: number) => {
    if (!editingCourse) return;
    const next = [...editingCourse.faqs];
    next.splice(idx, 1);
    setEditingCourse({ ...editingCourse, faqs: next });
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
            Manage course syllabus, independent learning modes (online/onsite/hybrid/self-paced), pricing, and schedules.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenAdd}>
            <Plus size={16} /> Add New Course
          </button>
        </div>
      </header>

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
                      <label>URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.slug}
                        onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                        placeholder="e.g. full-stack-web-development"
                      />
                    </div>
                  </div>

                  <div className="grid grid--3">
                    <div className="admin-field">
                      <label>Category *</label>
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
                      <label>Skill Level *</label>
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
                      <label>Course Duration *</label>
                      <input
                        type="text"
                        required
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        placeholder="e.g. 16 Weeks (4 Months)"
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Lead Instructor</label>
                    <select
                      value={editingCourse.instructorId || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, instructorId: e.target.value })}
                    >
                      <option value="">Select Instructor...</option>
                      {instructors.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Introduction (Short overview for cards) *</label>
                    <textarea
                      rows={2}
                      required
                      value={editingCourse.introduction}
                      onChange={(e) => setEditingCourse({ ...editingCourse, introduction: e.target.value })}
                      placeholder="High-impact 1-2 sentences shown on course catalog cards..."
                    />
                  </div>

                  <div className="admin-field">
                    <label>Full Course Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      placeholder="Comprehensive overview of learning outcomes, pedagogy, and industry relevance..."
                    />
                  </div>

                  <div className="admin-field admin-field--checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingCourse.published}
                        onChange={(e) => setEditingCourse({ ...editingCourse, published: e.target.checked })}
                      />
                      <span>Published (Course is visible publicly in academy and catalog)</span>
                    </label>
                  </div>
                </>
              )}

              {/* TAB 2: LEARNING MODES */}
              {activeTab === 'modes' && (
                <div className="admin-modes-config-grid">
                  {/* Mode 1: ONLINE */}
                  <div className="admin-mode-box card">
                    <div className="admin-mode-box__head">
                      <Globe size={18} />
                      <h4>Online Learning Mode</h4>
                      <label className="admin-switch">
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
                      <div className="admin-mode-box__fields">
                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Online Fee *</label>
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
                              placeholder="e.g. PKR 40,000"
                            />
                          </div>

                          <div className="admin-field">
                            <label>Online Schedule</label>
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
                              placeholder="e.g. Mon, Wed, Fri"
                            />
                          </div>
                        </div>

                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Timings & Timezone</label>
                            <input
                              type="text"
                              value={editingCourse.modes.online.timings || ''}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    online: { ...editingCourse.modes.online, timings: e.target.value },
                                  },
                                })
                              }
                              placeholder="e.g. 7:00 PM - 9:00 PM (PKT)"
                            />
                          </div>

                          <div className="admin-field">
                            <label>Meeting Platform</label>
                            <input
                              type="text"
                              value={editingCourse.modes.online.platform || ''}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    online: { ...editingCourse.modes.online, platform: e.target.value },
                                  },
                                })
                              }
                              placeholder="e.g. Google Meet & Discord"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mode 2: ONSITE */}
                  <div className="admin-mode-box card">
                    <div className="admin-mode-box__head">
                      <MapPin size={18} />
                      <h4>Onsite Campus Learning</h4>
                      <label className="admin-switch">
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
                      <div className="admin-mode-box__fields">
                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Onsite Fee *</label>
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
                              placeholder="e.g. PKR 50,000"
                            />
                          </div>

                          <div className="admin-field">
                            <label>Campus Name</label>
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
                              placeholder="e.g. Vision Giants Innovation Center"
                            />
                          </div>
                        </div>

                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Campus Address & City</label>
                            <input
                              type="text"
                              value={editingCourse.modes.onsite.campusAddress || ''}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    onsite: { ...editingCourse.modes.onsite, campusAddress: e.target.value },
                                  },
                                })
                              }
                              placeholder="e.g. Main Boulevard, Gulberg III, Lahore"
                            />
                          </div>

                          <div className="admin-field">
                            <label>Available Seats Limit</label>
                            <input
                              type="number"
                              value={editingCourse.modes.onsite.availableSeats || 20}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    onsite: { ...editingCourse.modes.onsite, availableSeats: Number(e.target.value) },
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mode 3: HYBRID */}
                  <div className="admin-mode-box card">
                    <div className="admin-mode-box__head">
                      <Layers size={18} />
                      <h4>Hybrid Learning (Online + Campus Labs)</h4>
                      <label className="admin-switch">
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
                      <div className="admin-mode-box__fields">
                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Hybrid Fee *</label>
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
                              placeholder="e.g. PKR 45,000"
                            />
                          </div>

                          <div className="admin-field">
                            <label>Online Sessions Schedule</label>
                            <input
                              type="text"
                              value={editingCourse.modes.hybrid.onlineSchedule || ''}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    hybrid: { ...editingCourse.modes.hybrid, onlineSchedule: e.target.value },
                                  },
                                })
                              }
                              placeholder="e.g. Tue, Thu 8:00 PM - 10:00 PM"
                            />
                          </div>
                        </div>

                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Onsite Lab Schedule</label>
                            <input
                              type="text"
                              value={editingCourse.modes.hybrid.onsiteSchedule || ''}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    hybrid: { ...editingCourse.modes.hybrid, onsiteSchedule: e.target.value },
                                  },
                                })
                              }
                              placeholder="e.g. Saturday 2:00 PM - 6:00 PM"
                            />
                          </div>

                          <div className="admin-field">
                            <label>Session Breakdown / Ratio</label>
                            <input
                              type="text"
                              value={editingCourse.modes.hybrid.sessionBreakdown || ''}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    hybrid: { ...editingCourse.modes.hybrid, sessionBreakdown: e.target.value },
                                  },
                                })
                              }
                              placeholder="e.g. 60% Online Lectures + 40% Practical Labs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mode 4: SELF-PACED */}
                  <div className="admin-mode-box card">
                    <div className="admin-mode-box__head">
                      <PlayCircle size={18} />
                      <h4>Self-Paced Learning (Recorded)</h4>
                      <label className="admin-switch">
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
                      <div className="admin-mode-box__fields">
                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Self-Paced Fee *</label>
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
                              placeholder="e.g. PKR 25,000"
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
                              placeholder="e.g. 12 Months Access"
                            />
                          </div>
                        </div>

                        <div className="grid grid--2">
                          <div className="admin-field">
                            <label>Recorded Lessons Count</label>
                            <input
                              type="number"
                              value={editingCourse.modes.selfPaced.recordedLessonsCount || 0}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    selfPaced: { ...editingCourse.modes.selfPaced, recordedLessonsCount: Number(e.target.value) },
                                  },
                                })
                              }
                            />
                          </div>

                          <div className="admin-field">
                            <label>Learning Resources</label>
                            <input
                              type="text"
                              value={editingCourse.modes.selfPaced.learningResources || ''}
                              onChange={(e) =>
                                setEditingCourse({
                                  ...editingCourse,
                                  modes: {
                                    ...editingCourse.modes,
                                    selfPaced: { ...editingCourse.modes.selfPaced, learningResources: e.target.value },
                                  },
                                })
                              }
                              placeholder="e.g. GitHub repos, cheat sheets, Discord access"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CURRICULUM */}
              {activeTab === 'curriculum' && (
                <div className="admin-curriculum-editor">
                  <div className="admin-curriculum-editor__head">
                    <h4>Course Modules & Syllabus Breakdown</h4>
                    <button type="button" className="btn btn--outline btn--sm" onClick={addModule}>
                      <Plus size={14} /> Add Module
                    </button>
                  </div>

                  <div className="admin-modules-list">
                    {editingCourse.modules.map((mod, modIdx) => (
                      <div key={mod.id || modIdx} className="admin-module-card card">
                        <div className="admin-module-card__head">
                          <strong>Module {modIdx + 1}</strong>
                          <button
                            type="button"
                            className="btn btn--outline btn--sm btn--danger"
                            onClick={() => removeModule(modIdx)}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        <div className="admin-field">
                          <label>Module Title *</label>
                          <input
                            type="text"
                            required
                            value={mod.title}
                            onChange={(e) => {
                              const next = [...editingCourse.modules];
                              next[modIdx].title = e.target.value;
                              setEditingCourse({ ...editingCourse, modules: next });
                            }}
                          />
                        </div>

                        <div className="admin-field">
                          <label>Module Description</label>
                          <input
                            type="text"
                            value={mod.description || ''}
                            onChange={(e) => {
                              const next = [...editingCourse.modules];
                              next[modIdx].description = e.target.value;
                              setEditingCourse({ ...editingCourse, modules: next });
                            }}
                          />
                        </div>

                        <div className="admin-field">
                          <label>Lessons / Topics (One per line)</label>
                          <textarea
                            rows={3}
                            value={mod.lessons?.join('\n') || ''}
                            onChange={(e) => {
                              const next = [...editingCourse.modules];
                              next[modIdx].lessons = e.target.value.split('\n').filter(Boolean);
                              setEditingCourse({ ...editingCourse, modules: next });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-field" style={{ marginTop: 'var(--space-5)' }}>
                    <label>Learning Outcomes (One per line) *</label>
                    <textarea
                      rows={4}
                      value={outcomesStr}
                      onChange={(e) => setOutcomesStr(e.target.value)}
                      placeholder="Build accessible interactive applications&#10;Implement state management architectures&#10;Deploy containerized backends..."
                    />
                  </div>

                  <div className="admin-field">
                    <label>Prerequisites (One per line)</label>
                    <textarea
                      rows={3}
                      value={prereqsStr}
                      onChange={(e) => setPrereqsStr(e.target.value)}
                      placeholder="Basic understanding of computers and browser navigation..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: FAQS & PROJECTS */}
              {activeTab === 'faqs' && (
                <>
                  <div className="admin-field">
                    <label>Practical Projects You Will Build (One per line)</label>
                    <textarea
                      rows={4}
                      value={projectsStr}
                      onChange={(e) => setProjectsStr(e.target.value)}
                      placeholder="E-Commerce Multi-Vendor App&#10;Real-Time Chat Application&#10;Custom SaaS Analytics Dashboard"
                    />
                  </div>

                  <div className="admin-field">
                    <label>Certificate Details</label>
                    <input
                      type="text"
                      value={editingCourse.certificateDetails || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, certificateDetails: e.target.value })}
                      placeholder="e.g. Industry-verified Certificate of Full-Stack Completion with unique QR verification."
                    />
                  </div>

                  <div className="admin-faqs-editor" style={{ marginTop: 'var(--space-5)' }}>
                    <div className="admin-faqs-editor__head">
                      <h4>Course Frequently Asked Questions</h4>
                      <button type="button" className="btn btn--outline btn--sm" onClick={addFaq}>
                        <Plus size={14} /> Add FAQ
                      </button>
                    </div>

                    {editingCourse.faqs.map((faq, fIdx) => (
                      <div key={fIdx} className="admin-faq-box card">
                        <div className="admin-faq-box__head">
                          <strong>FAQ #{fIdx + 1}</strong>
                          <button
                            type="button"
                            className="btn btn--outline btn--sm btn--danger"
                            onClick={() => removeFaq(fIdx)}
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

