import { useState, useRef, type FormEvent } from 'react';
import {
  X,
  Send,
  LoaderCircle,
  CircleCheck,
  CircleAlert,
  GraduationCap,
  Globe,
  MapPin,
  Laptop,
  BookOpen,
} from 'lucide-react';
import { isFirebaseConfigured, submitEnrollment } from '../../config/firebase';
import type { Course, LearningMode } from '../../data/courses';
import { Button } from '../ui/Button';

interface EnrollmentDialogProps {
  course?: Course | null;
  courses: Course[];
  initialMode?: LearningMode;
  onClose: () => void;
}

export function EnrollmentDialog({ course, courses, initialMode, onClose }: EnrollmentDialogProps) {
  const [selectedCourseId, setSelectedCourseId] = useState(course?.id || courses[0]?.id || '');
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || course || courses[0];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [learningMode, setLearningMode] = useState<LearningMode>(
    initialMode ||
      (activeCourse?.modes.online.enabled
        ? 'online'
        : activeCourse?.modes.onsite.enabled
        ? 'onsite'
        : activeCourse?.modes.hybrid.enabled
        ? 'hybrid'
        : 'selfPaced')
  );
  const [preferredBatch, setPreferredBatch] = useState('Upcoming Batch (Next Month)');
  const [city, setCity] = useState('');
  const [education, setEducation] = useState('');
  const [message, setMessage] = useState('');

  // Conditional fields
  const [classTiming, setClassTiming] = useState(activeCourse?.modes.online.timings || 'Evening (7:00 PM - 9:00 PM)');
  const [timeZone, setTimeZone] = useState('GMT+5 (Pakistan Standard Time)');
  const [preferredCampus, setPreferredCampus] = useState(activeCourse?.modes.onsite.campusName || 'Gulberg III Campus, Lahore');
  const [hybridPreference, setHybridPreference] = useState('Equal Online & Weekend Onsite Labs');

  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (honeypot.current?.value) {
      setError('Invalid request detected.');
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setError('Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (!consent) {
      setError('Please confirm the declaration to submit your enrollment application.');
      return;
    }

    if (!isFirebaseConfigured) {
      setError('Firebase is not configured. Please contact the administrator.');
      return;
    }

    setBusy(true);
    try {
      await submitEnrollment({
        courseId: activeCourse?.id || 'general-course',
        courseTitle: activeCourse?.title || 'Tech Training Program',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        learningMode,
        preferredBatch,
        city: city.trim() || 'Not specified',
        education: education.trim(),
        message: message.trim(),
        classTiming: learningMode === 'online' ? classTiming : undefined,
        timeZone: learningMode === 'online' ? timeZone : undefined,
        preferredCampus: learningMode === 'onsite' || learningMode === 'hybrid' ? preferredCampus : undefined,
        hybridPreference: learningMode === 'hybrid' ? hybridPreference : undefined,
        consent,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Could not submit enrollment. Please try again or reach out on WhatsApp.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="course-modal-backdrop" onClick={onClose}>
      <div
        className="course-modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="course-modal__head">
          <div>
            <span className="badge badge--primary">Academy Enrollment</span>
            <h2 id="enrollment-modal-title">Enroll in {activeCourse?.title || 'Technology Course'}</h2>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              Fill out the form below to secure your batch seat. Our academic coordinators will reach out with onboarding materials.
            </p>
          </div>
          <button type="button" className="course-modal__close" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="course-modal__success" role="status">
            <span className="icon-wrap" aria-hidden="true">
              <CircleCheck size={36} />
            </span>
            <h3>Enrollment Application Submitted!</h3>
            <p>
              Thank you, <strong>{fullName}</strong>. Your enrollment for <strong>{activeCourse?.title}</strong> ({learningMode.toUpperCase()} mode) has been recorded.
            </p>
            <p className="muted">
              Our training coordinator will contact you via WhatsApp / email within 24 business hours to share your
              syllabus, orientation schedule, and fee submission details.
            </p>
            <div style={{ marginTop: 'var(--space-5)' }}>
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="course-modal__form" noValidate>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
              <label htmlFor="course-hp">Company</label>
              <input ref={honeypot} id="course-hp" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid grid--2">
              <div className="field">
                <label htmlFor="enroll-course">Selected Course *</label>
                <select
                  id="enroll-course"
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    const c = courses.find((item) => item.id === e.target.value);
                    if (c) {
                      if (!c.modes[learningMode]?.enabled) {
                        const first = (['online', 'onsite', 'hybrid', 'selfPaced'] as const).find((m) => c.modes[m]?.enabled);
                        if (first) setLearningMode(first);
                      }
                    }
                  }}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="enroll-mode">Learning Mode *</label>
                <select
                  id="enroll-mode"
                  value={learningMode}
                  onChange={(e) => setLearningMode(e.target.value as LearningMode)}
                >
                  {activeCourse?.modes.online.enabled && <option value="online">Online Live Classes</option>}
                  {activeCourse?.modes.onsite.enabled && <option value="onsite">Onsite Physical Campus</option>}
                  {activeCourse?.modes.hybrid.enabled && <option value="hybrid">Hybrid (Online + Campus Labs)</option>}
                  {activeCourse?.modes.selfPaced.enabled && <option value="selfPaced">Self-Paced Recorded</option>}
                </select>
              </div>
            </div>

            <div className="grid grid--2">
              <div className="field">
                <label htmlFor="enroll-name">Full Name *</label>
                <input
                  id="enroll-name"
                  type="text"
                  required
                  placeholder="e.g. Ahmad Khan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="enroll-email">Email Address *</label>
                <input
                  id="enroll-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid--2">
              <div className="field">
                <label htmlFor="enroll-phone">Phone / WhatsApp Number *</label>
                <input
                  id="enroll-phone"
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="enroll-city">Your City *</label>
                <input
                  id="enroll-city"
                  type="text"
                  placeholder="e.g. Lahore / Islamabad / Karachi / Remote"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid--2">
              <div className="field">
                <label htmlFor="enroll-batch">Preferred Batch</label>
                <select id="enroll-batch" value={preferredBatch} onChange={(e) => setPreferredBatch(e.target.value)}>
                  <option value="Upcoming Batch (Next Month)">Upcoming Batch (Next Month)</option>
                  <option value="Weekend Intensive Batch">Weekend Intensive Batch</option>
                  <option value="Flexible / Immediate Access">Flexible / Immediate Access</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="enroll-edu">Educational Background</label>
                <input
                  id="enroll-edu"
                  type="text"
                  placeholder="e.g. BS CS, FSC Pre-Eng, BBA, High School"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>
            </div>

            {/* Conditional fields based on learning mode */}
            {learningMode === 'online' && (
              <div className="grid grid--2 course-conditional-block">
                <div className="field">
                  <label htmlFor="online-timing">Preferred Online Class Timing</label>
                  <select id="online-timing" value={classTiming} onChange={(e) => setClassTiming(e.target.value)}>
                    <option value="Evening (7:00 PM - 9:00 PM PKT)">Evening (7:00 PM - 9:00 PM PKT)</option>
                    <option value="Night (8:30 PM - 10:30 PM PKT)">Night (8:30 PM - 10:30 PM PKT)</option>
                    <option value="Weekend Mornings (10:00 AM - 1:00 PM PKT)">Weekend Mornings (10:00 AM - 1:00 PM PKT)</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="online-tz">Your Time Zone</label>
                  <input
                    id="online-tz"
                    type="text"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                  />
                </div>
              </div>
            )}

            {(learningMode === 'onsite' || learningMode === 'hybrid') && (
              <div className="grid grid--2 course-conditional-block">
                <div className="field">
                  <label htmlFor="onsite-campus">Preferred Campus</label>
                  <input
                    id="onsite-campus"
                    type="text"
                    value={preferredCampus}
                    onChange={(e) => setPreferredCampus(e.target.value)}
                  />
                </div>
                {learningMode === 'hybrid' && (
                  <div className="field">
                    <label htmlFor="hybrid-pref">Session Preference</label>
                    <select
                      id="hybrid-pref"
                      value={hybridPreference}
                      onChange={(e) => setHybridPreference(e.target.value)}
                    >
                      <option value="Equal Online & Weekend Onsite Labs">Equal Online & Weekend Onsite Labs</option>
                      <option value="Primarily Online with Monthly Milestone Labs">Primarily Online with Monthly Milestone Labs</option>
                      <option value="Primarily Onsite with Recorded Backups">Primarily Onsite with Recorded Backups</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="enroll-msg">Questions or Additional Goals (Optional)</label>
              <textarea
                id="enroll-msg"
                rows={2}
                placeholder="Tell us what you hope to achieve (e.g. career switch, startup idea, freelance client acquisition)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="field field--checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I agree to receive course syllabus, fee schedule, and admission confirmation details from Vision Giants Academy.
                </span>
              </label>
            </div>

            {error && (
              <div className="form-notice form-notice--error" role="alert">
                <CircleAlert size={18} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="course-modal__actions">
              <button type="button" className="btn btn--outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={busy}>
                {busy ? (
                  <>
                    <LoaderCircle size={18} className="spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Enrollment
                    <Send size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

