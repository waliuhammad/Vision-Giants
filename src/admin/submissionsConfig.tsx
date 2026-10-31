import { useState, type ReactNode } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { getAdminStorage } from './firebase';

export type Submission = Record<string, unknown> & { id: string; status: string; notes: string; createdAt?: Date };

export interface SubmissionsConfig {
  collection: 'inquiries' | 'applications' | 'enrollments';
  title: string;
  singular: string;
  /** Allowed statuses; must match the `status in [...]` lists in firestore.rules. */
  statuses: string[];
  row: (s: Submission) => { title: string; subtitle: string };
  /** Fields matched by the search box. */
  searchKeys: string[];
  details: (s: Submission) => ReactNode;
  /** Storage paths to delete along with the record. */
  files?: (s: Submission) => string[];
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

function Detail({ label, children }: { label: string; children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="admin-detail">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

const Link = ({ href }: { href: string }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {href}
    </a>
  ) : null;

export const inquiriesConfig: SubmissionsConfig = {
  collection: 'inquiries',
  title: 'Inquiries',
  singular: 'inquiry',
  statuses: ['new', 'reviewed', 'contacted', 'closed'],
  row: (s) => ({ title: str(s.name), subtitle: [str(s.projectType), str(s.company)].filter(Boolean).join(' · ') }),
  searchKeys: ['name', 'email', 'company', 'projectType', 'message'],
  details: (s) => (
    <dl>
      <Detail label="Email">
        <a href={`mailto:${str(s.email)}`}>{str(s.email)}</a>
      </Detail>
      <Detail label="Company">{str(s.company)}</Detail>
      <Detail label="Project type">{str(s.projectType)}</Detail>
      <Detail label="Budget">{str(s.budget)}</Detail>
      <Detail label="Message">
        <p className="admin-pre">{str(s.message)}</p>
      </Detail>
    </dl>
  ),
};

function CvButton({ path, fileName }: { path: string; fileName: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const open = async () => {
    setBusy(true);
    setError('');
    // Open tab synchronously so pop-up blockers allow it
    const tab = window.open('', '_blank');
    try {
      const [storage, { ref, getDownloadURL }] = await Promise.all([getAdminStorage(), import('firebase/storage')]);
      const url = await getDownloadURL(ref(storage, path));
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      tab?.close();
      console.error(err);
      setError('Could not open the CV.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button type="button" className="btn btn--outline btn--sm" onClick={open} disabled={busy}>
        {fileName || 'Download CV'}
        <span aria-hidden="true">{busy ? <LoaderCircle size={15} className="spin" /> : <Download size={15} />}</span>
      </button>
      {error && <span className="field__error">{error}</span>}
    </>
  );
}

export const applicationsConfig: SubmissionsConfig = {
  collection: 'applications',
  title: 'Job Applications',
  singular: 'application',
  statuses: ['new', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected'],
  row: (s) => ({ title: str(s.name), subtitle: [str(s.positionTitle), str(s.experience)].filter(Boolean).join(' · ') }),
  searchKeys: ['name', 'email', 'positionTitle', 'experience', 'education', 'message'],
  details: (s) => (
    <dl>
      <Detail label="Position">{str(s.positionTitle)}</Detail>
      <Detail label="Email">
        <a href={`mailto:${str(s.email)}`}>{str(s.email)}</a>
      </Detail>
      <Detail label="Phone">{str(s.phone) && <a href={`tel:${str(s.phone)}`}>{str(s.phone)}</a>}</Detail>
      <Detail label="Experience">{str(s.experience)}</Detail>
      <Detail label="Education">{str(s.education)}</Detail>
      <Detail label="CV / Resume">
        {str(s.cvPath) ? (
          <CvButton path={str(s.cvPath)} fileName={str(s.cvFileName)} />
        ) : str(s.cvUrl) ? (
          <Link href={str(s.cvUrl)} />
        ) : null}
      </Detail>
      <Detail label="LinkedIn">{str(s.linkedinUrl) && <Link href={str(s.linkedinUrl)} />}</Detail>
      <Detail label="Portfolio / GitHub">{str(s.portfolioUrl) && <Link href={str(s.portfolioUrl)} />}</Detail>
      <Detail label="Cover Letter">{str(s.message) && <p className="admin-pre">{str(s.message)}</p>}</Detail>
    </dl>
  ),
  files: (s) => (str(s.cvPath) ? [str(s.cvPath)] : []),
};

export const enrollmentsConfig: SubmissionsConfig = {
  collection: 'enrollments',
  title: 'Student Enrollments',
  singular: 'enrollment',
  statuses: ['new_inquiry', 'contacted', 'pending', 'confirmed', 'enrolled', 'completed', 'cancelled'],
  row: (s) => ({
    title: str(s.fullName) || str(s.name),
    subtitle: [str(s.courseTitle), str(s.learningMode).toUpperCase(), str(s.city)].filter(Boolean).join(' · '),
  }),
  searchKeys: ['fullName', 'name', 'email', 'phone', 'courseTitle', 'learningMode', 'city', 'education', 'message'],
  details: (s) => (
    <dl>
      <Detail label="Course Selected">
        <strong>{str(s.courseTitle)}</strong>
      </Detail>
      <Detail label="Learning Mode">
        <span className="badge badge--primary">{str(s.learningMode).toUpperCase()}</span>
      </Detail>
      <Detail label="Preferred Batch">{str(s.preferredBatch)}</Detail>
      <Detail label="Student Name">{str(s.fullName) || str(s.name)}</Detail>
      <Detail label="Email">
        <a href={`mailto:${str(s.email)}`}>{str(s.email)}</a>
      </Detail>
      <Detail label="Phone / WhatsApp">
        <a href={`tel:${str(s.phone)}`}>{str(s.phone)}</a>
      </Detail>
      <Detail label="City">{str(s.city)}</Detail>
      <Detail label="Educational Background">{str(s.education)}</Detail>
      {str(s.classTiming) && <Detail label="Preferred Online Timing">{str(s.classTiming)}</Detail>}
      {str(s.timeZone) && <Detail label="Time Zone">{str(s.timeZone)}</Detail>}
      {str(s.preferredCampus) && <Detail label="Preferred Campus">{str(s.preferredCampus)}</Detail>}
      {str(s.hybridPreference) && <Detail label="Hybrid Session Preference">{str(s.hybridPreference)}</Detail>}
      <Detail label="Message / Goals">
        <p className="admin-pre">{str(s.message) || 'No additional message provided.'}</p>
      </Detail>
    </dl>
  ),
};
