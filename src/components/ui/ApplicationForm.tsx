import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, LoaderCircle, CircleCheck, CircleAlert, Info, Upload, FileText, Check } from 'lucide-react';
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
  experience: string;
  education: string;
  portfolioUrl: string;
  linkedinUrl: string;
  message: string;
  cvUrl: string;
  consent: boolean;
}
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const empty: Values = {
  positionId: '',
  name: '',
  email: '',
  phone: '',
  experience: '',
  education: '',
  portfolioUrl: '',
  linkedinUrl: '',
  message: '',
  cvUrl: '',
  consent: false,
};

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
  if (!v.cvUrl.trim()) e.cvUrl = 'Please provide a link to your CV (Google Drive, Dropbox, OneDrive, etc.).';
  else if (!isUrl(v.cvUrl.trim())) e.cvUrl = 'Please enter a full link starting with https://';
  else if (v.cvUrl.trim().length > 500) e.cvUrl = 'Please use a link under 500 characters.';
  if (!v.consent) e.consent = 'Please confirm so our recruitment team can review your application.';
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
    const position = new URLSearchParams(window.location.search).get('position');
    if (position) {
      if (positions.some((p) => p.id === position)) setValues((v) => ({ ...v, positionId: position }));
      else setValues((v) => ({ ...v, positionId: position }));
    }
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
    // Spam protection: honeypot + min time check
    if (honeypot.current?.value || Date.now() - startedAt.current < 2500) {
      setStatus('error');
      return;
    }
    if (!isFirebaseConfigured) {
      setStatus('unconfigured');
      return;
    }
    setStatus('submitting');
    try {
      const selectedPos = positions.find((p) => p.id === values.positionId);
      const positionTitle = selectedPos ? selectedPos.title : values.positionId ? values.positionId.replace(/-/g, ' ') : 'General Application';

      await submitApplication({
        positionId: values.positionId,
        positionTitle,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        experience: values.experience.trim(),
        education: values.education.trim(),
        portfolioUrl: values.portfolioUrl.trim(),
        linkedinUrl: values.linkedinUrl.trim(),
        message: values.message.trim(),
        cvUrl: values.cvUrl.trim(),
        consent: values.consent,
      });
      setStatus('success');
    } catch (err) {
      const code = errorCode(err);
      if (code === 'functions/resource-exhausted') setStatus('rate-limited');
      else setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="card form-result form-result--success" role="status">
        <span className="icon-wrap" aria-hidden="true">
          <CircleCheck size={28} />
        </span>
        <h2>Application Received!</h2>
        <p className="lead">
          Thank you for applying to Vision Giants, <strong>{values.name}</strong>.
        </p>
        <p>
          Our engineering and recruitment leads will review your CV and experience. If your profile matches our
          open opportunities, we will reach out via email to arrange an introductory interview.
        </p>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button to="/careers/">Back to Careers</Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card form" noValidate>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
        <label htmlFor="app-company-hp">Company</label>
        <input ref={honeypot} id="app-company-hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid--2">
        <div className={`field${errors.name ? ' field--error' : ''}`}>
          <label htmlFor="app-name">
            Full name <span className="field__required">*</span>
          </label>
          <input
            id="app-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </div>

        <div className={`field${errors.email ? ' field--error' : ''}`}>
          <label htmlFor="app-email">
            Email address <span className="field__required">*</span>
          </label>
          <input
            id="app-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </div>
      </div>

      <div className="grid grid--2">
        <div className="field">
          <label htmlFor="app-phone">Phone number</label>
          <input
            id="app-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+92 300 1234567"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="app-position">Position applied for</label>
          <select
            id="app-position"
            name="positionId"
            value={values.positionId}
            onChange={(e) => set('positionId', e.target.value)}
          >
            <option value="">General Application (Any matching role)</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.department || 'Tech'})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid--2">
        <div className="field">
          <label htmlFor="app-exp">Experience level</label>
          <input
            id="app-exp"
            name="experience"
            type="text"
            placeholder="e.g. 3 years / Mid-Level / Fresh Graduate"
            value={values.experience}
            onChange={(e) => set('experience', e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="app-edu">Highest education</label>
          <input
            id="app-edu"
            name="education"
            type="text"
            placeholder="e.g. BS Computer Science, FAST / NUCES"
            value={values.education}
            onChange={(e) => set('education', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid--2">
        <div className={`field${errors.linkedinUrl ? ' field--error' : ''}`}>
          <label htmlFor="app-linkedin">LinkedIn profile URL</label>
          <input
            id="app-linkedin"
            name="linkedinUrl"
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={values.linkedinUrl}
            onChange={(e) => set('linkedinUrl', e.target.value)}
          />
          {errors.linkedinUrl && <span className="field__error">{errors.linkedinUrl}</span>}
        </div>

        <div className={`field${errors.portfolioUrl ? ' field--error' : ''}`}>
          <label htmlFor="app-portfolio">Portfolio / GitHub / Dribbble URL</label>
          <input
            id="app-portfolio"
            name="portfolioUrl"
            type="url"
            placeholder="https://github.com/username"
            value={values.portfolioUrl}
            onChange={(e) => set('portfolioUrl', e.target.value)}
          />
          {errors.portfolioUrl && <span className="field__error">{errors.portfolioUrl}</span>}
        </div>
      </div>

      <div className={`field${errors.cvUrl ? ' field--error' : ''}`}>
        <label htmlFor="app-cv">
          Link to your CV / Resume <span className="field__required">*</span>
        </label>
        <input
          id="app-cv"
          name="cvUrl"
          type="url"
          required
          placeholder="https://drive.google.com/file/d/... or Dropbox / OneDrive public link"
          value={values.cvUrl}
          onChange={(e) => set('cvUrl', e.target.value)}
        />
        <span className="field__help">
          Upload your PDF to Google Drive, Dropbox, or OneDrive, ensure link sharing is set to “Anyone with the link can view”, and paste the link here.
        </span>
        {errors.cvUrl && <span className="field__error">{errors.cvUrl}</span>}
      </div>

      <div className={`field${errors.message ? ' field--error' : ''}`}>
        <label htmlFor="app-message">Cover letter / Introduction</label>
        <textarea
          id="app-message"
          name="message"
          rows={4}
          placeholder="Tell us about yourself, your favorite projects, and what excites you about joining Vision Giants..."
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
        />
        {errors.message && <span className="field__error">{errors.message}</span>}
      </div>

      <div className={`field field--checkbox${errors.consent ? ' field--error' : ''}`}>
        <label>
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => set('consent', e.target.checked)}
          />
          <span>
            I agree to {company.name} processing my information for recruitment purposes.
          </span>
        </label>
        {errors.consent && <span className="field__error">{errors.consent}</span>}
      </div>

      {status === 'error' && (
        <div className="form-notice form-notice--error" role="alert">
          <CircleAlert size={18} aria-hidden="true" />
          <span>Could not submit application. Please check your network and try again.</span>
        </div>
      )}

      {status === 'rate-limited' && (
        <div className="form-notice form-notice--error" role="alert">
          <CircleAlert size={18} aria-hidden="true" />
          <span>Too many submissions received recently. Please wait a few moments before trying again.</span>
        </div>
      )}

      <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <LoaderCircle size={18} className="spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              Submit Application
              <Send size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
