import { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Copy,
  Check,
} from 'lucide-react';
import { getAdminDb, useAdminAuth } from './firebase';

const firestore = () => import('firebase/firestore/lite');

interface AdminRecord {
  id: string;
  email: string;
  role: 'Super Admin' | 'Content Editor' | 'Moderator';
  status: 'Active' | 'Invited';
  createdAt?: string;
}

const DEFAULT_ADMINS: AdminRecord[] = [
  {
    id: 'uid-admin-master-01',
    email: 'admin@visiongiants.com',
    role: 'Super Admin',
    status: 'Active',
    createdAt: 'Initial Setup',
  },
  {
    id: 'uid-admin-lead-editor',
    email: 'editor@visiongiants.com',
    role: 'Content Editor',
    status: 'Active',
    createdAt: 'Initial Setup',
  },
];

export function UsersManager() {
  const auth = useAdminAuth();
  const [admins, setAdmins] = useState<AdminRecord[]>(DEFAULT_ADMINS);
  const [newUid, setNewUid] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Content Editor'>('Super Admin');
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [copiedUid, setCopiedUid] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAdmins() {
      try {
        const [db, { collection, getDocs }] = await Promise.all([getAdminDb(), firestore()]);
        const snap = await getDocs(collection(db, 'admins'));
        if (!active) return;

        if (!snap.empty) {
          const loaded: AdminRecord[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              email: data.email || 'Authorized Administrator',
              role: data.role || 'Super Admin',
              status: 'Active',
              createdAt: data.createdAtStr || 'Verified in Firestore',
            };
          });
          setAdmins(loaded);
        }
      } catch (err) {
        console.warn('Could not load admins from Firestore, displaying default list:', err);
      }
    }

    loadAdmins();
    return () => {
      active = false;
    };
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUid.trim()) {
      setError('Please provide the Firebase Authentication User ID (UID).');
      return;
    }

    setAdding(true);
    setError('');
    setSuccess('');

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      await setDoc(
        doc(db, 'admins', newUid.trim()),
        {
          uid: newUid.trim(),
          email: newEmail.trim() || 'Admin User',
          role: newRole,
          createdAt: serverTimestamp(),
          createdAtStr: new Date().toLocaleDateString(),
        },
        { merge: true }
      );

      setAdmins((prev) => [
        ...prev,
        {
          id: newUid.trim(),
          email: newEmail.trim() || 'Admin User',
          role: newRole,
          status: 'Active',
          createdAt: 'Just now',
        },
      ]);

      setSuccess(`Admin UID ${newUid.trim()} successfully registered in Firestore!`);
      setNewUid('');
      setNewEmail('');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to write admin record to Firestore.');
    } finally {
      setAdding(false);
    }
  };

  const copyCurrentUid = () => {
    if (auth.status === 'admin' && auth.user?.uid) {
      navigator.clipboard.writeText(auth.user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="admin-page" style={{ maxWidth: 1200, margin: '0 auto', gap: '2rem' }}>
      {/* Page Header */}
      <div className="admin-page__head">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: '0.5rem' }}>
            <ShieldCheck size={13} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase' }}>
              Role-Based Access Control
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
            User & Administrator Management
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Manage authorized staff members, roles, and administrative security credentials.
          </p>
        </div>
      </div>

      {/* Current User Card */}
      {auth.status === 'admin' && (
        <div
          className="card"
          style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 36, 72, 0.4) 100%)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase' }}>
              Currently Signed-in Account
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0 0.5rem', color: '#ffffff' }}>
              {auth.user.email}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#94a3b8' }}>
              <span>Firebase UID:</span>
              <code style={{ background: '#0f172a', padding: '2px 8px', borderRadius: 4, color: '#e2e8f0', fontSize: '0.8rem' }}>
                {auth.user.uid}
              </code>
              <button
                type="button"
                onClick={copyCurrentUid}
                className="btn btn--plain btn--sm"
                style={{ padding: '2px 6px', color: '#38bdf8' }}
                title="Copy UID"
              >
                {copiedUid ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              background: '#10b981',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Shield size={15} /> Super Administrator
          </span>
        </div>
      )}

      {/* Grid: Existing Admins Table (Left) + Add Admin UID Form (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Table of Admins */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} style={{ color: '#2563eb' }} />
            <span>Authorized Administrators ({admins.length})</span>
          </h3>

          <div style={{ display: 'grid', gap: '0.85rem' }}>
            {admins.map((admin) => (
              <div
                key={admin.id}
                style={{
                  padding: '1rem',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--color-surface)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-foreground)' }}>
                    {admin.email}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    UID: {admin.id.substring(0, 16)}... • {admin.createdAt}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: admin.role === 'Super Admin' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: admin.role === 'Super Admin' ? '#2563eb' : '#10b981',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {admin.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Admin Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={18} style={{ color: '#10b981' }} />
            <span>Grant Admin Privileges</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
            To add a team member as an administrator, enter their registered Firebase Auth UID. They will receive access to this panel.
          </p>

          {error && (
            <p className="alert alert--error" style={{ marginBottom: '1rem' }}>
              <CircleAlert size={16} /> <span>{error}</span>
            </p>
          )}

          {success && (
            <p className="alert alert--success" style={{ marginBottom: '1rem' }}>
              <CircleCheck size={16} /> <span>{success}</span>
            </p>
          )}

          <form onSubmit={handleAddAdmin} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Firebase Auth UID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5qWzY9kP8d..."
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Admin Email (Optional reference)
              </label>
              <input
                type="email"
                placeholder="colleague@visiongiants.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Assigned Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'Super Admin' | 'Content Editor')}
                className="input"
              >
                <option value="Super Admin">Super Administrator (Full Access)</option>
                <option value="Content Editor">Content Editor (Pages & Blog Only)</option>
              </select>
            </div>

            <button type="submit" className="btn btn--primary" disabled={adding} style={{ marginTop: '0.5rem' }}>
              {adding ? (
                <>
                  <LoaderCircle size={16} className="spin" /> Registering...
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Grant Admin Access
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
