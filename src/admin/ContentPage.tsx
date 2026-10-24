import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, CircleAlert, ExternalLink, Info, LoaderCircle, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { getAdminDb, getAdminStorage } from './firebase';
import { builtInItems, projectsConfig, servicesConfig, positionsConfig, type ContentConfig, type FieldDef } from './contentConfig';

type Item = Record<string, unknown> & { id: string; order: number; published: boolean };
/** Editor state: every field as the string/boolean its input works with. */
type Draft = Record<string, string | boolean>;

const firestore = () => import('firebase/firestore/lite');
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 80);

function toDraft(config: ContentConfig, item: Record<string, unknown> | null): Draft {
  const draft: Draft = { id: String(item?.id ?? ''), published: item ? item.published !== false : true };
  for (const f of config.fields) {
    const v = item?.[f.key];
    if (f.kind === 'checkbox') draft[f.key] = v === true;
    else if (f.kind === 'lines') draft[f.key] = Array.isArray(v) ? v.join('\n') : '';
    else if (f.kind === 'tags') draft[f.key] = Array.isArray(v) ? v.join(', ') : '';
    else draft[f.key] = typeof v === 'string' ? v : (f.options?.[0]?.value ?? '');
  }
  return draft;
}

function fromDraft(config: ContentConfig, draft: Draft): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const f of config.fields) {
    const v = draft[f.key];
    if (f.kind === 'checkbox') data[f.key] = v === true;
    else if (f.kind === 'lines') data[f.key] = String(v).split('\n').map((s) => s.trim()).filter(Boolean);
    else if (f.kind === 'tags') data[f.key] = String(v).split(',').map((s) => s.trim()).filter(Boolean);
    else data[f.key] = String(v).trim();
  }
  return data;
}

/** Copies the built-in content (src/data) into Firestore and switches the site to Firestore content. */
async function importBuiltInContent() {
  const [db, { collection, doc, getDocs, writeBatch, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
  const batch = writeBatch(db);
  for (const config of [projectsConfig, servicesConfig, positionsConfig]) {
    const existing = new Set((await getDocs(collection(db, config.collection))).docs.map((d) => d.id));
    builtInItems(config.collection).forEach(({ id, ...rest }, i) => {
      if (existing.has(id)) return;
      batch.set(doc(db, config.collection, id), { ...rest, published: true, order: (i + 1) * 10, updatedAt: serverTimestamp() });
    });
  }
  batch.set(doc(db, 'config', 'public'), { contentManaged: true, updatedAt: serverTimestamp() }, { merge: true });
  await batch.commit();
}

export function ContentPage({ config }: { config: ContentConfig }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [managed, setManaged] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Item | 'new' | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const [db, { collection, doc, getDoc, getDocs }] = await Promise.all([getAdminDb(), firestore()]);
      const [cfg, snap] = await Promise.all([getDoc(doc(db, 'config', 'public')), getDocs(collection(db, config.collection))]);
      setManaged(cfg.get('contentManaged') === true);
      setItems(
        snap.docs
          .map((d) => ({ ...d.data(), id: d.id, order: Number(d.get('order')) || 0, published: d.get('published') === true }))
          .sort((a, b) => a.order - b.order),
      );
    } catch (err) {
      console.error(err);
      setError(`Could not load ${config.title.toLowerCase()}.`);
    }
  }, [config]);

  useEffect(() => {
    load();
  }, [load]);

  const runImport = async () => {
    setBusy(true);
    setError('');
    try {
      await importBuiltInContent();
      await load();
    } catch (err) {
      console.error(err);
      setError('Import failed. Nothing was changed.');
    } finally {
      setBusy(false);
    }
  };

  /** Swaps the order of two neighbouring items. */
  const move = async (index: number, delta: -1 | 1) => {
    if (!items) return;
    const a = items[index];
    const b = items[index + delta];
    if (!a || !b) return;
    // Items imported or created at the same position get distinct orders first.
    const [orderA, orderB] = a.order === b.order ? [b.order + delta, a.order] : [b.order, a.order];
    setBusy(true);
    try {
      const [db, { doc, writeBatch }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);
      batch.update(doc(db, config.collection, a.id), { order: orderA });
      batch.update(doc(db, config.collection, b.id), { order: orderB });
      await batch.commit();
      await load();
    } catch (err) {
      console.error(err);
      setError('Could not reorder.');
    } finally {
      setBusy(false);
    }
  };

  const label = (item: Record<string, unknown>) => String(item[config.labelKey] || item.id);

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <h1>{config.title}</h1>
        <div className="admin-actions">
          <a className="btn btn--outline btn--sm" href={config.publicPath} target="_blank" rel="noopener noreferrer">
            View on site
            <span aria-hidden="true">
              <ExternalLink size={15} />
            </span>
          </a>
          {managed && (
            <button type="button" className="btn btn--primary btn--sm" onClick={() => setEditing('new')}>
              Add {config.singular}
              <span aria-hidden="true">
                <Plus size={15} />
              </span>
            </button>
          )}
        </div>
      </header>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {managed === false && (
        <div className="card admin-banner">
          <Info size={20} aria-hidden="true" />
          <div>
            <h2>The website is showing its built-in content</h2>
            <p className="muted">
              To manage portfolio projects, services and open positions here, import the built-in content first. Everything
              currently on the site is copied into the database (including the “Concept” projects, which you can then edit or
              delete), and from then on the site shows what you publish here.
            </p>
            <button type="button" className="btn btn--primary btn--sm" onClick={runImport} disabled={busy}>
              {busy ? 'Importing…' : 'Import content & start managing'}
            </button>
          </div>
        </div>
      )}

      <div className={`admin-split${editing ? ' admin-split--open' : ''}`}>
        <div className="card admin-list">
          {items === null && !error && <p className="admin-empty">Loading…</p>}
          {managed === false && items !== null && (
            <ul aria-label="Built-in content (read-only)">
              {builtInItems(config.collection).map((item) => (
                <li key={item.id} className="admin-row admin-row--static">
                  <span className="admin-row__main">
                    <strong>{label(item)}</strong>
                    <span className="muted">{config.sublabel(item)}</span>
                  </span>
                  <span className="admin-status">Built-in</span>
                </li>
              ))}
              {builtInItems(config.collection).length === 0 && <li className="admin-empty">No built-in {config.title.toLowerCase()}.</li>}
            </ul>
          )}
          {managed && items !== null && items.length === 0 && (
            <p className="admin-empty">No {config.title.toLowerCase()} yet. Use “Add {config.singular}” to create one.</p>
          )}
          {managed && items !== null && (
            <ul>
              {items.map((item, i) => (
                <li key={item.id} className="admin-row admin-row--static" aria-current={editing !== 'new' && editing?.id === item.id}>
                  <span className="admin-row__main">
                    <strong>{label(item)}</strong>
                    <span className="muted">{config.sublabel(item)}</span>
                  </span>
                  <span className="admin-row__tools">
                    <span className={`admin-status admin-status--${item.published ? 'published' : 'draft'}`}>
                      {item.published ? 'Published' : 'Hidden'}
                    </span>
                    <button type="button" className="admin-icon-btn" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label={`Move ${label(item)} up`}>
                      <ArrowUp size={16} />
                    </button>
                    <button type="button" className="admin-icon-btn" onClick={() => move(i, 1)} disabled={busy || i === items.length - 1} aria-label={`Move ${label(item)} down`}>
                      <ArrowDown size={16} />
                    </button>
                    <button type="button" className="admin-icon-btn" onClick={() => setEditing(item)} aria-label={`Edit ${label(item)}`}>
                      <Pencil size={16} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {editing && items && (
          <Editor
            key={editing === 'new' ? 'new' : editing.id}
            config={config}
            item={editing === 'new' ? null : editing}
            existingIds={items.map((i) => i.id)}
            nextOrder={(items.at(-1)?.order ?? 0) + 10}
            onClose={() => setEditing(null)}
            onChanged={async () => {
              setEditing(null);
              await load();
            }}
          />
        )}
      </div>
    </div>
  );
}

function Editor({
  config,
  item,
  existingIds,
  nextOrder,
  onClose,
  onChanged,
}: {
  config: ContentConfig;
  item: Item | null;
  existingIds: string[];
  nextOrder: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const isNew = item === null;
  const [draft, setDraft] = useState<Draft>(() => toDraft(config, item));
  const [idTouched, setIdTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, value: string | boolean) =>
    setDraft((d) => {
      const next = { ...d, [key]: value };
      // Suggest a URL-friendly ID from the title for new items until the ID is edited by hand.
      if (isNew && !idTouched && key === config.labelKey) next.id = slugify(String(value));
      return next;
    });

  const validate = () => {
    const e: Record<string, string> = {};
    const id = String(draft.id);
    if (isNew && !SLUG.test(id)) e.id = 'Use lowercase letters, numbers and hyphens only.';
    else if (isNew && existingIds.includes(id)) e.id = `Another ${config.singular} already uses this ID.`;
    for (const f of config.fields) {
      if (f.required && !String(draft[f.key]).trim()) e[f.key] = 'Required.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setBusy(true);
    setError('');
    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      await setDoc(doc(db, config.collection, String(draft.id)), {
        ...fromDraft(config, draft),
        published: draft.published === true,
        order: item?.order ?? nextOrder,
        updatedAt: serverTimestamp(),
      });
      onChanged();
    } catch (err) {
      console.error(err);
      setError('Could not save. Please try again.');
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!item || !window.confirm(`Delete “${String(item[config.labelKey] || item.id)}”? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, config.collection, item.id));
      onChanged();
    } catch (err) {
      console.error(err);
      setError('Could not delete. Please try again.');
      setBusy(false);
    }
  };

  return (
    <section className="card admin-detail-pane" aria-label={isNew ? `New ${config.singular}` : `Edit ${config.singular}`}>
      <div className="admin-detail-pane__head">
        <h2>{isNew ? `New ${config.singular}` : `Edit ${config.singular}`}</h2>
        <button type="button" className="admin-link" onClick={onClose}>
          Close
        </button>
      </div>

      <form
        className="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        {config.fields.map((f) => (
          <FieldInput key={f.key} field={f} value={draft[f.key]} error={errors[f.key]} onChange={(v) => set(f.key, v)} uploadPrefix={`content/${config.collection}/${String(draft.id) || 'draft'}`} />
        ))}

        <div className="field">
          <label htmlFor="ed-id">ID</label>
          <input
            id="ed-id"
            className="input"
            value={String(draft.id)}
            disabled={!isNew}
            aria-invalid={errors.id ? true : undefined}
            onChange={(e) => {
              setIdTouched(true);
              set('id', e.target.value);
            }}
          />
          <small className="muted">
            {isNew ? 'Used in links, e.g. /services/#web-development. Cannot be changed later.' : 'The ID cannot be changed.'}
          </small>
          {errors.id && <span className="field__error">{errors.id}</span>}
        </div>

        <label className="checkbox">
          <input type="checkbox" checked={draft.published === true} onChange={(e) => set('published', e.target.checked)} />
          <span>Published (visible on the website)</span>
        </label>

        {error && <p className="field__error">{error}</p>}
        <div className="admin-actions">
          <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
            <span aria-hidden="true">
              <Save size={15} />
            </span>
          </button>
          {!isNew && (
            <button type="button" className="btn btn--outline btn--sm admin-danger" onClick={remove} disabled={busy}>
              Delete
              <span aria-hidden="true">
                <Trash2 size={15} />
              </span>
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function FieldInput({
  field,
  value,
  error,
  onChange,
  uploadPrefix,
}: {
  field: FieldDef;
  value: string | boolean;
  error?: string;
  onChange: (v: string | boolean) => void;
  uploadPrefix: string;
}) {
  const id = `ed-${field.key}`;
  const common = { id, className: 'input', 'aria-invalid': error ? (true as const) : undefined };

  if (field.kind === 'checkbox') {
    return (
      <label className="checkbox">
        <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
  }

  let input;
  if (field.kind === 'select') {
    input = (
      <select {...common} value={String(value)} onChange={(e) => onChange(e.target.value)}>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (field.kind === 'textarea' || field.kind === 'lines') {
    input = <textarea {...common} rows={field.kind === 'lines' ? 4 : 3} value={String(value)} onChange={(e) => onChange(e.target.value)} />;
  } else if (field.kind === 'image') {
    input = <ImageInput id={id} value={String(value)} onChange={onChange} prefix={uploadPrefix} />;
  } else {
    input = <input {...common} type="text" value={String(value)} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <div className="field">
      <label htmlFor={id}>
        {field.label} {field.required && <span className="req" aria-hidden="true">*</span>}
      </label>
      {input}
      {field.help && <small className="muted">{field.help}</small>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'];

/** Uploads an image to Storage (content/…, publicly readable) and stores its download URL. */
function ImageInput({ id, value, onChange, prefix }: { id: string; value: string; onChange: (v: string) => void; prefix: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    if (!IMAGE_TYPES.includes(file.type)) return setError('Use a PNG, JPEG, WebP, AVIF or GIF image.');
    if (file.size >= 5 * 1024 * 1024) return setError('Images must be smaller than 5 MB.');
    setBusy(true);
    try {
      const [storage, { ref, uploadBytes, getDownloadURL }] = await Promise.all([getAdminStorage(), import('firebase/storage')]);
      const safe = file.name.replace(/[^\w.-]+/g, '_').slice(-80);
      const result = await uploadBytes(ref(storage, `${prefix}/${Date.now()}-${safe}`), file, {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      });
      onChange(await getDownloadURL(result.ref));
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-image">
      {value && <img src={value} alt="" />}
      <div className="admin-actions">
        <label className="btn btn--outline btn--sm admin-upload">
          {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          <span aria-hidden="true">{busy ? <LoaderCircle size={15} className="spin" /> : <Upload size={15} />}</span>
          <input id={id} type="file" accept={IMAGE_TYPES.join(',')} disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
        </label>
        {value && (
          <button type="button" className="btn btn--outline btn--sm" onClick={() => onChange('')}>
            Remove
            <span aria-hidden="true">
              <X size={15} />
            </span>
          </button>
        )}
      </div>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
