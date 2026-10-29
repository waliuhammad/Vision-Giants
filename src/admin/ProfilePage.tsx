import { useEffect, useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck, ExternalLink, Plus, Save, Trash2 } from 'lucide-react';
import { getAdminDb } from './firebase';
import { profileFromDoc } from '../content/schema';
import { defaultProfile, type CompanyProfile, type ProfileAward, type ProfileFact } from '../data/profile';

const firestore = () => import('firebase/firestore/lite');

type TextKey = 'bio' | 'introTitle' | 'introText' | 'whoWeAre' | 'whatWeDo' | 'mission' | 'vision';

const textFields: { key: TextKey; label: string; rows?: number; help?: string }[] = [
  { key: 'bio', label: 'Bio (centred at the top)', rows: 4, help: 'About three lines.' },
  { key: 'introTitle', label: 'Intro heading (left of the image)' },
  { key: 'introText', label: 'Intro text (left of the image)', rows: 3 },
  { key: 'whoWeAre', label: 'Who we are', rows: 5, help: 'Leave a blank line between paragraphs.' },
  { key: 'mission', label: 'Our mission', rows: 2 },
  { key: 'vision', label: 'Our vision', rows: 2 },
];

/** Editor for the company profile on the Portfolio page (Firestore `pages/portfolio`). */
export function ProfilePage() {
  const [draft, setDraft] = useState<CompanyProfile | null>(null);
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', 'portfolio'));
        setDraft(snap.exists() ? profileFromDoc(snap.data()) : defaultProfile);
      } catch (err) {
        console.error(err);
        setError('Could not load the Portfolio page.');
        setDraft(defaultProfile);
      }
    })();
  }, []);

  const update = (patch: Partial<CompanyProfile>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setSaved(false);
    setNotice('');
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError('');
    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const clean = (items: ProfileAward[]) =>
        items
          .filter((a) => a.title.trim())
          .map((a) => ({ title: a.title.trim(), issuer: a.issuer.trim(), year: a.year.trim(), ...(a.placeholder ? { placeholder: true } : {}) }));
      await setDoc(doc(db, 'pages', 'portfolio'), {
        ...Object.fromEntries(textFields.map(({ key }) => [key, draft[key].trim()])),
        facts: draft.facts.filter((f) => f.label.trim() && f.value.trim()).map((f) => ({ label: f.label.trim(), value: f.value.trim() })),
        certifications: clean(draft.certifications),
        honours: clean(draft.honours),
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setNotice('Saved. Reload the Portfolio page to see the changes.');
    } catch (err) {
      console.error(err);
      setError('Could not save. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Website content</p>
          <h1>Portfolio page</h1>
        </div>
        <div className="admin-actions">
          <a className="btn btn--outline btn--sm" href="/portfolio/" target="_blank" rel="noopener noreferrer">
            View on site
            <span aria-hidden="true">
              <ExternalLink size={15} />
            </span>
          </a>
        </div>
      </header>

      {!draft ? (
        <p className="admin-empty card">Loading…</p>
      ) : (
        <form className="form admin-profile" onSubmit={save} noValidate>
          <section className="card admin-profile__section">
            <h2>Text</h2>
            {textFields.map(({ key, label, rows, help }) => (
              <div className="field" key={key}>
                <label htmlFor={`pf-${key}`}>{label}</label>
                {rows ? (
                  <textarea id={`pf-${key}`} className="input" rows={rows} value={draft[key]} onChange={(e) => update({ [key]: e.target.value })} />
                ) : (
                  <input id={`pf-${key}`} className="input" value={draft[key]} onChange={(e) => update({ [key]: e.target.value })} />
                )}
                {help && <small className="muted">{help}</small>}
              </div>
            ))}
          </section>

          <section className="card admin-profile__section">
            <h2>Key facts</h2>
            <p className="muted">Shown under the intro text, e.g. “Headquarters: Multan, Pakistan”.</p>
            <RowsEditor<ProfileFact>
              items={draft.facts}
              columns={[
                { key: 'label', label: 'Label' },
                { key: 'value', label: 'Value' },
              ]}
              blank={{ label: '', value: '' }}
              addLabel="Add fact"
              onChange={(facts) => update({ facts })}
            />
          </section>

          <AwardsEditor title="Certifications" items={draft.certifications} onChange={(certifications) => update({ certifications })} />
          <AwardsEditor title="Honours & awards" items={draft.honours} onChange={(honours) => update({ honours })} />

          <div className="admin-profile__bar">
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
            <button type="submit" className="btn btn--primary btn--sm" disabled={busy || saved}>
              {busy ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
              <span aria-hidden="true">
                <Save size={15} />
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function AwardsEditor({ title, items, onChange }: { title: string; items: ProfileAward[]; onChange: (items: ProfileAward[]) => void }) {
  return (
    <section className="card admin-profile__section">
      <h2>{title}</h2>
      <p className="muted">
        Entries marked “Placeholder” show a placeholder badge on the website until you edit them. Remove all entries to hide
        the section.
      </p>
      <RowsEditor<ProfileAward>
        items={items}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'issuer', label: 'Issued / awarded by' },
          { key: 'year', label: 'Year', narrow: true },
        ]}
        blank={{ title: '', issuer: '', year: '' }}
        addLabel="Add entry"
        // Editing a placeholder turns it into a real entry.
        onChange={(next) => onChange(next)}
        onEdit={(item) => ({ ...item, placeholder: undefined })}
        badge={(item) => (item.placeholder ? 'Placeholder' : '')}
      />
    </section>
  );
}

function RowsEditor<T extends object>({
  items,
  columns,
  blank,
  addLabel,
  onChange,
  onEdit = (item) => item,
  badge,
}: {
  items: T[];
  columns: { key: keyof T & string; label: string; narrow?: boolean }[];
  blank: T;
  addLabel: string;
  onChange: (items: T[]) => void;
  onEdit?: (item: T) => T;
  badge?: (item: T) => string;
}) {
  const set = (index: number, key: keyof T, value: string) =>
    onChange(items.map((item, i) => (i === index ? onEdit({ ...item, [key]: value }) : item)));

  return (
    <div className="admin-rows">
      {items.map((item, i) => (
        <div className="admin-rows__row" key={i}>
          {columns.map((c) => (
            <input
              key={c.key}
              className={`input${c.narrow ? ' admin-rows__narrow' : ''}`}
              aria-label={`${c.label} ${i + 1}`}
              placeholder={c.label}
              value={String(item[c.key] ?? '')}
              onChange={(e) => set(i, c.key, e.target.value)}
            />
          ))}
          {badge?.(item) && <span className="admin-status">{badge(item)}</span>}
          <button
            type="button"
            className="admin-icon-btn"
            aria-label={`Remove row ${i + 1}`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn--outline btn--sm" onClick={() => onChange([...items, { ...blank }])}>
        {addLabel}
        <span aria-hidden="true">
          <Plus size={15} />
        </span>
      </button>
    </div>
  );
}
