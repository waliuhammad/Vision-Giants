import { useState, useEffect, type FormEvent } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import type { User } from 'firebase/auth';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Layers,
  ImageIcon,
  Globe,
  Menu,
  Sliders,
  Inbox,
  Search,
  Users,
  Clock,
  Lock,
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
  Briefcase,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  Handshake,
  Cpu,
  Building2,
} from 'lucide-react';
import { company } from '../data/company';
import { signOutAdmin, changeAdminPassword } from './firebase';

// 13-item comprehensive admin navigation hierarchy
const mainNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/pages', label: 'Website Pages', icon: FileText },
  { to: '/admin/visual-builder', label: 'Visual Page Editor', icon: Sparkles },
  { to: '/admin/sections', label: 'Sections Manager', icon: Layers },
  { to: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { to: '/admin/global-settings', label: 'Global Settings', icon: Globe },
  { to: '/admin/navigation', label: 'Header & Navigation', icon: Menu },
  { to: '/admin/footer', label: 'Footer Manager', icon: Sliders },
  { to: '/admin/inquiries', label: 'Forms & Submissions', icon: Inbox },
  { to: '/admin/seo', label: 'SEO Management', icon: Search },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/activity-logs', label: 'Activity Logs', icon: Clock },
  { to: '/admin/security', label: 'Security & Password', icon: Lock },
];

const contentModules = [
  { to: '/admin/services', label: 'Services Catalog', icon: Layers },
  { to: '/admin/portfolio', label: 'Portfolio Projects', icon: Briefcase },
  { to: '/admin/courses', label: 'Academy Courses', icon: BookOpen },
  { to: '/admin/careers', label: 'Careers & Jobs', icon: Briefcase },
  { to: '/admin/blog', label: 'Blog & Articles', icon: FileText },
  { to: '/admin/team', label: 'Team Members', icon: Users },
  { to: '/admin/technologies', label: 'Technologies', icon: Cpu },
  { to: '/admin/clients', label: 'Clients & Brands', icon: Building2 },
  { to: '/admin/partners', label: 'Strategic Partners', icon: Handshake },
];

export function AdminLogo({ collapsed }: { collapsed?: boolean }) {
  const suffix = company.legalName.slice(company.name.length).trim();
  return (
    <a href="/" className="logo" aria-label={`${company.legalName} website`} style={{ gap: collapsed ? 0 : 8 }}>
      <span className="logo__mark" aria-hidden="true" style={{ width: collapsed ? 32 : 36, height: collapsed ? 32 : 36 }}>
        <img src="/logo-mark.png" alt="" width="148" height="98" style={{ objectFit: 'contain' }} />
      </span>
      {!collapsed && (
        <span className="logo__text" style={{ fontSize: '0.95rem' }}>
          <span className="logo__name">{company.name}</span>
          {suffix && <span className="logo__suffix">{suffix}</span>}
        </span>
      )}
    </a>
  );
}

export function AdminLayout({ user }: { user: User }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const location = useLocation();

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <div className={`admin ${collapsed ? 'admin--collapsed' : ''}`}>
      {/* Mobile Top Header */}
      <div className="admin-mobile-bar">
        <button
          type="button"
          className="btn btn--plain"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Drawer"
        >
          <MenuIcon size={22} />
        </button>
        <AdminLogo collapsed={false} />
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn--plain btn--sm" title="View Site">
          <ExternalLink size={18} />
        </a>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`admin__sidebar ${mobileMenuOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__brand" style={{ position: 'relative' }}>
          <AdminLogo collapsed={collapsed} />
          {!collapsed && <span className="admin__brand-tag">Visual CMS</span>}

          {/* Collapse Sidebar Toggle Button */}
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav aria-label="Admin" style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
          {/* Main 13 Management Links */}
          <div className="admin__nav-group">
            {!collapsed && <p className="admin__nav-title">Management</p>}
            {mainNav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="admin__nav-link"
                title={collapsed ? label : undefined}
              >
                <Icon size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>

          {/* Specific Content Modules */}
          <div className="admin__nav-group">
            {!collapsed && <p className="admin__nav-title">Content Modules</p>}
            {contentModules.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className="admin__nav-link"
                title={collapsed ? label : undefined}
              >
                <Icon size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer Account & Utilities */}
        <div className="admin__account">
          <a
            href="/"
            className="admin__nav-link"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? 'View live website' : undefined}
          >
            <ExternalLink size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
            {!collapsed && <span>View website</span>}
          </a>

          <button
            type="button"
            className="admin__nav-link"
            onClick={() => {
              setShowPasswordModal(true);
              setError('');
              setNotice('');
            }}
            title={collapsed ? 'Change password' : undefined}
          >
            <KeyRound size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
            {!collapsed && <span>Change password</span>}
          </button>

          <button
            type="button"
            className="admin__nav-link"
            onClick={() => signOutAdmin()}
            title={collapsed ? 'Sign out' : undefined}
          >
            <LogOut size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sign out</span>}
          </button>

          {!collapsed && (
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
          )}
        </div>
      </aside>

      {/* Main Work Area */}
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
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="input"
                  />
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="new-password">New Password (at least 8 characters)</label>
                <div className="input-with-action">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="input"
                  />
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="field">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="input"
                />
              </div>

              {error && (
                <p className="alert alert--error" role="alert">
                  <CircleAlert size={18} aria-hidden="true" />
                  <span>{error}</span>
                </p>
              )}

              {notice && (
                <p className="alert alert--success" role="status">
                  <CircleCheck size={18} aria-hidden="true" />
                  <span>{notice}</span>
                </p>
              )}

              <div className="admin-modal__actions">
                <button
                  type="button"
                  className="btn btn--plain"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={busy}>
                  {busy ? (
                    <>
                      <LoaderCircle size={16} className="spin" aria-hidden="true" />
                      Updating…
                    </>
                  ) : (
                    'Update password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
