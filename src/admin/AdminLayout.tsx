import { useState, type FormEvent } from 'react';
import { NavLink, Outlet } from 'react-router';
import type { User } from 'firebase/auth';
import {
  Inbox,
  FileUser,
  FolderKanban,
  BookUser,
  FileText,
  Layers,
  Briefcase,
  LogOut,
  ExternalLink,
  KeyRound,
  Eye,
  EyeOff,
  LoaderCircle,
  CircleAlert,
  CircleCheck,
  X,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import { company } from '../data/company';
import { signOutAdmin, changeAdminPassword } from './firebase';

const nav = [
  {
    group: 'Submissions',
    items: [
      { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
      { to: '/admin/applications', label: 'Applications', icon: FileUser },
    ],
  },
  {
    group: 'Website content',
    items: [
      { to: '/admin/pages', label: 'Site pages', icon: FileText },
      { to: '/admin/portfolio-page', label: 'Portfolio page', icon: BookUser },
      { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
      { to: '/admin/services', label: 'Services', icon: Layers },
      { to: '/admin/positions', label: 'Open positions', icon: Briefcase },
    ],
  },
];

/**
 * The site's logo (components/layout/Logo) as a plain link: the admin app has its own router,
 * so a router Link to "/" would stay inside it instead of opening the website.
 */
export function AdminLogo() {
  const suffix = company.legalName.slice(company.name.length).trim();
  return (
    <a href="/" className="logo" aria-label={`${company.legalName} website`}>
      <span className="logo__mark" aria-hidden="true">
        <img src="/logo-mark.png" alt="" width="148" height="98" />
      </span>
      <span className="logo__text">
        <span className="logo__name">{company.name}</span>
        {suffix && <span className="logo__suffix">{suffix}</span>}
      </span>
    </a>
  );
}

export function AdminLayout({ user }: { user: User }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const onPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

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
      setNotice('Password updated successfully! Your account credentials have been secured.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setNotice('');
      }, 2500);
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
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <AdminLogo />
          <span className="admin__brand-tag">Admin panel</span>
        </div>
        <nav aria-label="Admin">
          {nav.map((section) => (
            <div key={section.group} className="admin__nav-group">
              <p className="admin__nav-title">{section.group}</p>
              {section.items.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className="admin__nav-link">
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin__account">
          <a href="/" className="admin__nav-link" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={17} aria-hidden="true" />
            View website
          </a>
          <button
            type="button"
            className="admin__nav-link"
            onClick={() => {
              setShowPasswordModal(true);
              setError('');
              setNotice('');
            }}
          >
            <KeyRound size={17} aria-hidden="true" />
            Change password
          </button>
          <button type="button" className="admin__nav-link" onClick={() => signOutAdmin()}>
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
          <div className="admin__account-info">
            {user.displayName && (
              <p className="admin__username" title={user.displayName}>
                <UserIcon size={13} aria-hidden="true" />
                <span>{user.displayName}</span>
              </p>
            )}
            <p className="admin__email" title={user.email ?? ''}>
              {user.email}
            </p>
            <span className="admin__badge">
              <Shield size={11} aria-hidden="true" /> Administrator
            </span>
          </div>
        </div>
      </aside>
      <main className="admin__main">
        <div className="bg-grid" aria-hidden="true" />
        <Outlet />
      </main>

      {/* SECURE CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="card admin-modal form">
            <div className="admin-modal__head">
              <div>
                <p className="eyebrow">Security</p>
                <h2 id="modal-title">Change Administrator Password</h2>
              </div>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setShowPasswordModal(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onPasswordSubmit} className="admin-form-fields">
              <div className="field">
                <label htmlFor="current-password">Current Password</label>
                <div className="input-with-action">
                  <input
                    id="current-password"
                    className="input"
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter existing password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="action-inside-input"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="new-password">New Password (min 8 characters)</label>
                <div className="input-with-action">
                  <input
                    id="new-password"
                    className="input"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="Enter strong new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="action-inside-input"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="confirm-new-password">Confirm New Password</label>
                <input
                  id="confirm-new-password"
                  className="input"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div aria-live="polite">
                {error && (
                  <p className="alert alert--error">
                    <CircleAlert size={18} aria-hidden="true" />
                    <span>{error}</span>
                  </p>
                )}
                {notice && (
                  <p className="alert alert--success">
                    <CircleCheck size={18} aria-hidden="true" />
                    <span>{notice}</span>
                  </p>
                )}
              </div>

              <div className="admin-modal__actions">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
                  {busy ? 'Updating…' : 'Update Password'}
                  <span aria-hidden="true">
                    {busy ? <LoaderCircle size={16} className="spin" /> : <KeyRound size={16} />}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
