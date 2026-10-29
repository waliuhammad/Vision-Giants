import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, LoaderCircle, CircleCheck, CircleAlert, Info } from 'lucide-react';
import { company } from '../../data/company';
import type { Position } from '../../data/careers';
import { errorCode, isFirebaseConfigured, submitApplication } from '../../config/firebase';
import { Button } from './Button';


type Status = 'idle' | 'submitting' | 'success' | 'error' | 'rate-limited' | 'unconfigured';

interface Values {
  positionId: string;
  name: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  linkedinUrl: string;
  message: string;
  /** Shareable link to the CV (Google Drive, Dropbox, OneDrive…). */
  cvUrl: string;
  consent: boolean;
}
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const empty: Values = { positionId: '', name: '', email: '', phone: '', portfolioUrl: '', linkedinUrl: '', message: '', cvUrl: '', consent: false };

const isUrl = (v: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.portfolioUrl.trim() && !isUrl(v.portfolioUrl.trim())) e.portfolioUrl = 'Please enter a full link starting with https://';
  if (v.linkedinUrl.trim() && !isUrl(v.linkedinUrl.trim())) e.linkedinUrl = 'Please enter a full link starting with https://';
  if (v.message.length > 5000) e.message = 'Please keep your message under 5,000 characters.';
  if (!isUrl(v.cvUrl.trim())) e.cvUrl = 'Please paste a link to your CV, starting with https://';
  else if (v.cvUrl.trim().length > 500) e.cvUrl = 'Please use a shorter link (up to 500 characters).';
  if (!v.consent) e.consent = 'Please confirm so we can review your application.';
  return e;
}

export function ApplicationForm({ positions }: { positions: Position[] }) {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    // Links like /careers/apply/?position=<id> preselect a role
    const position = new URLSearchParams(window.location.search).get('position');
    if (position && positions.some((p) => p.id === position)) setValues((v) => ({ ...v, positionId: position }));
  }, [positions]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Basic spam protection: hidden honeypot field and a minimum fill time
    if (honeypot.current?.value || Date.now() - startedAt.current < 4000) {
      setStatus('error');
      return;
    }
    if (!isFirebaseConfigured) {
      setStatus('unconfigured');
      return;
    }
    setStatus('submitting');
    try {
      await submitApplication({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        portfolioUrl: values.portfolioUrl.trim(),
        linkedinUrl: values.linkedinUrl.trim(),
        message: values.message.trim(),
        cvUrl: values.cvUrl.trim(),
        positionTitle: positions.find((p) => p.id === values.positionId)?.title ?? 'General application',
      });
      setStatus('success');
      setValues(empty);
      setTouched(false);
    } catch (err) {
      console.error('Application submission failed', err);
      setStatus(errorCode(err) === 'functions/resource-exhausted' ? 'rate-limited' : 'error');
    }
  };

  const fieldProps = (key: Field) => ({
    id: `a-${key}`,
    name: key,
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `a-${key}-error` : undefined,
  });
  const err = (key: Field) =>
    errors[key] && (
      <span id={`a-${key}-error`} className="field__error">
        {errors[key]}
      </span>
    );

  const emailFallback = company.email ? (
    <>
      {' '}
      You can also email your CV to <a href={`mailto:${company.email}`}>{company.email}</a>.
    </>
  ) : null;

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      {!isFirebaseConfigured && status !== 'unconfigured' && (
        <p className="alert alert--info">
          <Info size={18} aria-hidden="true" />
          <span>
            Online applications are not connected yet, so applications sent here cannot be delivered.
            {emailFallback}
          </span>
        </p>
      )}

      <div className="field">
        <label htmlFor="a-positionId">Position</label>
        <select className="input" value={values.positionId} onChange={(e) => set('positionId', e.target.value)} {...fieldProps('positionId')}>
          <option value="">General application</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="a-name">
            Full name <span className="req" aria-hidden="true">*</span>
          </label>
          <input className="input" type="text" autoComplete="name" placeholder="Your name" required value={values.name} onChange={(e) => set('name', e.target.value)} {...fieldProps('name')} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor="a-email">
            Email address <span className="req" aria-hidden="true">*</span>
          </label>
          <input className="input" type="email" autoComplete="email" placeholder="you@example.com" required value={values.email} onChange={(e) => set('email', e.target.value)} {...fieldProps('email')} />
          {err('email')}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="a-phone">
            Phone <span className="optional">(optional)</span>
          </label>
          <input className="input" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} {...fieldProps('phone')} />
        </div>
        <div className="field">
          <label htmlFor="a-linkedinUrl">
            LinkedIn <span className="optional">(optional)</span>
          </label>
          <input className="input" type="url" placeholder="https://linkedin.com/in/…" value={values.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} {...fieldProps('linkedinUrl')} />
          {err('linkedinUrl')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="a-portfolioUrl">
          Portfolio or GitHub <span className="optional">(optional)</span>
        </label>
        <input className="input" type="url" placeholder="https://" value={values.portfolioUrl} onChange={(e) => set('portfolioUrl', e.target.value)} {...fieldProps('portfolioUrl')} />
        {err('portfolioUrl')}
      </div>

      <div className="field">
        <label htmlFor="a-cvUrl">
          Link to your CV <span className="req" aria-hidden="true">*</span>
        </label>
        <input className="input" type="url" placeholder="https://drive.google.com/…" required value={values.cvUrl} onChange={(e) => set('cvUrl', e.target.value)} {...fieldProps('cvUrl')} />
        <small className="muted">Upload your CV to Google Drive, Dropbox or OneDrive and paste a link that anyone can view.</small>
        {err('cvUrl')}
      </div>

      <div className="field">
        <label htmlFor="a-message">
          About you <span className="optional">(optional)</span>
        </label>
        <textarea className="input" placeholder="Tell us a little about yourself and the work you enjoy…" value={values.message} onChange={(e) => set('message', e.target.value)} {...fieldProps('message')} />
        {err('message')}
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="a-website">Website</label>
        <input ref={honeypot} id="a-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label className="checkbox">
          <input type="checkbox" checked={values.consent} onChange={(e) => set('consent', e.target.checked)} {...fieldProps('consent')} />
          <span>I agree that my details and CV will be stored and used to review my application.</span>
        </label>
        {err('consent')}
      </div>

      <Button type="submit" disabled={status === 'submitting'} icon={status === 'submitting' ? <LoaderCircle size={18} className="spin" /> : <Send size={17} />}>
        {status === 'submitting' ? 'Sending…' : 'Send Application'}
      </Button>

      <div aria-live="polite">
        {status === 'success' && (
          <p className="alert alert--success">
            <CircleCheck size={18} aria-hidden="true" />
            <span>Thank you, your application has been received. We’ll be in touch if there’s a suitable match.</span>
          </p>
        )}
        {status === 'error' && (
          <p className="alert alert--error">
            <CircleAlert size={18} aria-hidden="true" />
            <span>Sorry, your application could not be sent. Please check your details and try again.{emailFallback}</span>
          </p>
        )}
        {status === 'rate-limited' && (
          <p className="alert alert--error">
            <CircleAlert size={18} aria-hidden="true" />
            <span>You’ve sent several applications in a short time. Please wait a while before trying again.{emailFallback}</span>
          </p>
        )}
        {status === 'unconfigured' && (
          <p className="alert alert--info">
            <Info size={18} aria-hidden="true" />
            <span>
              Your application has <strong>not</strong> been sent: online applications are not connected yet.
              {emailFallback ?? ' Please check back soon.'}
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
