import { useState, type ReactNode } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { getAdminStorage } from './firebase';

export type Submission = Record<string, unknown> & { id: string; status: string; notes: string; createdAt?: Date };

export interface SubmissionsConfig {
  collection: 'inquiries' | 'applications';
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
  statuses: ['new', 'contacted', 'closed'],
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
    // Open the tab synchronously so pop-up blockers allow it, then point it at the file.
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
  title: 'Applications',
  singular: 'application',
  statuses: ['new', 'reviewing', 'interview', 'rejected', 'hired'],
  row: (s) => ({ title: str(s.name), subtitle: str(s.positionTitle) }),
  searchKeys: ['name', 'email', 'positionTitle', 'message'],
  details: (s) => (
    <dl>
      <Detail label="Position">{str(s.positionTitle)}</Detail>
      <Detail label="Email">
        <a href={`mailto:${str(s.email)}`}>{str(s.email)}</a>
      </Detail>
      <Detail label="Phone">{str(s.phone) && <a href={`tel:${str(s.phone)}`}>{str(s.phone)}</a>}</Detail>
      <Detail label="CV">
        {str(s.cvPath) ? <CvButton path={str(s.cvPath)} fileName={str(s.cvFileName)} /> : str(s.cvUrl) && <Link href={str(s.cvUrl)} />}
      </Detail>
      <Detail label="LinkedIn">{str(s.linkedinUrl) && <Link href={str(s.linkedinUrl)} />}</Detail>
      <Detail label="Portfolio">{str(s.portfolioUrl) && <Link href={str(s.portfolioUrl)} />}</Detail>
      <Detail label="About">{str(s.message) && <p className="admin-pre">{str(s.message)}</p>}</Detail>
    </dl>
  ),
  files: (s) => (str(s.cvPath) ? [str(s.cvPath)] : []),
};
