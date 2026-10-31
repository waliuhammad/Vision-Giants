import { useEffect, useState, type FormEvent } from 'react';
import {
  Briefcase,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Clock,
  MapPin,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultPositions, type Position, type EmploymentType, type WorkArrangement } from '../data/careers';

const firestore = () => import('firebase/firestore/lite');

export function CareersManager() {
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingJob, setEditingJob] = useState<Position | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form helper strings for multiline / tag inputs
  const [skillsStr, setSkillsStr] = useState('');
  const [responsibilitiesStr, setResponsibilitiesStr] = useState('');
  const [qualificationsStr, setQualificationsStr] = useState('');

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs, query, orderBy }] = await Promise.all([getAdminDb(), firestore()]);
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
            responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities.filter((x): x is string => typeof x === 'string') : [],
            skills: Array.isArray(data.skills) ? data.skills.filter((x): x is string => typeof x === 'string') : [],
            qualifications: Array.isArray(data.qualifications) ? data.qualifications.filter((x): x is string => typeof x === 'string') : [],
            deadline: String(data.deadline || ''),
            salaryRange: String(data.salaryRange || ''),
            applicationInstructions: String(data.applicationInstructions || ''),
            published: data.published !== false,
            order: typeof data.order === 'number' ? data.order : 0,
            isInternship: data.isInternship === true,
          };
        });
        setPositions(list);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load jobs from database. Using local defaults.');
      setPositions(defaultPositions);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (listToSave: Position[]) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const [db, { doc, writeBatch, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);

      listToSave.forEach((job, idx) => {
        const ref = doc(db, 'positions', job.id);
        batch.set(
          ref,
          {
            title: job.title.trim(),
            department: job.department.trim(),
            type: job.type,
            location: job.location.trim(),
            workArrangement: job.workArrangement,
            experience: job.experience,
            summary: job.summary.trim(),
            description: job.description?.trim() || '',
            responsibilities: job.responsibilities || [],
            skills: job.skills || [],
            qualifications: job.qualifications || [],
            deadline: job.deadline || '',
            salaryRange: job.salaryRange || '',
            applicationInstructions: job.applicationInstructions || '',
            published: job.published !== false,
            order: idx + 1,
            isInternship: job.type === 'Internship' || job.isInternship === true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      setPositions(listToSave);
      setSuccess('Job positions updated successfully! Changes are live.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save jobs to Firestore. Check permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    const newJob: Position = {
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
      salaryRange: '',
      applicationInstructions: '',
      published: true,
      order: (positions?.length || 0) + 1,
      isInternship: false,
    };
    setEditingJob(newJob);
    setSkillsStr('');
    setResponsibilitiesStr('');
    setQualificationsStr('');
  };

  const handleOpenEdit = (job: Position) => {
    setIsNew(false);
    setEditingJob(job);
    setSkillsStr(job.skills?.join(', ') || '');
    setResponsibilitiesStr(job.responsibilities?.join('\n') || '');
    setQualificationsStr(job.qualifications?.join('\n') || '');
  };

  const handleSaveModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.title.trim()) return;

    const parsedSkills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedResponsibilities = responsibilitiesStr
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    const parsedQualifications = qualificationsStr
      .split('\n')
      .map((q) => q.trim())
      .filter(Boolean);

    const completedJob: Position = {
      ...editingJob,
      skills: parsedSkills,
      responsibilities: parsedResponsibilities,
      qualifications: parsedQualifications,
      isInternship: editingJob.type === 'Internship',
    };

    let updatedList = [...(positions || [])];
    if (isNew) {
      updatedList.push(completedJob);
    } else {
      updatedList = updatedList.map((j) => (j.id === completedJob.id ? completedJob : j));
    }

    setPositions(updatedList);
    setEditingJob(null);
    handleSaveAll(updatedList);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    const updated = (positions || []).filter((j) => j.id !== id);
    setPositions(updated);

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'positions', id));
      handleSaveAll(updated);
    } catch {
      handleSaveAll(updated);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!positions) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= positions.length) return;
    const next = [...positions];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setPositions(next);
    handleSaveAll(next);
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
          <h1>Careers & Job Postings</h1>
          <p className="admin-page__sub">
            Create, publish, and manage job vacancies displayed on the public Careers page.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenAdd}>
            <Plus size={16} /> Post New Job
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
                <th style={{ width: 80 }}>Order</th>
                <th>Role & Department</th>
                <th>Type & Arrangement</th>
                <th>Experience</th>
                <th>Deadline</th>
                <th style={{ width: 100 }}>Status</th>
                <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions && positions.length > 0 ? (
                positions.map((job, idx) => (
                  <tr key={job.id}>
                    <td>
                      <div className="admin-order-btns">
                        <button
                          type="button"
                          className="btn-icon"
                          disabled={idx === 0}
                          onClick={() => moveItem(idx, 'up')}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <span>{idx + 1}</span>
                        <button
                          type="button"
                          className="btn-icon"
                          disabled={idx === positions.length - 1}
                          onClick={() => moveItem(idx, 'down')}
                        >
                          <ArrowDown size={14} />
                        </button>
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
                        {job.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        style={{ marginRight: 6 }}
                        onClick={() => handleOpenEdit(job)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm btn--danger"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    No open positions posted. Click &quot;Post New Job&quot; to publish a vacancy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JOB EDIT / CREATE MODAL */}
      {editingJob && (
        <div className="admin-modal-backdrop" onClick={() => setEditingJob(null)}>
          <div className="admin-modal admin-modal--large card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <h2>{isNew ? 'Post New Position' : `Edit: ${editingJob.title}`}</h2>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setEditingJob(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="admin-modal__form">
              <div className="grid grid--2">
                <div className="admin-field">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>

                <div className="admin-field">
                  <label>Department *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.department}
                    onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                    placeholder="e.g. Engineering / Design / QA"
                  />
                </div>
              </div>

              <div className="grid grid--3">
                <div className="admin-field">
                  <label>Employment Type *</label>
                  <select
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

                <div className="admin-field">
                  <label>Work Arrangement *</label>
                  <select
                    value={editingJob.workArrangement}
                    onChange={(e) => setEditingJob({ ...editingJob, workArrangement: e.target.value as WorkArrangement })}
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="admin-field">
                  <label>Experience Level *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.experience}
                    onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                    placeholder="e.g. Junior / Mid-Level / Senior"
                  />
                </div>
              </div>

              <div className="grid grid--3">
                <div className="admin-field">
                  <label>Location *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    placeholder="e.g. Lahore, Pakistan"
                  />
                </div>

                <div className="admin-field">
                  <label>Salary Range (optional)</label>
                  <input
                    type="text"
                    value={editingJob.salaryRange || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salaryRange: e.target.value })}
                    placeholder="e.g. Market competitive / PKR 150k-250k"
                  />
                </div>

                <div className="admin-field">
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    value={editingJob.deadline || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Summary (shown on job card) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingJob.summary}
                  onChange={(e) => setEditingJob({ ...editingJob, summary: e.target.value })}
                  placeholder="One or two sentences summarizing the mission and core focus of the role..."
                />
              </div>

              <div className="admin-field">
                <label>Full Role Description</label>
                <textarea
                  rows={4}
                  value={editingJob.description || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  placeholder="Detailed breakdown of the role context, team background, and daily objectives..."
                />
              </div>

              <div className="admin-field">
                <label>Key Responsibilities (One per line)</label>
                <textarea
                  rows={4}
                  value={responsibilitiesStr}
                  onChange={(e) => setResponsibilitiesStr(e.target.value)}
                  placeholder="Architect, develop, and maintain web apps&#10;Conduct rigorous code reviews&#10;Collaborate with product designers..."
                />
              </div>

              <div className="admin-field">
                <label>Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
                />
              </div>

              <div className="admin-field">
                <label>Qualifications & Experience Requirements (One per line)</label>
                <textarea
                  rows={4}
                  value={qualificationsStr}
                  onChange={(e) => setQualificationsStr(e.target.value)}
                  placeholder="Bachelor's in Computer Science or equivalent&#10;3+ years of professional web development experience&#10;Solid understanding of relational databases..."
                />
              </div>

              <div className="admin-field">
                <label>Application Instructions (optional)</label>
                <input
                  type="text"
                  value={editingJob.applicationInstructions || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, applicationInstructions: e.target.value })}
                  placeholder="e.g. Include links to your GitHub or live project demos."
                />
              </div>

              <div className="admin-field admin-field--checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={editingJob.published}
                    onChange={(e) => setEditingJob({ ...editingJob, published: e.target.checked })}
                  />
                  <span>Published (Visible publicly in open positions on the Careers page)</span>
                </label>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setEditingJob(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

