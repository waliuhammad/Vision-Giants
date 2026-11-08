import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react';
import {
  Send,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Trash2,
  Link as LinkIcon,
  RefreshCw,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Sparkles,
} from 'lucide-react';
import { company } from '../../data/company';
import type { Position } from '../../data/careers';
import { errorCode, isFirebaseConfigured, submitApplication, uploadCvFile } from '../../config/firebase';
import { Button } from './Button';

function LinkedInIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

type Status = 'idle' | 'uploading' | 'submitting' | 'success' | 'error' | 'rate-limited' | 'unconfigured';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface FormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  positionId: string;
  experience: string;
  linkedinUrl: string;
  portfolioUrl: string;
  whyJoin: string;
  message: string;
  consent: boolean;
}

const emptyValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  location: '',
  positionId: '',
  experience: '',
  linkedinUrl: '',
  portfolioUrl: '',
  whyJoin: '',
  message: '',
  consent: false,
};

const isUrl = (v: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface ApplicationFormProps {
  positions: Position[];
  initialPositionId?: string;
  onPositionChange?: (positionId: string) => void;
}

export function ApplicationForm({ positions, initialPositionId, onPositionChange }: ApplicationFormProps) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [useLinkFallback, setUseLinkFallback] = useState(false);
  const [manualCvUrl, setManualCvUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues | 'cv', string>>>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [submittedPosTitle, setSubmittedPosTitle] = useState('');

  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Sync initialPositionId or URL query param
  useEffect(() => {
    startedAt.current = Date.now();
    const queryParam = new URLSearchParams(window.location.search).get('position');
    const posId = initialPositionId || queryParam || '';
    if (posId) {
      setValues((v) => ({ ...v, positionId: posId }));
      if (onPositionChange) onPositionChange(posId);
    }
  }, [initialPositionId, onPositionChange]);

  const setFieldValue = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (key === 'positionId' && onPositionChange) {
      onPositionChange(String(value));
    }
    if (touched) {
      validateForm(next, selectedFile, manualCvUrl, useLinkFallback);
    }
  };

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type) || !file.type;

    if (!isValidExt && !isValidMime) {
      return `Invalid file format. Please upload a PDF or Word document (.pdf, .doc, .docx).`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size (${formatFileSize(file.size)}) exceeds the maximum allowed limit of 10 MB.`;
    }
    return null;
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setFileError(null);
      return;
    }
    const err = validateFile(file);
    if (err) {
      setFileError(err);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setFileError(null);
      setSelectedFile(file);
      // Clear cv error
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cv;
        return next;
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (
    v: FormValues,
    file: File | null,
    cvUrl: string,
    isManualLink: boolean
  ): Partial<Record<keyof FormValues | 'cv', string>> => {
    const e: Partial<Record<keyof FormValues | 'cv', string>> = {};

    if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
    if (!v.phone.trim()) e.phone = 'Please provide a contact phone number.';
    if (!v.location.trim()) e.location = 'Please state your current city and country.';
    if (!v.positionId.trim()) e.positionId = 'Please select a position or choose General Application.';
    if (!v.experience.trim()) e.experience = 'Please indicate your years or level of professional experience.';
    if (!v.whyJoin.trim() || v.whyJoin.trim().length < 20) {
      e.whyJoin = 'Please share a brief explanation (at least 20 characters) on why you wish to join Vision Giants.';
    }

    if (v.linkedinUrl.trim() && !isUrl(v.linkedinUrl.trim())) {
      e.linkedinUrl = 'Please enter a full URL starting with https://';
    }
    if (v.portfolioUrl.trim() && !isUrl(v.portfolioUrl.trim())) {
      e.portfolioUrl = 'Please enter a full URL starting with https://';
    }

    // CV validation
    if (isManualLink) {
      if (!cvUrl.trim()) {
        e.cv = 'Please enter the shareable link to your CV.';
      } else if (!isUrl(cvUrl.trim())) {
        e.cv = 'Please enter a full link starting with https://';
      }
    } else {
      if (!file) {
        e.cv = 'Please upload your CV / Resume (PDF or DOC/DOCX).';
      }
    }

    if (!v.consent) {
      e.consent = 'Please confirm consent for our recruitment team to review your application.';
    }

    setErrors(e);
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const formErrors = validateForm(values, selectedFile, manualCvUrl, useLinkFallback);
    if (Object.keys(formErrors).length > 0) {
      const firstKey = Object.keys(formErrors)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    // Spam check
    if (honeypot.current?.value || Date.now() - startedAt.current < 2000) {
      setStatus('error');
      setStatusMessage('Submission flagged as automated. Please wait a few seconds and try again.');
      return;
    }

    if (!isFirebaseConfigured) {
      setStatus('unconfigured');
      return;
    }

    const selectedPos = positions.find((p) => p.id === values.positionId);
    const posTitle = selectedPos
      ? selectedPos.title
      : values.positionId === 'general' || !values.positionId
      ? 'General Application'
      : values.positionId.replace(/-/g, ' ');

    setSubmittedPosTitle(posTitle);

    try {
      let finalCvUrl = manualCvUrl.trim();

      // Step 1: Upload file if provided
      if (!useLinkFallback && selectedFile) {
        setStatus('uploading');
        setStatusMessage('Securely uploading your CV to our repository...');
        const uploadResult = await uploadCvFile(selectedFile);
        finalCvUrl = uploadResult.downloadUrl;
      }

      // Step 2: Submit to Firestore
      setStatus('submitting');
      setStatusMessage('Submitting your application profile...');

      const structuredMessage = [
        `Current Location: ${values.location.trim()}`,
        `Years of Experience: ${values.experience.trim()}`,
        `Why Vision Giants:\n${values.whyJoin.trim()}`,
        values.message.trim() ? `Cover Letter / Introduction:\n${values.message.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      await submitApplication({
        positionId: values.positionId,
        positionTitle: posTitle,
        department: selectedPos?.department || 'Engineering',
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        experience: values.experience.trim(),
        portfolioUrl: values.portfolioUrl.trim(),
        linkedinUrl: values.linkedinUrl.trim(),
        message: structuredMessage,
        cvUrl: finalCvUrl,
        consent: values.consent,
      });

      setStatus('success');
    } catch (err: unknown) {
      console.error('Job application submission failed:', err);
      const code = errorCode(err);
      if (code === 'functions/resource-exhausted') {
        setStatus('rate-limited');
      } else {
        setStatus('error');
        setStatusMessage(
          err instanceof Error
            ? err.message
            : 'Could not submit your application. Please verify your connection or switch to the CV link option.'
        );
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="card form-result form-result--success enter" role="status" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-6)' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.12)',
            color: '#16a34a',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto var(--space-4)',
          }}
          aria-hidden="true"
        >
          <CheckCircle2 size={36} />
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-2)' }}>Application Submitted Successfully!</h2>
        <p className="lead" style={{ maxWidth: 540, margin: '0 auto var(--space-4)' }}>
          Thank you for applying for <strong>{submittedPosTitle}</strong> at Vision Giants, <strong>{values.name}</strong>.
        </p>
        <div
          style={{
            maxWidth: 540,
            margin: '0 auto var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--color-surface-2)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            textAlign: 'left',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: 'var(--color-text)' }}>
            What happens next?
          </p>
          <ul style={{ paddingLeft: 18, margin: 0, color: 'var(--color-muted)' }}>
            <li>Our technical recruitment committee will review your CV and qualifications.</li>
            <li>If your background aligns with our open team requirements, we will reach out to <strong>{values.email}</strong> to schedule an initial technical conversation.</li>
            <li>We aim to review every application within 3 to 5 business days.</li>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/careers/" variant="primary">
            Back to Careers
          </Button>
          <Button to="/services/" variant="outline">
            Explore Our Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card form apply-form" noValidate>
      {/* Honeypot anti-spam field */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
        <label htmlFor="job-application-hp">Leave this empty</label>
        <input ref={honeypot} id="job-application-hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: PERSONAL INFORMATION
         ───────────────────────────────────────────────────────────── */}
      <div className="apply-section">
        <div className="apply-section__header">
          <div className="apply-section__icon" aria-hidden="true">
            <User size={18} />
          </div>
          <div>
            <h3 className="apply-section__title">1. Personal Information</h3>
            <p className="apply-section__desc">Basic contact details so our recruitment team can reach you.</p>
          </div>
        </div>

        <div className="form__row">
          <div className={`field${errors.name ? ' field--error' : ''}`}>
            <label htmlFor="app-name">
              Full Name <span className="req">*</span>
            </label>
            <input
              id="app-name"
              name="name"
              type="text"
              className="input"
              required
              autoComplete="name"
              placeholder="e.g. Alexander Vance"
              value={values.name}
              onChange={(e) => setFieldValue('name', e.target.value)}
            />
            {errors.name && <span className="field__error">{errors.name}</span>}
          </div>

          <div className={`field${errors.email ? ' field--error' : ''}`}>
            <label htmlFor="app-email">
              Email Address <span className="req">*</span>
            </label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" aria-hidden="true" />
              <input
                id="app-email"
                name="email"
                type="email"
                className="input"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={values.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
              />
            </div>
            {errors.email && <span className="field__error">{errors.email}</span>}
          </div>
        </div>

        <div className="form__row" style={{ marginTop: 'var(--space-4)' }}>
          <div className={`field${errors.phone ? ' field--error' : ''}`}>
            <label htmlFor="app-phone">
              Phone Number <span className="req">*</span>
            </label>
            <div className="input-with-icon">
              <Phone size={16} className="input-icon" aria-hidden="true" />
              <input
                id="app-phone"
                name="phone"
                type="tel"
                className="input"
                required
                autoComplete="tel"
                placeholder="+92 300 1234567 or +1 (555) 019-2834"
                value={values.phone}
                onChange={(e) => setFieldValue('phone', e.target.value)}
              />
            </div>
            {errors.phone && <span className="field__error">{errors.phone}</span>}
          </div>

          <div className={`field${errors.location ? ' field--error' : ''}`}>
            <label htmlFor="app-location">
              Current Location <span className="req">*</span>
            </label>
            <div className="input-with-icon">
              <MapPin size={16} className="input-icon" aria-hidden="true" />
              <input
                id="app-location"
                name="location"
                type="text"
                className="input"
                required
                placeholder="City, Country (e.g. Lahore, Pakistan or Remote)"
                value={values.location}
                onChange={(e) => setFieldValue('location', e.target.value)}
              />
            </div>
            {errors.location && <span className="field__error">{errors.location}</span>}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: PROFESSIONAL INFORMATION
         ───────────────────────────────────────────────────────────── */}
      <div className="apply-section" style={{ marginTop: 'var(--space-6)' }}>
        <div className="apply-section__header">
          <div className="apply-section__icon" aria-hidden="true">
            <Briefcase size={18} />
          </div>
          <div>
            <h3 className="apply-section__title">2. Professional Information</h3>
            <p className="apply-section__desc">Tell us about your target role, experience, and online profiles.</p>
          </div>
        </div>

        <div className="form__row">
          <div className={`field${errors.positionId ? ' field--error' : ''}`}>
            <label htmlFor="app-position">
              Position Applying For <span className="req">*</span>
            </label>
            <select
              id="app-position"
              name="positionId"
              className="input"
              value={values.positionId}
              onChange={(e) => setFieldValue('positionId', e.target.value)}
              required
            >
              <option value="">-- Select an open role --</option>
              <option value="general">🌟 General Application (Any matching role)</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} &middot; {p.department || 'Engineering'} ({p.type || 'Full-time'})
                </option>
              ))}
            </select>
            {errors.positionId && <span className="field__error">{errors.positionId}</span>}
          </div>

          <div className={`field${errors.experience ? ' field--error' : ''}`}>
            <label htmlFor="app-experience">
              Years of Experience <span className="req">*</span>
            </label>
            <select
              id="app-experience"
              name="experience"
              className="input"
              value={values.experience}
              onChange={(e) => setFieldValue('experience', e.target.value)}
              required
            >
              <option value="">-- Select experience level --</option>
              <option value="Fresh / Less than 1 year">Fresh / Less than 1 year</option>
              <option value="1 - 2 years (Junior)">1 - 2 years (Junior)</option>
              <option value="3 - 5 years (Mid-Level)">3 - 5 years (Mid-Level)</option>
              <option value="5 - 8 years (Senior)">5 - 8 years (Senior)</option>
              <option value="8+ years (Lead / Architect)">8+ years (Lead / Architect)</option>
            </select>
            {errors.experience && <span className="field__error">{errors.experience}</span>}
          </div>
        </div>

        <div className="form__row" style={{ marginTop: 'var(--space-4)' }}>
          <div className={`field${errors.linkedinUrl ? ' field--error' : ''}`}>
            <label htmlFor="app-linkedin">
              LinkedIn Profile <span className="optional">(Optional)</span>
            </label>
            <div className="input-with-icon">
              <LinkedInIcon size={16} className="input-icon" />
              <input
                id="app-linkedin"
                name="linkedinUrl"
                type="url"
                className="input"
                placeholder="https://linkedin.com/in/yourprofile"
                value={values.linkedinUrl}
                onChange={(e) => setFieldValue('linkedinUrl', e.target.value)}
              />
            </div>
            {errors.linkedinUrl && <span className="field__error">{errors.linkedinUrl}</span>}
          </div>

          <div className={`field${errors.portfolioUrl ? ' field--error' : ''}`}>
            <label htmlFor="app-portfolio">
              Portfolio / GitHub URL <span className="optional">(Optional)</span>
            </label>
            <div className="input-with-icon">
              <Globe size={16} className="input-icon" aria-hidden="true" />
              <input
                id="app-portfolio"
                name="portfolioUrl"
                type="url"
                className="input"
                placeholder="https://github.com/username or your-portfolio.com"
                value={values.portfolioUrl}
                onChange={(e) => setFieldValue('portfolioUrl', e.target.value)}
              />
            </div>
            {errors.portfolioUrl && <span className="field__error">{errors.portfolioUrl}</span>}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CV / RESUME UPLOAD
         ───────────────────────────────────────────────────────────── */}
      <div className="apply-section" style={{ marginTop: 'var(--space-6)' }}>
        <div className="apply-section__header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div className="apply-section__icon" aria-hidden="true">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="apply-section__title">
                3. CV / Resume Upload <span className="req">*</span>
              </h3>
              <p className="apply-section__desc">
                Attach your up-to-date CV in PDF or Word document format.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-text-link"
            onClick={() => {
              setUseLinkFallback((prev) => !prev);
              setErrors((errs) => {
                const next = { ...errs };
                delete next.cv;
                return next;
              });
            }}
            style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            {useLinkFallback ? '← Upload a file instead' : 'Or paste a CV link'}
          </button>
        </div>

        {!useLinkFallback ? (
          <div>
            {!selectedFile ? (
              <div
                className={`cv-dropzone${isDragging ? ' cv-dropzone--active' : ''}${errors.cv ? ' cv-dropzone--error' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                aria-label="Upload CV / Resume"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="cv-file-input"
                  name="cvFile"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <div className="cv-dropzone__icon">
                  <UploadCloud size={32} />
                </div>
                <div className="cv-dropzone__content">
                  <p className="cv-dropzone__title">
                    <strong>Click to upload</strong> or drag and drop your CV
                  </p>
                  <p className="cv-dropzone__hint">
                    Supported formats: PDF, DOC, DOCX &bull; Maximum file size: 10 MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="cv-file-card">
                <div className="cv-file-card__icon" aria-hidden="true">
                  <FileText size={28} />
                </div>
                <div className="cv-file-card__info">
                  <span className="cv-file-card__name" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <span className="cv-file-card__meta">
                    {formatFileSize(selectedFile.size)} &bull; Ready for submission
                  </span>
                </div>
                <div className="cv-file-card__actions">
                  <button
                    type="button"
                    className="btn btn--subtle btn--sm"
                    onClick={() => fileInputRef.current?.click()}
                    title="Replace with another file"
                  >
                    <RefreshCw size={14} />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn--subtle btn--sm cv-file-card__delete"
                    onClick={removeFile}
                    title="Remove file"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {fileError && <span className="field__error" style={{ display: 'block', marginTop: 8 }}>{fileError}</span>}
            {errors.cv && !fileError && (
              <span className="field__error" style={{ display: 'block', marginTop: 8 }}>{errors.cv}</span>
            )}
          </div>
        ) : (
          <div className={`field${errors.cv ? ' field--error' : ''}`}>
            <label htmlFor="app-cv-url">
              Shareable link to your CV <span className="req">*</span>
            </label>
            <div className="input-with-icon">
              <LinkIcon size={16} className="input-icon" aria-hidden="true" />
              <input
                id="app-cv-url"
                name="manualCvUrl"
                type="url"
                className="input"
                required
                placeholder="https://drive.google.com/file/d/... or Dropbox public link"
                value={manualCvUrl}
                onChange={(e) => setManualCvUrl(e.target.value)}
              />
            </div>
            <span className="field__help">
              Please ensure link sharing permissions are set to &ldquo;Anyone with the link can view&rdquo;.
            </span>
            {errors.cv && <span className="field__error">{errors.cv}</span>}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: ADDITIONAL INFORMATION
         ───────────────────────────────────────────────────────────── */}
      <div className="apply-section" style={{ marginTop: 'var(--space-6)' }}>
        <div className="apply-section__header">
          <div className="apply-section__icon" aria-hidden="true">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="apply-section__title">4. Additional Information</h3>
            <p className="apply-section__desc">Help us understand your motivation and what makes you stand out.</p>
          </div>
        </div>

        <div className={`field${errors.whyJoin ? ' field--error' : ''}`}>
          <label htmlFor="app-why-join">
            Why do you want to join Vision Giants? <span className="req">*</span>
          </label>
          <textarea
            id="app-why-join"
            name="whyJoin"
            className="input"
            rows={3}
            required
            placeholder="Share what attracts you to Vision Giants, the challenges you want to tackle, and how you see yourself contributing to our engineering team..."
            value={values.whyJoin}
            onChange={(e) => setFieldValue('whyJoin', e.target.value)}
          />
          {errors.whyJoin && <span className="field__error">{errors.whyJoin}</span>}
        </div>

        <div className={`field${errors.message ? ' field--error' : ''}`} style={{ marginTop: 'var(--space-4)' }}>
          <label htmlFor="app-cover-letter">
            Cover Letter / Short Introduction <span className="optional">(Optional)</span>
          </label>
          <textarea
            id="app-cover-letter"
            name="message"
            className="input"
            rows={4}
            placeholder="Introduce yourself, highlight recent projects you shipped, architectural decisions you are proud of, or anything else you'd like our review team to know..."
            value={values.message}
            onChange={(e) => setFieldValue('message', e.target.value)}
          />
          {errors.message && <span className="field__error">{errors.message}</span>}
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className={`field field--checkbox${errors.consent ? ' field--error' : ''}`} style={{ marginTop: 'var(--space-5)' }}>
        <label className="checkbox">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => setFieldValue('consent', e.target.checked)}
          />
          <span>
            I agree to {company.name} processing and retaining my personal information and resume for recruitment and hiring purposes in accordance with the privacy policy. <span className="req">*</span>
          </span>
        </label>
        {errors.consent && <span className="field__error">{errors.consent}</span>}
      </div>

      {/* Notices */}
      {status === 'error' && (
        <div className="alert alert--error" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          <div>
            <strong>Submission Error: </strong>
            <span>{statusMessage || 'Could not submit application. Please check your network and try again.'}</span>
          </div>
        </div>
      )}

      {status === 'rate-limited' && (
        <div className="alert alert--error" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          <div>
            <strong>Rate Limit Reached: </strong>
            <span>Too many submissions received recently. Please wait a few moments before trying again.</span>
          </div>
        </div>
      )}

      {status === 'unconfigured' && (
        <div className="alert alert--info" role="alert">
          <AlertCircle size={20} aria-hidden="true" />
          <div>
            <strong>Preview Environment: </strong>
            <span>Firebase backend configuration is pending in this environment. Your application was validated locally.</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="form__actions" style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-muted)' }}>
          🔒 Your information is transmitted securely and handled confidentially.
        </p>
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={status === 'uploading' || status === 'submitting'}
          style={{ minWidth: 220 }}
        >
          {status === 'uploading' || status === 'submitting' ? (
            <>
              <LoaderCircle size={18} className="spin" aria-hidden="true" />
              <span>{status === 'uploading' ? 'Uploading CV...' : 'Submitting...'}</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <Send size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
