import { useEffect, useState, type FormEvent } from 'react';
import {
  Users,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { getAdminDb, getAdminStorage } from './firebase';
import { defaultInstructors, type Instructor } from '../data/courses';

const firestore = () => import('firebase/firestore/lite');
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'];

export function InstructorsManager() {
  const [instructors, setInstructors] = useState<Instructor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingInst, setEditingInst] = useState<Instructor | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [skillsStr, setSkillsStr] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDocs(collection(db, 'instructors'));

      if (snap.empty) {
        setInstructors(defaultInstructors);
      } else {
        const list: Instructor[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || ''),
            photo: String(data.photo || ''),
            designation: String(data.designation || ''),
            experience: String(data.experience || ''),
            skills: Array.isArray(data.skills) ? data.skills.filter((x): x is string => typeof x === 'string') : [],
            bio: String(data.bio || ''),
            linkedinUrl: String(data.linkedinUrl || ''),
            email: String(data.email || ''),
          };
        });
        setInstructors(list);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load instructors from database. Using local defaults.');
      setInstructors(defaultInstructors);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (listToSave: Instructor[]) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const [db, { doc, writeBatch, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);

      listToSave.forEach((inst) => {
        const ref = doc(db, 'instructors', inst.id);
        batch.set(
          ref,
          {
            name: inst.name.trim(),
            photo: inst.photo || '',
            designation: inst.designation.trim(),
            experience: inst.experience.trim(),
            skills: inst.skills || [],
            bio: inst.bio.trim(),
            linkedinUrl: inst.linkedinUrl || '',
            email: inst.email || '',
            active: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      setInstructors(listToSave);
      setSuccess('Instructors updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save instructors. Check admin permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      setPhotoError('Please select a valid image file (PNG, WebP, JPEG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size must be under 5MB.');
      return;
    }

    setUploadingPhoto(true);
    setPhotoError('');
    try {
      const [storage, { ref, uploadBytes, getDownloadURL }] = await Promise.all([
        getAdminStorage(),
        import('firebase/storage'),
      ]);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileRef = ref(storage, `content/instructors/${Date.now()}-${cleanName}`);
      await uploadBytes(fileRef, file, { contentType: file.type });
      const downloadUrl = await getDownloadURL(fileRef);

      if (editingInst) {
        setEditingInst({ ...editingInst, photo: downloadUrl });
      }
    } catch (err) {
      console.error(err);
      setPhotoError('Upload failed. Check Storage permissions.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingInst({
      id: `inst-${Date.now()}`,
      name: '',
      photo: '',
      designation: 'Senior Instructor',
      experience: '5+ Years Experience',
      skills: [],
      bio: '',
      linkedinUrl: '',
      email: '',
    });
    setSkillsStr('');
  };

  const handleOpenEdit = (inst: Instructor) => {
    setIsNew(false);
    setEditingInst(inst);
    setSkillsStr(inst.skills?.join(', ') || '');
  };

  const handleSaveModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingInst || !editingInst.name.trim()) return;

    const parsedSkills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const completed = { ...editingInst, skills: parsedSkills };

    let updatedList = [...(instructors || [])];
    if (isNew) {
      updatedList.push(completed);
    } else {
      updatedList = updatedList.map((i) => (i.id === completed.id ? completed : i));
    }

    setInstructors(updatedList);
    setEditingInst(null);
    handleSaveAll(updatedList);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this instructor?')) return;
    const updated = (instructors || []).filter((i) => i.id !== id);
    setInstructors(updated);

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'instructors', id));
      handleSaveAll(updated);
    } catch {
      handleSaveAll(updated);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoaderCircle size={24} className="spin" />
          <span>Loading instructor profiles…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Instructors & Mentors</h1>
          <p className="admin-page__sub">Manage faculty members, credentials, and course assignments.</p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Instructor
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
                <th style={{ width: 80 }}>Photo</th>
                <th>Instructor Name</th>
                <th>Designation</th>
                <th>Experience</th>
                <th>LinkedIn</th>
                <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors && instructors.length > 0 ? (
                instructors.map((inst) => (
                  <tr key={inst.id}>
                    <td>
                      <div className="admin-instructor-photo-preview">
                        {inst.photo ? (
                          <img src={inst.photo} alt={inst.name} />
                        ) : (
                          <Users size={20} className="muted" />
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{inst.name}</strong>
                    </td>
                    <td>{inst.designation}</td>
                    <td>{inst.experience}</td>
                    <td>
                      {inst.linkedinUrl ? (
                        <a href={inst.linkedinUrl} target="_blank" rel="noopener noreferrer" className="admin-link">
                          Profile <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        style={{ marginRight: 6 }}
                        onClick={() => handleOpenEdit(inst)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm btn--danger"
                        onClick={() => handleDelete(inst.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="admin-table-empty">
                    No instructors added yet. Click &quot;Add Instructor&quot; to create a profile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingInst && (
        <div className="admin-modal-backdrop" onClick={() => setEditingInst(null)}>
          <div className="admin-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <h2>{isNew ? 'Add Instructor' : `Edit: ${editingInst.name}`}</h2>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setEditingInst(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="admin-modal__form">
              <div className="admin-field">
                <label>Instructor Name *</label>
                <input
                  type="text"
                  required
                  value={editingInst.name}
                  onChange={(e) => setEditingInst({ ...editingInst, name: e.target.value })}
                  placeholder="e.g. Muhammad Rayan Masood"
                />
              </div>

              <div className="grid grid--2">
                <div className="admin-field">
                  <label>Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingInst.designation}
                    onChange={(e) => setEditingInst({ ...editingInst, designation: e.target.value })}
                    placeholder="e.g. Principal Software Engineer"
                  />
                </div>

                <div className="admin-field">
                  <label>Experience Label *</label>
                  <input
                    type="text"
                    required
                    value={editingInst.experience}
                    onChange={(e) => setEditingInst({ ...editingInst, experience: e.target.value })}
                    placeholder="e.g. 6+ Years Experience"
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Key Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="React, TypeScript, Node.js, System Architecture"
                />
              </div>

              <div className="admin-field">
                <label>Short Biography</label>
                <textarea
                  rows={3}
                  value={editingInst.bio}
                  onChange={(e) => setEditingInst({ ...editingInst, bio: e.target.value })}
                  placeholder="Brief background on production experience and teaching philosophy..."
                />
              </div>

              <div className="admin-field">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={editingInst.linkedinUrl || ''}
                  onChange={(e) => setEditingInst({ ...editingInst, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="admin-field">
                <label>Profile Picture</label>
                <div className="admin-logo-upload-wrap">
                  {editingInst.photo ? (
                    <div className="admin-logo-current">
                      <img src={editingInst.photo} alt="Photo preview" />
                      <button
                        type="button"
                        className="btn btn--outline btn--sm btn--danger"
                        onClick={() => setEditingInst({ ...editingInst, photo: '' })}
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div className="admin-logo-upload-box">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        id="inst-photo-input"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file);
                        }}
                      />
                      <label htmlFor="inst-photo-input" className="btn btn--outline btn--sm">
                        {uploadingPhoto ? (
                          <>
                            <LoaderCircle size={15} className="spin" /> Uploading…
                          </>
                        ) : (
                          <>
                            <Upload size={15} /> Upload Photo
                          </>
                        )}
                      </label>
                    </div>
                  )}
                  {photoError && <span className="field__error">{photoError}</span>}
                </div>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setEditingInst(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving || uploadingPhoto}>
                  {saving ? 'Saving…' : 'Save Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

