import { useState, useEffect, type FormEvent } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Pencil,
  X,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { teamMembers as defaultTeam, type TeamMember } from '../data/team';
import { MediaPickerModal } from './MediaPickerModal';

const firestore = () => import('firebase/firestore/lite');

export function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>(defaultTeam);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const [teamSnap, aboutSnap] = await Promise.all([
        getDoc(doc(db, 'site_content', 'team_members')),
        getDoc(doc(db, 'pages', 'about')),
      ]);

      if (teamSnap.exists() && Array.isArray(teamSnap.data().list)) {
        setMembers(teamSnap.data().list);
      } else if (aboutSnap.exists() && Array.isArray(aboutSnap.data().teamMembers)) {
        setMembers(aboutSnap.data().teamMembers);
      } else {
        setMembers(defaultTeam);
      }
    } catch (err) {
      console.warn('Could not load team members from Firestore, using defaults:', err);
      setMembers(defaultTeam);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (updatedList: TeamMember[]) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const payload = {
        list: updatedList,
        updatedAt: serverTimestamp(),
      };

      // Save to site_content and also sync to pages/about
      await Promise.all([
        setDoc(doc(db, 'site_content', 'team_members'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'team-members'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'about'), { teamMembers: updatedList }, { merge: true }),
      ]);

      setMembers(updatedList);
      setSuccess('Team members synchronized across About Us and Team pages!');
      setTimeout(() => setSuccess(''), 4000);
      setEditingMember(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save team members to database.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (m: TeamMember) => {
    setEditingMember({ ...m, socials: { ...(m.socials || {}) } });
    setIsNew(false);
  };

  const startNew = () => {
    const id = `member-${Date.now()}`;
    const newM: TeamMember = {
      id,
      name: '',
      role: '',
      bio: '',
      image: '',
      socials: { linkedin: 'https://linkedin.com' },
    };
    setEditingMember(newM);
    setIsNew(true);
  };

  const saveEditingMember = (e: FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    let updatedList: TeamMember[];
    if (isNew) {
      updatedList = [...members, editingMember];
    } else {
      updatedList = members.map((m) => (m.id === editingMember.id ? editingMember : m));
    }
    handleSaveAll(updatedList);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete ${name || 'this team member'}?`)) return;
    const updated = members.filter((m) => m.id !== id);
    handleSaveAll(updated);
  };

  const moveMember = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= members.length) return;
    const copy = [...members];
    const temp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = temp;
    handleSaveAll(copy);
  };

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Team & Leadership Management</h1>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary" onClick={startNew}>
            <Plus size={16} style={{ marginRight: 6 }} /> Add Team Member
          </button>
        </div>
      </header>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {success && (
        <p className="alert alert--success">
          <CircleCheck size={18} aria-hidden="true" />
          <span>{success}</span>
        </p>
      )}

      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <LoaderCircle size={28} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
          <p>Loading team members...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.25rem',
                borderRadius: 10,
                position: 'relative',
              }}
            >
              {/* Top Bar with Reorder Arrows */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  Position #{idx + 1}
                </span>
                <div style={{ display: 'flex', gap: 2 }}>
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    style={{ padding: 2 }}
                    disabled={idx === 0}
                    onClick={() => moveMember(idx, 'up')}
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    style={{ padding: 2 }}
                    disabled={idx === members.length - 1}
                    onClick={() => moveMember(idx, 'down')}
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>

              {/* Avatar + Info */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '2px solid #cbd5e1',
                  }}
                >
                  {member.image ? (
                    <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Users size={24} className="text-muted" />
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {member.name || 'Unnamed Member'}
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                    {member.role || 'Designation'}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-muted)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  margin: '0 0 1rem',
                  flex: 1,
                }}
              >
                {member.bio || 'No bio provided.'}
              </p>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '0.75rem',
                }}
              >
                <button type="button" className="btn btn--outline btn--sm" onClick={() => startEdit(member)}>
                  <Pencil size={13} style={{ marginRight: 4 }} /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn--plain btn--sm"
                  onClick={() => handleDelete(member.id, member.name)}
                  style={{ color: '#dc2626' }}
                  title="Delete Member"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Edit Modal */}
      {editingMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="admin-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 23, 48, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setEditingMember(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: 600,
              width: '100%',
              padding: 0,
              borderRadius: 12,
              overflow: 'hidden',
              background: '#fff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                {isNew ? 'Add Team Member' : `Edit ${editingMember.name}`}
              </h3>
              <button
                type="button"
                className="btn btn--plain btn--sm"
                onClick={() => setEditingMember(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveEditingMember} style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Full Name:</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Role / Designation:</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Lead Software Engineer / CTO"
                  className="input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Bio / Description:</label>
                <textarea
                  rows={3}
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Photo / Avatar URL:</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={editingMember.image || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                    placeholder="/team/member.webp or image URL"
                    className="input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => setMediaPickerOpen(true)}
                  >
                    <ImageIcon size={14} style={{ marginRight: 4 }} /> Browse
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Social Profiles:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={editingMember.socials?.linkedin || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socials: { ...editingMember.socials, linkedin: e.target.value },
                      })
                    }
                    className="input"
                  />
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={editingMember.socials?.github || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socials: { ...editingMember.socials, github: e.target.value },
                      })
                    }
                    className="input"
                  />
                  <input
                    type="url"
                    placeholder="Twitter / X URL"
                    value={editingMember.socials?.twitter || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socials: { ...editingMember.socials, twitter: e.target.value },
                      })
                    }
                    className="input"
                  />
                  <input
                    type="url"
                    placeholder="Portfolio / Personal Website"
                    value={editingMember.socials?.website || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socials: { ...editingMember.socials, website: e.target.value },
                      })
                    }
                    className="input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setEditingMember(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => {
            if (editingMember) {
              setEditingMember({ ...editingMember, image: url });
            }
            setMediaPickerOpen(false);
          }}
          currentValue={editingMember?.image}
        />
      )}
    </div>
  );
}
