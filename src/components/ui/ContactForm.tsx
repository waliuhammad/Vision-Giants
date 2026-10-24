import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, LoaderCircle, CircleCheck, CircleAlert, Info } from 'lucide-react';
import { company } from '../../data/company';
import { services } from '../../data/services';
import { isFirebaseConfigured, submitInquiry, type InquiryPayload } from '../../config/firebase';
import { Button } from './Button';

const projectTypes = [...services.map((s) => s.title), 'Careers / general interest', 'Other'];
/** Editable budget brackets. */
const budgets = ['Not sure yet', 'Under $5,000', '$5,000 – $15,000', '$15,000 – $50,000', '$50,000+'];

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';
type Errors = Partial<Record<keyof InquiryPayload, string>>;

const empty: InquiryPayload = { name: '', email: '', company: '', projectType: '', budget: '', message: '', consent: false };

function validate(v: InquiryPayload): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!v.projectType) e.projectType = 'Please select a project type.';
  if (v.message.trim().length < 20) e.message = 'Please tell us a little more (at least 20 characters).';
  if (v.message.length > 5000) e.message = 'Please keep your message under 5,000 characters.';
  if (!v.consent) e.consent = 'Please confirm so we can respond to your inquiry.';
  return e;
}

export function ContactForm() {
  const [values, setValues] = useState<InquiryPayload>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    // Allow links like /contact/?type=careers to preselect a project type
    const type = new URLSearchParams(window.location.search).get('type');
    if (type === 'careers') setValues((v) => ({ ...v, projectType: 'Careers / general interest' }));
  }, []);

  const set = <K extends keyof InquiryPayload>(key: K, value: InquiryPayload[K]) => {
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
      await submitInquiry({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        message: values.message.trim(),
      });
      setStatus('success');
      setValues(empty);
      setTouched(false);
    } catch (err) {
      console.error('Inquiry submission failed', err);
      setStatus('error');
    }
  };

  const fieldProps = (key: keyof InquiryPayload) => ({
    id: `f-${key}`,
    name: key,
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `f-${key}-error` : undefined,
  });
  const err = (key: keyof InquiryPayload) =>
    errors[key] && (
      <span id={`f-${key}-error`} className="field__error">
        {errors[key]}
      </span>
    );

  const emailFallback = company.email ? (
    <>
      {' '}
      Please email us directly at <a href={`mailto:${company.email}`}>{company.email}</a>.
    </>
  ) : null;

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      {!isFirebaseConfigured && status !== 'unconfigured' && (
        <p className="alert alert--info">
          <Info size={18} aria-hidden="true" />
          <span>
            Online form submission is not connected yet, so messages sent here cannot be delivered.
            {emailFallback}
          </span>
        </p>
      )}

      <div className="form__row">
        <div className="field">
          <label htmlFor="f-name">
            Full name <span className="req" aria-hidden="true">*</span>
          </label>
          <input className="input" type="text" autoComplete="name" placeholder="Your name" required value={values.name} onChange={(e) => set('name', e.target.value)} {...fieldProps('name')} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor="f-email">
            Email address <span className="req" aria-hidden="true">*</span>
          </label>
          <input className="input" type="email" autoComplete="email" placeholder="you@example.com" required value={values.email} onChange={(e) => set('email', e.target.value)} {...fieldProps('email')} />
          {err('email')}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="f-company">
            Company <span className="optional">(optional)</span>
          </label>
          <input className="input" type="text" autoComplete="organization" placeholder="Company name" value={values.company} onChange={(e) => set('company', e.target.value)} {...fieldProps('company')} />
        </div>
        <div className="field">
          <label htmlFor="f-projectType">
            Project type <span className="req" aria-hidden="true">*</span>
          </label>
          <select className="input" required value={values.projectType} onChange={(e) => set('projectType', e.target.value)} {...fieldProps('projectType')}>
            <option value="" disabled>
              Select a service
            </option>
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {err('projectType')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-budget">
          Budget range <span className="optional">(optional)</span>
        </label>
        <select className="input" value={values.budget} onChange={(e) => set('budget', e.target.value)} {...fieldProps('budget')}>
          <option value="">Prefer not to say</option>
          {budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-message">
          Project details <span className="req" aria-hidden="true">*</span>
        </label>
        <textarea className="input" placeholder="Tell us about your goals, timeline and anything else we should know…" required value={values.message} onChange={(e) => set('message', e.target.value)} {...fieldProps('message')} />
        {err('message')}
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input ref={honeypot} id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label className="checkbox">
          <input type="checkbox" checked={values.consent} onChange={(e) => set('consent', e.target.checked)} {...fieldProps('consent')} />
          <span>I agree that the details I provide will be used to respond to this inquiry.</span>
        </label>
        {err('consent')}
      </div>

      <Button type="submit" disabled={status === 'submitting'} icon={status === 'submitting' ? <LoaderCircle size={18} className="spin" /> : <Send size={17} />}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </Button>

      <div aria-live="polite">
        {status === 'success' && (
          <p className="alert alert--success">
            <CircleCheck size={18} aria-hidden="true" />
            <span>Thank you, your message has been received. We’ll get back to you as soon as possible.</span>
          </p>
        )}
        {status === 'error' && (
          <p className="alert alert--error">
            <CircleAlert size={18} aria-hidden="true" />
            <span>Sorry, your message could not be sent. Please try again in a moment.{emailFallback}</span>
          </p>
        )}
        {status === 'unconfigured' && (
          <p className="alert alert--info">
            <Info size={18} aria-hidden="true" />
            <span>
              Your message has <strong>not</strong> been sent: online submissions are not connected yet.
              {emailFallback ?? ' Please check back soon.'}
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
