import { useEffect, useState, type FormEvent } from 'react';
import {
  Briefcase,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  GripVertical,
  LayoutTemplate,
  LoaderCircle,
  MessageSquareQuote,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultPositions, type Position, type EmploymentType, type WorkArrangement } from '../data/careers';
import {
  defaultCareersPageData,
  careersPageDataFromDoc,
  type CareersPageData,
  type CareersTestimonial,
} from '../content/careersPageData';

const firestore = () => import('firebase/firestore/lite');

export function CareersManager() {
  const [activeTab, setActiveTab] = useState<'positions' | 'content' | 'testimonials'>('positions');

  // Positions state
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing job state
  const [editingJob, setEditingJob] = useState<Position | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  // Form helper strings for multiline / tag inputs
  const [skillsStr, setSkillsStr] = useState('');
  const [responsibilitiesStr, setResponsibilitiesStr] = useState('');
  const [qualificationsStr, setQualificationsStr] = useState('');

  // Careers Page Content state
  const [pageContent, setPageContent] = useState<CareersPageData>(defaultCareersPageData);
  const [contentSaving, setContentSaving] = useState(false);

  // Testimonial modal state
  const [editingTestimonial, setEditingTestimonial] = useState<CareersTestimonial | null>(null);
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

      // 1. Load Positions
      const snap = await getDocs(query(collection(db, 'positions'), orderBy('order', 'asc')));
      if (snap.empty) {
        setPositions(defaultPositions);
      } else {
        const list: Position[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: String(data.title || ''),
            department: String(data.department || 'Engineering'),
            type: String(data.type || 'Full-Time'),
            location: String(data.location || 'Lahore, Pakistan'),
            workArrangement: String(data.workArrangement || 'Hybrid'),
            experience: String(data.experience || 'Mid-Level'),
            summary: String(data.summary || ''),
            description: String(data.description || ''),
            responsibilities: Array.isArray(data.responsibilities)
              ? data.responsibilities.filter((x): x is string => typeof x === 'string')
              : [],
            skills: Array.isArray(data.skills)
              ? data.skills.filter((x): x is string => typeof x === 'string')
              : [],
            qualifications: Array.isArray(data.qualifications)
              ? data.qualifications.filter((x): x is string => typeof x === 'string')
              : [],
            deadline: String(data.deadline || ''),
            salaryRange: String(data.salaryRange || ''),
            applicationInstructions: String(data.applicationInstructions || ''),
            published: data.published !== false,
            order: Number(data.order) || 0,
            isInternship: data.isInternship === true,
          };
        });
        setPositions(list);
      }

      // 2. Load Page Content
      const pageSnap = await getDoc(doc(db, 'pages', 'careers'));
      if (pageSnap.exists()) {
        setPageContent(careersPageDataFromDoc(pageSnap.data()));
      }
    } catch (err) {
      console.error(err);
      setError('Could not load careers data from Firestore; displaying defaults.');
      setPositions(defaultPositions);
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
      await setDoc(doc(db, 'pages', 'careers'), pageContent, { merge: true });
      setSuccess('Careers page layout and sections saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save page sections. Please check permissions.');
    } finally {
      setContentSaving(false);
    }
  };

  const updatePageContent = (patch: Partial<CareersPageData>) => {
    setPageContent((prev) => ({ ...prev, ...patch }));
  };

  const updateStat = (index: number, patch: { value?: string; label?: string }) => {
    const next = [...pageContent.stats];
    next[index] = { ...next[index], ...patch };
    updatePageContent({ stats: next });
  };

  const updateTrack = (index: number, patch: { title?: string; description?: string }) => {
    const next = [...pageContent.tracks];
    next[index] = { ...next[index], ...patch };
    updatePageContent({ tracks: next });
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

    let updatedList: CareersTestimonial[];
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
    if (!window.confirm('Delete this team testimonial?')) return;
    updatePageContent({
      testimonials: pageContent.testimonials.filter((t) => t.id !== id),
    });
  };

  // ---------------- Positions Drag & Drop Reordering ----------------
  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!positions || fromIndex === toIndex) return;
    const next = [...positions];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setPositions(next);
    handleSaveAllPositions(next);
  };

  const handleSaveAllPositions = async (updatedList: Position[]) => {
    setSaving(true);
    setError('');
    try {
      const [db, { doc, writeBatch }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);

      updatedList.forEach((pos, idx) => {
        const ref = doc(db, 'positions', pos.id);
        batch.set(
          ref,
          {
            ...pos,
            order: (idx + 1) * 10,
          },
          { merge: true }
        );
      });

      await batch.commit();
      setSuccess('Job vacancies updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to persist job order to database.');
    } finally {
      setSaving(false);
    }
  };

  // ---------------- Individual Position Handlers ----------------
  const handleOpenAdd = () => {
    setIsNew(true);
    const newPos: Position = {
      id: `job-${Date.now()}`,
      title: '',
      department: 'Engineering',
      type: 'Full-Time',
      location: 'Lahore, Pakistan',
      workArrangement: 'Hybrid',
      experience: 'Mid-Level',
      summary: '',
      description: '',
      responsibilities: [],
      skills: [],
      qualifications: [],
      deadline: '',
      salaryRange: 'Market competitive',
      applicationInstructions: '',
      published: true,
      order: (positions?.length || 0) + 1,
      isInternship: false,
    };
    setEditingJob(newPos);
    setSkillsStr('');
    setResponsibilitiesStr('');
    setQualificationsStr('');
  };

  const handleOpenEdit = (job: Position) => {
    setIsNew(false);
    setEditingJob({ ...job });
    setSkillsStr((job.skills || []).join(', '));
    setResponsibilitiesStr((job.responsibilities || []).join('\n'));
    setQualificationsStr((job.qualifications || []).join('\n'));
  };

  const handleSaveJob = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    if (!editingJob.title.trim()) {
      setError('Please provide a job title.');
      return;
    }
    if (!editingJob.summary.trim()) {
      setError('Please provide a short summary for this job.');
      return;
    }

    const cleanedJob: Position = {
      ...editingJob,
      skills: skillsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      responsibilities: responsibilitiesStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      qualifications: qualificationsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setSaving(true);
    setError('');
    try {
      const [db, { doc, setDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await setDoc(doc(db, 'positions', cleanedJob.id), cleanedJob, { merge: true });

      const current = positions || [];
      const updated = isNew
        ? [...current, cleanedJob]
        : current.map((p) => (p.id === cleanedJob.id ? cleanedJob : p));

      setPositions(updated);
      setEditingJob(null);
      setSuccess(isNew ? 'New job position posted!' : 'Job vacancy updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save job position. Check Firebase rules.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job vacancy? This cannot be undone.')) return;
    if (!positions) return;

    const updated = positions.filter((p) => p.id !== id);
    setPositions(updated);

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'positions', id));
      handleSaveAllPositions(updated);
    } catch {
      handleSaveAllPositions(updated);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoaderCircle size={24} className="spin" />
          <span>Loading career listings…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Careers & Culture Management</h1>
          <p className="admin-page__sub">
            Manage job vacancies, hero headline, impact statistics, and team testimonials matching the reference layout.
          </p>
        </div>
        <div className="admin-actions">
          <a className="btn btn--outline btn--sm" href="/careers/" target="_blank" rel="noopener noreferrer">
            View Live Careers Page <ExternalLink size={14} />
          </a>
          {activeTab === 'positions' && (
            <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenAdd}>
              <Plus size={15} /> Post New Vacancy
            </button>
          )}
          {activeTab !== 'positions' && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleSavePageContent}
              disabled={contentSaving}
            >
              {contentSaving ? <LoaderCircle size={15} className="spin" /> : <Save size={15} />}
              <span>Save Page Sections</span>
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-modal-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'positions' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('positions')}
        >
          <Briefcase size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
          Job Openings ({positions?.length || 0})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'content' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <LayoutTemplate size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
          Hero, Stats & Why Us Sections
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'testimonials' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          <MessageSquareQuote size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
          Team Stories ({pageContent.testimonials.length})
        </button>
      </div>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} />
          <span>{error}</span>
        </p>
      )}

      {success && (
        <p className="alert alert--success">
          <CircleCheck size={18} />
          <span>{success}</span>
        </p>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: JOB OPENINGS (WITH DRAG & DROP REORDERING) */}
      {/* ========================================================================= */}
      {activeTab === 'positions' && (
        <div className="admin-table-card card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 80, textAlign: 'center' }}>Position</th>
                  <th>Job Title & Department</th>
                  <th>Type & Mode</th>
                  <th>Experience</th>
                  <th>Deadline</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions && positions.length > 0 ? (
                  positions.map((job, idx) => (
                    <tr
                      key={job.id}
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
                        <strong>{job.title}</strong>
                        <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
                          {job.department} · {job.location}
                        </p>
                      </td>
                      <td>
                        <span className="badge badge--neutral">{job.type}</span>
                        <span className="muted" style={{ marginLeft: 6, fontSize: '0.85rem' }}>
                          {job.workArrangement}
                        </span>
                      </td>
                      <td>{job.experience}</td>
                      <td>{job.deadline || <span className="muted">Rolling</span>}</td>
                      <td>
                        <span className={`badge ${job.published ? 'badge--primary' : 'badge--neutral'}`}>
                          {job.published ? 'Published' : 'Hidden'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleOpenEdit(job)}
                          title="Edit Position"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon admin-danger"
                          onClick={() => handleDeleteJob(job.id)}
                          title="Delete Position"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="admin-table-empty">
                      No open positions listed yet. Click “Post New Vacancy” to publish one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HERO & PAGE SECTIONS (MATCHING PICTURE LAYOUT) */}
      {/* ========================================================================= */}
      {activeTab === 'content' && (
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          {/* 1. Hero Section */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>1. Hero Section</h2>
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
                <label>Title Line 1 (Dark Text)</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroTitleLine1}
                  onChange={(e) => updatePageContent({ heroTitleLine1: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Title Line 2 (Colored Accent Text)</label>
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
                <label>Floating Badge Years (e.g. 10+)</label>
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
                <label>Social Proof Count (e.g. 50+)</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.heroSocialProofCount}
                  onChange={(e) => updatePageContent({ heroSocialProofCount: e.target.value })}
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
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>2. Full-Width Navy Stats Ribbon</h2>
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

          {/* 3. Top Career Tracks */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>3. Top Career Tracks Cards (5 Cards)</h2>
            <div className="grid grid--2">
              <div className="field">
                <label>Section Eyebrow</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.tracksEyebrow}
                  onChange={(e) => updatePageContent({ tracksEyebrow: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Section Title</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.tracksHeading}
                  onChange={(e) => updatePageContent({ tracksHeading: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
              {pageContent.tracks.map((track, idx) => (
                <div
                  key={track.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
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
                    value={track.title}
                    onChange={(e) => updateTrack(idx, { title: e.target.value })}
                  />
                  <input
                    type="text"
                    className="input"
                    value={track.description}
                    onChange={(e) => updateTrack(idx, { description: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Why Work With Us Section */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>4. “We Don’t Just Hire, We Build Futures” Section</h2>
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
                <label>Left Image URL</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.whyImage}
                  onChange={(e) => updatePageContent({ whyImage: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Floating Amber Badge Text</label>
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

          {/* 5. Bottom Call to Action Banner */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>5. Bottom Call to Action Ribbon</h2>
            <div className="grid grid--2">
              <div className="field">
                <label>CTA Title</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.ctaHeading}
                  onChange={(e) => updatePageContent({ ctaHeading: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Button Label</label>
                <input
                  type="text"
                  className="input"
                  value={pageContent.ctaButtonText}
                  onChange={(e) => updatePageContent({ ctaButtonText: e.target.value })}
                />
              </div>
            </div>
            <div className="field" style={{ marginTop: '12px' }}>
              <label>CTA Subtitle</label>
              <input
                type="text"
                className="input"
                value={pageContent.ctaDescription}
                onChange={(e) => updatePageContent({ ctaDescription: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEAM STORIES & TESTIMONIALS */}
      {/* ========================================================================= */}
      {activeTab === 'testimonials' && (
        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Team & Student Success Stories</h2>
              <p className="muted" style={{ fontSize: '0.88rem', margin: '4px 0 0' }}>
                Add genuine team feedback quotes with names, roles, and profile pictures.
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
                  role: 'Software Engineer',
                  quote: '',
                  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                });
              }}
            >
              <Plus size={15} /> Add Testimonial
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
                        {t.role}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.55 }}>
                    “{t.quote}”
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '14px' }}>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => {
                      setIsNewTestimonial(false);
                      setEditingTestimonial({ ...t });
                    }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon admin-danger"
                    onClick={() => handleDeleteTestimonial(t.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: EDIT JOB POSITION */}
      {editingJob && (
        <div className="admin-modal-backdrop" onClick={() => setEditingJob(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h2>{isNew ? 'Post New Career Opportunity' : `Edit: ${editingJob.title}`}</h2>
              <button type="button" className="btn-icon" onClick={() => setEditingJob(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveJob}>
              <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="grid grid--2">
                  <div className="field">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      className="input"
                      value={editingJob.title}
                      onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                      placeholder="e.g. Senior Full-Stack Engineer"
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Department *</label>
                    <input
                      type="text"
                      className="input"
                      value={editingJob.department}
                      onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                      placeholder="e.g. Engineering, Mobile, Design"
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Employment Type</label>
                    <select
                      className="input"
                      value={editingJob.type}
                      onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value as EmploymentType })}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Work Arrangement</label>
                    <select
                      className="input"
                      value={editingJob.workArrangement}
                      onChange={(e) =>
                        setEditingJob({ ...editingJob, workArrangement: e.target.value as WorkArrangement })
                      }
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Location</label>
                    <input
                      type="text"
                      className="input"
                      value={editingJob.location}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                      placeholder="e.g. Lahore, Pakistan"
                    />
                  </div>
                  <div className="field">
                    <label>Experience Level</label>
                    <input
                      type="text"
                      className="input"
                      value={editingJob.experience}
                      onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                      placeholder="e.g. Junior, Mid-Level, Senior"
                    />
                  </div>
                </div>

                <div className="field" style={{ marginTop: '12px' }}>
                  <label>Short Summary (Shown on Job Card) *</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={editingJob.summary}
                    onChange={(e) => setEditingJob({ ...editingJob, summary: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of the role..."
                    required
                  />
                </div>

                <div className="field" style={{ marginTop: '12px' }}>
                  <label>Full Description (Detailed View)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={editingJob.description || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    placeholder="Comprehensive job overview..."
                  />
                </div>

                <div className="field" style={{ marginTop: '12px' }}>
                  <label>Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                  />
                </div>

                <div className="grid grid--2" style={{ marginTop: '12px' }}>
                  <div className="field">
                    <label>Key Responsibilities (One per line)</label>
                    <textarea
                      className="input"
                      rows={4}
                      value={responsibilitiesStr}
                      onChange={(e) => setResponsibilitiesStr(e.target.value)}
                      placeholder="Build modular interfaces&#10;Optimize database queries&#10;Lead sprint planning"
                    />
                  </div>
                  <div className="field">
                    <label>Qualifications (One per line)</label>
                    <textarea
                      className="input"
                      rows={4}
                      value={qualificationsStr}
                      onChange={(e) => setQualificationsStr(e.target.value)}
                      placeholder="3+ years professional experience&#10;Strong problem solving skills"
                    />
                  </div>
                </div>

                <div className="grid grid--2" style={{ marginTop: '12px' }}>
                  <div className="field">
                    <label>Salary Range / Compensation</label>
                    <input
                      type="text"
                      className="input"
                      value={editingJob.salaryRange || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, salaryRange: e.target.value })}
                      placeholder="e.g. Market competitive / PKR 150k - 250k"
                    />
                  </div>
                  <div className="field">
                    <label>Application Deadline</label>
                    <input
                      type="date"
                      className="input"
                      value={editingJob.deadline || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingJob.published}
                      onChange={(e) => setEditingJob({ ...editingJob, published: e.target.checked })}
                    />
                    <span>Publish publicly on Careers Page</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingJob.isInternship}
                      onChange={(e) => setEditingJob({ ...editingJob, isInternship: e.target.checked })}
                    />
                    <span>Mark as Internship Program</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-foot">
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditingJob(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                  {saving ? <LoaderCircle size={15} className="spin" /> : <Save size={15} />}
                  <span>{isNew ? 'Post Vacancy' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TESTIMONIAL */}
      {editingTestimonial && (
        <div className="admin-modal-backdrop" onClick={() => setEditingTestimonial(null)}>
          <div className="admin-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h2>{isNewTestimonial ? 'Add Team Testimonial' : 'Edit Testimonial'}</h2>
              <button type="button" className="btn-icon" onClick={() => setEditingTestimonial(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial}>
              <div className="admin-modal-body">
                <div className="field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    required
                  />
                </div>
                <div className="field" style={{ marginTop: '10px' }}>
                  <label>Role / Position *</label>
                  <input
                    type="text"
                    className="input"
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    required
                  />
                </div>
                <div className="field" style={{ marginTop: '10px' }}>
                  <label>Profile Picture URL *</label>
                  <input
                    type="text"
                    className="input"
                    value={editingTestimonial.photo}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, photo: e.target.value })}
                    required
                  />
                </div>
                <div className="field" style={{ marginTop: '10px' }}>
                  <label>Quote / Feedback *</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={editingTestimonial.quote}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-modal-foot">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setEditingTestimonial(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--sm">
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
