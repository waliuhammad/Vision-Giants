import { useState, type FormEvent } from 'react';
import { LoaderCircle, LogIn, CircleAlert, CircleCheck } from 'lucide-react';
import { errorCode } from '../config/firebase';
import { signIn, sendPasswordReset } from './firebase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const onSubmit = async (e: FormEvent) => {
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
            ? 'Too many attempts. Please wait a moment and try again.'
            : 'Could not sign in. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const onReset = async () => {
    setError('');
    setNotice('');
    if (!email.trim()) return setError('Enter your email address first.');
    try {
      await sendPasswordReset(email.trim());
    } catch {
      // Same message either way, so the form doesn't reveal which emails have accounts.
    }
    setNotice('If an account exists for that email, a password reset link has been sent.');
  };

  return (
    <div className="admin-center">
      <form className="card admin-login form" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Sign in</h1>
        </div>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" className="input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
          <span aria-hidden="true">{busy ? <LoaderCircle size={17} className="spin" /> : <LogIn size={17} />}</span>
        </button>
        <button type="button" className="admin-link" onClick={onReset}>
          Forgot password?
        </button>
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
      </form>
    </div>
  );
}
