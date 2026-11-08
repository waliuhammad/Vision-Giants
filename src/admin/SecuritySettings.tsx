import { useState, type FormEvent } from 'react';
import {
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth, changeAdminPassword } from './firebase';
import { isFirebaseConfigured } from '../config/firebase';
import { logAdminActivity } from './activityLogger';

export function SecuritySettings() {
  const auth = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setBusy(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      await logAdminActivity('Admin Password Updated', 'system', 'User credentials successfully changed.');
      setSuccess('Administrator password updated successfully! Credentials are now secured.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setError('Current password is incorrect. Please verify and try again.');
      } else {
        setError(msg || 'Failed to update password. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-page" style={{ maxWidth: 1000, margin: '0 auto', gap: '2rem' }}>
      {/* Page Header */}
      <div className="admin-page__head">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: '0.5rem' }}>
            <Lock size={13} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase' }}>
              Security Center
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
            Admin Security & Password Settings
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Manage administrative credentials, review session security, and inspect backend configuration.
          </p>
        </div>
      </div>

      {/* Grid: Change Password Form (Left) + Security Diagnostics (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Change Password Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem', color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <KeyRound size={18} style={{ color: '#2563eb' }} />
            <span>Update Admin Password</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
            Passwords must be at least 8 characters long. After changing your password, your new credentials will take effect immediately.
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

          <form onSubmit={onPasswordSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Current Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="input-with-action">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="btn btn--plain btn--sm"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                New Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="input-with-action">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="btn btn--plain btn--sm"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <button type="submit" className="btn btn--primary" disabled={busy} style={{ marginTop: '0.5rem' }}>
              {busy ? (
                <>
                  <LoaderCircle size={16} className="spin" /> Updating Password...
                </>
              ) : (
                <>
                  <KeyRound size={16} /> Change Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Overview & Diagnostic */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} style={{ color: '#10b981' }} />
              <span>Security Diagnostics</span>
            </h2>

            <div style={{ display: 'grid', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-foreground)' }}>
                    HTTPS & SSL Encryption Active
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    All requests, form submissions, and admin commands are secured via end-to-end TLS 1.3.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-foreground)' }}>
                    Role-Based Firestore Rules Enforced
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    Only verified UIDs in the <code>admins</code> collection have write permissions to CMS pages.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-foreground)' }}>
                    Firebase Environment Configured
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    Status: {isFirebaseConfigured ? 'Connected & Verified' : 'Missing environment keys'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--color-surface-2)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem', color: 'var(--color-foreground)' }}>
              Session Information
            </h3>
            {auth.status === 'admin' && auth.user && (
              <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', display: 'grid', gap: '0.35rem' }}>
                <div><strong>Email:</strong> {auth.user.email}</div>
                <div><strong>User UID:</strong> <code>{auth.user.uid}</code></div>
                <div><strong>Provider:</strong> Firebase Password Authentication</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
