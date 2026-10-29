import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  FolderKanban,
  Inbox,
  LayoutTemplate,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { errorCode } from '../config/firebase';
import { company } from '../data/company';
import { signIn, sendPasswordReset } from './firebase';
import { AdminLogo } from './AdminLayout';

type Mode = 'signin' | 'reset';

/** What the dashboard manages, shown beside the form. */
const highlights = [
  { icon: Inbox, title: 'Inquiries & applications', text: 'Review project inquiries and job applications in one place.' },
  { icon: FolderKanban, title: 'Projects, services & roles', text: 'Publish and reorder the content shown on the website.' },
  { icon: LayoutTemplate, title: 'Portfolio page', text: 'Edit the company profile, certifications and honours.' },
];

/**
 * Admin sign-in. Accounts are created with `npm run admin:provision` (see scripts/provision-admin.mjs),
 * never from this public page.
 */
export function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setNotice('');
  };

  const onSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      const code = errorCode(err);
      setError(
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? 'Incorrect email or password.'
          : code === 'auth/too-many-requests'
            ? 'Too many failed attempts. Please wait a moment and try again.'
            : 'Could not sign in. Please check your connection and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const onReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Enter the email address of your administrator account.');
      return;
    }
    setBusy(true);
    try {
      await sendPasswordReset(email.trim());
    } catch {
      // Same message either way, so the page doesn't reveal which emails have accounts
    } finally {
      setBusy(false);
      setNotice('If an administrator account exists for that email, we’ve sent a link to reset the password.');
    }
  };

  return (
    <div className="admin-auth">
      <aside className="admin-auth__brand">
        <div className="admin-auth__brand-inner">
          <AdminLogo />
          <div className="admin-auth__intro">
            <p className="admin-auth__kicker">Admin panel</p>
            <h2>Everything your website needs, in one place.</h2>
            <ul className="admin-auth__list">
              {highlights.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="admin-auth__legal">
            © {new Date().getFullYear()} {company.legalName}
          </p>
        </div>
      </aside>

      <main className="admin-auth__main">
        <div className="admin-auth__top">
          <span className="admin-auth__mobile-logo">
            <AdminLogo />
          </span>
          <a href="/" className="admin-auth__back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to website
          </a>
        </div>

        <div className="admin-auth__panel">
          {mode === 'signin' ? (
            <form onSubmit={onSignIn} className="admin-auth__form">
              <header>
                <h1>Welcome back</h1>
                <p>Sign in with your administrator account to continue.</p>
              </header>

              <div className="field">
                <label htmlFor="login-email">Email address</label>
                <div className="admin-auth__input">
                  <Mail size={17} aria-hidden="true" />
                  <input
                    id="login-email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <div className="admin-auth__label-row">
                  <label htmlFor="login-password">Password</label>
                  <button type="button" className="admin-auth__link" onClick={() => switchMode('reset')}>
                    Forgot password?
                  </button>
                </div>
                <div className="admin-auth__input">
                  <Lock size={17} aria-hidden="true" />
                  <input
                    id="login-password"
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-auth__toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <Feedback error={error} notice={notice} />

              <button type="submit" className="btn btn--primary admin-auth__submit" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
                <span aria-hidden="true">{busy ? <LoaderCircle size={17} className="spin" /> : <ArrowRight size={17} />}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={onReset} className="admin-auth__form">
              <header>
                <h1>Reset your password</h1>
                <p>Enter your administrator email and we’ll send you a link to choose a new password.</p>
              </header>

              <div className="field">
                <label htmlFor="reset-email">Email address</label>
                <div className="admin-auth__input">
                  <Mail size={17} aria-hidden="true" />
                  <input
                    id="reset-email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Feedback error={error} notice={notice} />

              <button type="submit" className="btn btn--primary admin-auth__submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send reset link'}
                <span aria-hidden="true">{busy ? <LoaderCircle size={17} className="spin" /> : <ArrowRight size={17} />}</span>
              </button>
              <button type="button" className="admin-auth__link admin-auth__link--center" onClick={() => switchMode('signin')}>
                <ArrowLeft size={15} aria-hidden="true" />
                Back to sign in
              </button>
            </form>
          )}

          <p className="admin-auth__secure">
            <ShieldCheck size={15} aria-hidden="true" />
            Restricted area. Access is limited to authorised administrators.
          </p>
        </div>
      </main>
    </div>
  );
}

function Feedback({ error, notice }: { error: string; notice: string }) {
  if (!error && !notice) return null;
  return (
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
  );
}
