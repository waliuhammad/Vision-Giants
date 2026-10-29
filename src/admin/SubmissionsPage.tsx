import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Trash2, Save, Mail, CircleAlert, Inbox, Check, Copy } from 'lucide-react';
import { company } from '../data/company';
import { getAdminDb, getAdminStorage } from './firebase';
import type { Submission, SubmissionsConfig } from './submissionsConfig';

const formatDate = (d?: Date) =>
  d ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d) : '';

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** List + detail view for documents created by the public forms (inquiries, applications). */
export function SubmissionsPage({ config }: { config: SubmissionsConfig }) {
  const [items, setItems] = useState<Submission[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [db, { collection, getDocs, query, orderBy, limit }] = await Promise.all([getAdminDb(), import('firebase/firestore/lite')]);
      const snap = await getDocs(query(collection(db, config.collection), orderBy('createdAt', 'desc'), limit(500)));
      setItems(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            status: typeof data.status === 'string' ? data.status : 'new',
            notes: typeof data.notes === 'string' ? data.notes : '',
            createdAt: data.createdAt?.toDate?.(),
          };
        }),
      );
    } catch (err) {
      console.error(err);
      setError(`Could not load ${config.title.toLowerCase()}.`);
    }
  }, [config]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (items ?? []).filter(
      (s) =>
        (filter === 'all' || s.status === filter) &&
        (!q || config.searchKeys.some((k) => String(s[k] ?? '').toLowerCase().includes(q))),
    );
  }, [items, filter, search, config]);

  const selected = items?.find((s) => s.id === selectedId) ?? null;
  const counts = (status: string) => (items ?? []).filter((s) => status === 'all' || s.status === status).length;

  const onSaved = (updated: Submission) => setItems((list) => list?.map((s) => (s.id === updated.id ? updated : s)) ?? null);
  const onDeleted = (id: string) => {
    setItems((list) => list?.filter((s) => s.id !== id) ?? null);
    setSelectedId(null);
  };

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Submissions</p>
          <h1>{config.title}</h1>
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => { setItems(null); load(); }}>
          Refresh
          <span aria-hidden="true">
            <RefreshCw size={15} />
          </span>
        </button>
      </header>

      <div className="admin-toolbar">
        <div className="admin-chips" role="group" aria-label="Filter by status">
          {['all', ...config.statuses].map((s) => (
            <button key={s} type="button" className="admin-chip" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : statusLabel(s)} <span>{counts(s)}</span>
            </button>
          ))}
        </div>
        <input className="input admin-search" type="search" placeholder="Search…" aria-label={`Search ${config.title.toLowerCase()}`} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      <div className={`admin-split${selected ? ' admin-split--open' : ''}`}>
        <div className="card admin-list">
          {items === null && !error && <p className="admin-empty">Loading…</p>}
          {items !== null && visible.length === 0 && (
            <div className="admin-empty">
              <Inbox size={22} aria-hidden="true" />
              <p>{items.length === 0 ? `No ${config.title.toLowerCase()} yet.` : 'Nothing matches this filter.'}</p>
            </div>
          )}
          <ul>
            {visible.map((s) => {
              const row = config.row(s);
              return (
                <li key={s.id}>
                  <button type="button" className="admin-row" aria-current={s.id === selectedId} onClick={() => setSelectedId(s.id)}>
                    <span className="admin-row__main">
                      <strong>{row.title}</strong>
                      <span className="muted">{row.subtitle}</span>
                    </span>
                    <span className="admin-row__meta">
                      <span className={`admin-status admin-status--${s.status}`}>{statusLabel(s.status)}</span>
                      <small className="muted">{formatDate(s.createdAt)}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {selected && (
          <SubmissionDetail
            key={selected.id}
            config={config}
            item={selected}
            onClose={() => setSelectedId(null)}
            onSaved={onSaved}
            onDeleted={onDeleted}
          />
        )}
      </div>
    </div>
  );
}

function SubmissionDetail({
  config,
  item,
  onClose,
  onSaved,
  onDeleted,
}: {
  config: SubmissionsConfig;
  item: Submission;
  onClose: () => void;
  onSaved: (s: Submission) => void;
  onDeleted: (id: string) => void;
}) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dirty = status !== item.status || notes !== item.notes;
  const row = config.row(item);
  const email = typeof item.email === 'string' ? item.email : '';

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      const [db, { doc, updateDoc, serverTimestamp }] = await Promise.all([getAdminDb(), import('firebase/firestore/lite')]);
      await updateDoc(doc(db, config.collection, item.id), { status, notes, updatedAt: serverTimestamp() });
      onSaved({ ...item, status, notes });
    } catch (err) {
      console.error(err);
      setError('Could not save changes.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete this ${config.singular} from ${row.title}? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      const paths = config.files?.(item) ?? [];
      if (paths.length) {
        const [storage, { ref, deleteObject }] = await Promise.all([getAdminStorage(), import('firebase/storage')]);
        await Promise.all(
          paths.map((p) =>
            deleteObject(ref(storage, p)).catch((err) => {
              if (err?.code !== 'storage/object-not-found') throw err;
            }),
          ),
        );
      }
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), import('firebase/firestore/lite')]);
      await deleteDoc(doc(db, config.collection, item.id));
      onDeleted(item.id);
    } catch (err) {
      console.error(err);
      setError(`Could not delete this ${config.singular}.`);
      setBusy(false);
    }
  };

  return (
    <section className="card admin-detail-pane" aria-label={`${config.singular} details`}>
      <div className="admin-detail-pane__head">
        <div>
          <h2>{row.title}</h2>
          <p className="muted">Received {formatDate(item.createdAt)}</p>
        </div>
        <button type="button" className="admin-link" onClick={onClose}>
          Close
        </button>
      </div>

      {config.details(item)}

      <div className="admin-detail-pane__manage">
        <div className="field">
          <label htmlFor="sub-status">Status</label>
          <select id="sub-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {config.statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sub-notes">Internal notes</label>
          <textarea id="sub-notes" className="input" rows={4} maxLength={5000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {error && <p className="field__error">{error}</p>}
        <div className="admin-actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={save} disabled={!dirty || busy}>
            Save
            <span aria-hidden="true">
              <Save size={15} />
            </span>
          </button>
          {email && <ReplyActions item={item} email={email} collection={config.collection} />}
          <button type="button" className="btn btn--outline btn--sm admin-danger" onClick={remove} disabled={busy}>
            Delete
            <span aria-hidden="true">
              <Trash2 size={15} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * Reply options. A plain mailto: link does nothing on computers without a default email app (common
 * on Windows with webmail), so the main button opens a pre-filled Gmail draft in a new tab; the
 * desktop email app and copying the address are offered as alternatives.
 */
function ReplyActions({ item, email, collection }: { item: Submission; email: string; collection: SubmissionsConfig['collection'] }) {
  const [copied, setCopied] = useState(false);
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const firstName = str(item.name).split(/\s+/)[0] || 'there';
  const original = str(item.message);

  const subject =
    collection === 'inquiries'
      ? `Re: Your ${str(item.projectType) || 'project'} inquiry – ${company.name}`
      : `Your application – ${str(item.positionTitle) || 'General application'} – ${company.name}`;
  const intro =
    collection === 'inquiries'
      ? `Thank you for contacting ${company.name}${str(item.projectType) ? ` about ${str(item.projectType)}` : ''}.`
      : `Thank you for applying to ${company.name}.`;
  const body = [
    `Hi ${firstName},`,
    '',
    intro,
    '',
    '',
    '',
    'Best regards,',
    company.name,
    ...(original ? ['', '---', 'Your message:', original] : []),
  ].join('\n');

  // encodeURIComponent, not URLSearchParams: Gmail can show URLSearchParams' "+" for spaces literally.
  const gmailQuery = { view: 'cm', fs: '1', to: email, su: subject, body };
  const gmail = `https://mail.google.com/mail/?${Object.entries(gmailQuery)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')}`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy the email address:', email);
    }
  };

  return (
    <>
      <a className="btn btn--outline btn--sm" href={gmail} target="_blank" rel="noopener noreferrer">
        Reply in Gmail
        <span aria-hidden="true">
          <Mail size={15} />
        </span>
      </a>
      <a className="btn btn--outline btn--sm" href={mailto}>
        Email app
      </a>
      <button type="button" className="btn btn--outline btn--sm" onClick={copy}>
        {copied ? 'Copied' : 'Copy email'}
        <span aria-hidden="true">{copied ? <Check size={15} /> : <Copy size={15} />}</span>
      </button>
    </>
  );
}
