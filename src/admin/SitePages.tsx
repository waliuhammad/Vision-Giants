import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ChevronRight, CircleAlert, CircleCheck, ExternalLink, FileText, RotateCcw, Save } from 'lucide-react';
import { getAdminDb } from './firebase';
import { pageDefs, pageTextsFromDoc, type PageDef } from '../content/pages';

const firestore = () => import('firebase/firestore/lite');

/** Admin → Site pages: the list of pages whose text can be edited. */
export function SitePagesList() {
  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Website content</p>
          <h1>Site pages</h1>
        </div>
      </header>
      <p className="muted admin-pages__intro">
        Edit the headings and intro text on each page. Services and open positions are edited in their own sections, and the About Us page has its dedicated editor with team member management.
      </p>
      <ul className="admin-pages">
        <li>
          <Link to="/admin/about-page" className="card admin-pages__item" style={{ borderLeft: '3px solid var(--color-primary)' }}>
            <span className="icon-wrap" aria-hidden="true">
              <FileText size={18} />
            </span>
            <span className="admin-pages__text">
              <strong>About Us (Full Management)</strong>
              <small>/about/ · Hero, Who We Are, Mission & Vision, Core Values, Why Choose Us, Team CRUD & CTA</small>
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </li>
        {pageDefs.map((p) => (
          <li key={p.id}>
            <Link to={`/admin/pages/${p.id}`} className="card admin-pages__item">
              <span className="icon-wrap" aria-hidden="true">
                <FileText size={18} />
              </span>
              <span className="admin-pages__text">
                <strong>{p.title}</strong>
                <small>
                  {p.path} · {p.sections.reduce((n, s) => n + s.fields.length, 0)} editable texts
                </small>
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Admin → Site pages → one page: every editable text, grouped by section. */
export function SitePageEditor() {
  const { id } = useParams<{ id: string }>();
  const def = pageDefs.find((p) => p.id === id);
  if (!def) {
    return (
      <div className="admin-page">
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>That page doesn’t exist.</span>
        </p>
        <Link to="/admin/pages" className="btn btn--outline btn--sm">
          <ArrowLeft size={15} aria-hidden="true" /> All pages
        </Link>
      </div>
    );
  }
  return <Editor key={def.id} def={def} />;
}

function Editor({ def }: { def: PageDef }) {
  const fields = def.sections.flatMap((s) => s.fields);
  const defaults = Object.fromEntries(fields.map((f) => [f.key, f.default]));
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', def.id));
        setValues({ ...defaults, ...(snap.exists() ? pageTextsFromDoc(def.id, snap.data()) : {}) });
      } catch (err) {
        console.error(err);
        setError('Could not load the saved text. Showing the built-in text.');
        setValues({ ...defaults });
      }
    })();
    // Loaded once per page; `defaults` is derived from `def`
  }, [def.id]);

  const set = (key: string, value: string) => {
    setValues((v) => (v ? { ...v, [key]: value } : v));
    setSaved(false);
    setNotice('');
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!values) return;
    setBusy(true);
    setError('');
    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      // Only store text that differs from the built-in default; empty fields fall back to it.
      const changed = Object.fromEntries(
        fields.map((f) => [f.key, values[f.key].trim()]).filter(([k, v]) => v && v !== defaults[k]),
      );
      await setDoc(doc(db, 'pages', def.id), { ...changed, updatedAt: serverTimestamp() });
      setSaved(true);
      setNotice('Saved. Reload the page on the website to see the changes.');
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
          <Link to="/admin/pages" className="admin-pages__back">
            <ArrowLeft size={15} aria-hidden="true" /> Site pages
          </Link>
          <h1>{def.title} page</h1>
        </div>
        <div className="admin-actions">
          <a className="btn btn--outline btn--sm" href={def.path} target="_blank" rel="noopener noreferrer">
            View on site
            <span aria-hidden="true">
              <ExternalLink size={15} />
            </span>
          </a>
        </div>
      </header>

      {!values ? (
        <p className="admin-empty card">Loading…</p>
      ) : (
        <form className="form admin-profile" onSubmit={save} noValidate>
          <p className="muted admin-pages__intro">
            Wrap words in *asterisks* in a heading to show them in blue. Leave a field empty to use the original text.
          </p>
          {def.sections.map((section) => (
            <section key={section.title} className="card admin-profile__section">
              <h2>{section.title}</h2>
              {section.fields.map((f) => {
                const id = `pg-${f.key}`;
                const changed = values[f.key].trim() !== f.default;
                return (
                  <div className="field" key={f.key}>
                    <div className="admin-pages__label">
                      <label htmlFor={id}>{f.label}</label>
                      {changed && (
                        <button type="button" className="admin-link" onClick={() => set(f.key, f.default)}>
                          <RotateCcw size={13} aria-hidden="true" /> Reset
                        </button>
                      )}
                    </div>
                    {f.long ? (
                      <textarea id={id} className="input" rows={3} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                    ) : (
                      <input id={id} className="input" value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                    )}
                  </div>
                );
              })}
            </section>
          ))}

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
