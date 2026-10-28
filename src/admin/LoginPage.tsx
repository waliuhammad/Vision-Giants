import { useState, type FormEvent } from 'react';
import {
  LoaderCircle,
  LogIn,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ArrowLeft,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { errorCode } from '../config/firebase';
import { signIn, sendPasswordReset } from './firebase';
import { AdminLogo } from './AdminLayout';

type TabMode = 'signin' | 'reset' | 'setup';

export function LoginPage() {
  const [tab, setTab] = useState<TabMode>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Password Generator & Setup state
  const [setupPassword, setSetupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);


  const onSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await signIn(email.trim(), password, username.trim() || undefined);
    } catch (err) {
      const code = errorCode(err);
      setError(
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? 'Incorrect email or password.'
          : code === 'auth/too-many-requests'
            ? 'Too many failed attempts. Please wait a moment and try again.'
            : 'Could not sign in. Please verify your credentials and try again.'
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
      setError('Please enter your administrator email address first.');
      return;
    }
    setBusy(true);
    try {
      await sendPasswordReset(email.trim());
    } catch {
      // Intentionally uniform message to prevent user enumeration attacks
    } finally {
      setBusy(false);
      setNotice('If an administrator account exists for that email, a password reset link has been dispatched.');
    }
  };

  const generateStrongPassword = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*()_+';
    let generated = '';
    const array = new Uint32Array(16);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < 16; i++) {
        generated += chars[array[i] % chars.length];
      }
    } else {
      for (let i = 0; i < 16; i++) {
        generated += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    setSetupPassword(generated);
    setConfirmPassword(generated);
    setPasswordCopied(false);
  };

  const copyGeneratedPassword = () => {
    if (!setupPassword) return;
    navigator.clipboard.writeText(setupPassword);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2500);
  };

  return (
    <div className="admin-center">
      <div className="bg-grid" aria-hidden="true" />
      <div className="card admin-login form">
        {/* Header / Admin Info */}
        <div className="admin-login__head">
          <AdminLogo />
          <p className="eyebrow">Admin panel</p>
          <h1>Sign in to manage your website</h1>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'signin'}
            className={`admin-tab ${tab === 'signin' ? 'admin-tab--active' : ''}`}
            onClick={() => {
              setTab('signin');
              setError('');
              setNotice('');
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'setup'}
            className={`admin-tab ${tab === 'setup' ? 'admin-tab--active' : ''}`}
            onClick={() => {
              setTab('setup');
              setError('');
              setNotice('');
            }}
          >
            First-time setup
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'reset'}
            className={`admin-tab ${tab === 'reset' ? 'admin-tab--active' : ''}`}
            onClick={() => {
              setTab('reset');
              setError('');
              setNotice('');
            }}
          >
            Reset password
          </button>
        </div>

        {/* SIGN IN TAB */}
        {tab === 'signin' && (
          <form onSubmit={onSignIn} className="admin-form-fields">
            {/* Field: Username */}
            <div className="field">
              <label htmlFor="login-username">
                Username <span className="optional">(optional)</span>
              </label>
              <input
                id="login-username"
                className="input"
                type="text"
                autoComplete="username"
                placeholder="e.g. admin or your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Field: Email Address */}
            <div className="field">
              <label htmlFor="login-email">
                Email address <span className="req">*</span>
              </label>
              <input
                id="login-email"
                className="input"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@visiongiants.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Field: Password */}
            <div className="field">
              <div className="field-row">
                <label htmlFor="login-password">
                  Password <span className="req">*</span>
                </label>
                <button
                  type="button"
                  className="admin-link admin-link--small"
                  onClick={() => {
                    setTab('reset');
                    setError('');
                    setNotice('');
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-with-action">
                <input
                  id="login-password"
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="action-inside-input"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn--primary" disabled={busy} style={{ width: '100%', marginTop: '0.5rem' }}>
              {busy ? 'Signing in…' : 'Sign in'}
              <span aria-hidden="true">
                {busy ? <LoaderCircle size={17} className="spin" /> : <LogIn size={17} />}
              </span>
            </button>
          </form>
        )}

        {/* RESET PASSWORD TAB */}
        {tab === 'reset' && (
          <form onSubmit={onReset} className="admin-form-fields">
            <p className="admin-helper-text">
              Enter your registered administrator email address. A cryptographically secure, time-limited password reset link will be sent to your inbox.
            </p>
            <div className="field">
              <label htmlFor="reset-email">
                Email address <span className="req">*</span>
              </label>
              <input
                id="reset-email"
                className="input"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@visiongiants.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn--primary" disabled={busy} style={{ width: '100%' }}>
              {busy ? 'Sending Reset Link…' : 'Send Password Reset Link'}
              <span aria-hidden="true">
                {busy ? <LoaderCircle size={17} className="spin" /> : <Mail size={17} />}
              </span>
            </button>

            <button
              type="button"
              className="btn btn--outline btn--sm"
              style={{ width: '100%', marginTop: '0.25rem' }}
              onClick={() => {
                setTab('signin');
                setError('');
                setNotice('');
              }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Return to Sign In
            </button>
          </form>
        )}

        {/* FIRST-TIME SETUP TAB */}
        {tab === 'setup' && (
          <div className="admin-form-fields">
            <p className="admin-helper-text">
              For security, administrator accounts cannot be registered publicly via open web forms. Provision the account securely using the dedicated CLI provisioning command or Firebase Console.
            </p>

            <div className="admin-code-block">
              <div className="admin-code-block__title">
                <Terminal size={14} aria-hidden="true" />
                <span>CLI Setup Command (Terminal)</span>
              </div>
              <code>npm run admin:provision</code>
            </div>

            {/* Password Generator with Confirm Password */}
            <div className="admin-setup-card">
              <div className="field-row">
                <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-small)' }}>
                  <KeyRound size={15} className="accent-icon" aria-hidden="true" />
                  Secure Password Generator &amp; Confirmation
                </strong>
                <button
                  type="button"
                  className="btn btn--outline btn--xs"
                  onClick={generateStrongPassword}
                >
                  <Sparkles size={14} aria-hidden="true" />
                  Generate Strong
                </button>
              </div>

              {/* Password */}
              <div className="field" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="setup-password">
                  <span className="field-label-text">Password</span>
                </label>
                <div className="input-with-action">
                  <input
                    id="setup-password"
                    className="input input--sm"
                    type={showSetupPassword ? 'text' : 'password'}
                    placeholder="Enter or generate password (min 8 chars)"
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="action-inside-input"
                    onClick={() => setShowSetupPassword(!showSetupPassword)}
                    title={showSetupPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSetupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="field" style={{ marginTop: '0.5rem' }}>
                <label htmlFor="setup-confirm-password">
                  <span className="field-label-text">Confirm Password</span>
                </label>
                <div className="input-with-action">
                  <input
                    id="setup-confirm-password"
                    className="input input--sm"
                    type={showSetupPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {setupPassword && (
                <div style={{ marginTop: '0.5rem', fontSize: 'var(--fs-small)' }}>
                  {setupPassword === confirmPassword ? (
                    <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CircleCheck size={14} /> Passwords match securely
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CircleAlert size={14} /> Passwords do not match yet
                    </span>
                  )}
                  {setupPassword.length >= 8 && (
                    <button
                      type="button"
                      className="btn btn--outline btn--xs"
                      onClick={copyGeneratedPassword}
                      style={{ marginTop: '0.5rem' }}
                    >
                      {passwordCopied ? 'Copied to Clipboard!' : 'Copy Secure Password'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn--outline btn--sm"
              style={{ width: '100%', marginTop: '0.25rem' }}
              onClick={() => {
                setTab('signin');
                if (setupPassword && setupPassword === confirmPassword) {
                  setPassword(setupPassword);
                }
              }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Use Credentials &amp; Return to Sign In
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        <div aria-live="polite">
          {error && (
            <p className="alert alert--error" style={{ marginTop: '0.75rem' }}>
              <CircleAlert size={18} aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}
          {notice && (
            <p className="alert alert--success" style={{ marginTop: '0.75rem' }}>
              <CircleCheck size={18} aria-hidden="true" />
              <span>{notice}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
