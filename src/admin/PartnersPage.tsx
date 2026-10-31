import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, CircleAlert, ExternalLink, Eye, EyeOff, LoaderCircle, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { getAdminDb } from './firebase';
import { PartnerCard } from '../components/ui/PartnersSection';
import { byOrder, isWebUrl, PARTNER_LIMITS, partnerFromDoc, partnershipTypes, type Partner } from '../content/partners';

const firestore = () => import('firebase/firestore/lite');
const OTHER = '__other__';

const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];
const LOGO_MAX_UPLOAD = 5 * 1024 * 1024;
/** Logos are shown at most ~260×72 px; this keeps them sharp on high-density screens. */
const LOGO_BOX = { width: 560, height: 220 };
/** Leaves room under PARTNER_LIMITS.logo (and Firestore's 1 MB document limit). */
const LOGO_TARGET = 250_000;

/**
 * Resizes an uploaded logo to fit LOGO_BOX (never enlarging, keeping its proportions and
 * transparency) and returns it as a WebP data: URL, or PNG where the browser can't encode WebP.
 * SVGs are rasterised, so no markup is ever stored.
 */
async function processLogo(file: File): Promise<string> {
  if (!LOGO_TYPES.includes(file.type)) throw new Error('Use a PNG, JPEG, WebP, SVG, GIF or AVIF image.');
  if (file.size > LOGO_MAX_UPLOAD) throw new Error('The logo file must be smaller than 5 MB.');

  const src = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    await img.decode().catch(() => {
      throw new Error('This image could not be read. Try exporting it again as PNG.');
    });
    // SVGs without a size report 0×0; draw them at the full box.
    const w0 = img.naturalWidth || LOGO_BOX.width;
    const h0 = img.naturalHeight || LOGO_BOX.height;

    let scale = Math.min(1, LOGO_BOX.width / w0, LOGO_BOX.height / h0);
    for (let attempt = 0; attempt < 6; attempt++) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(w0 * scale));
      canvas.height = Math.max(1, Math.round(h0 * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Your browser could not process this image.');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let data = canvas.toDataURL('image/webp', 0.9);
      if (!data.startsWith('data:image/webp')) data = canvas.toDataURL('image/png');
      if (data.length <= LOGO_TARGET) return data;
      scale *= 0.75;
    }
    throw new Error('This logo is too detailed to store. Try a simpler or smaller version.');
  } finally {
    URL.revokeObjectURL(src);
  }
}

/** Adds https:// to bare domains like "example.com". */
const normalizeUrl = (v: string) => {
  const t = v.trim();
  return t && !/^[a-z][a-z0-9+.-]*:/i.test(t) ? `https://${t}` : t;
};

interface Draft {
  name: string;
  logo: string;
  typeChoice: string;
  customType: string;
  description: string;
  details: string;
  url: string;
  order: string;
  active: boolean;
}

const toDraft = (p: Partner | null, nextOrder: number): Draft => {
  const known = p ? (partnershipTypes as readonly string[]).includes(p.type) : true;
  return {
    name: p?.name ?? '',
    logo: p?.logo ?? '',
    typeChoice: p ? (known ? p.type : OTHER) : partnershipTypes[0],
    customType: p && !known ? p.type : '',
    description: p?.description ?? '',
    details: p?.details ?? '',
    url: p?.url ?? '',
    order: String(p?.order ?? nextOrder),
    active: p?.active ?? true,
  };
};

const draftType = (d: Draft) => (d.typeChoice === OTHER ? d.customType.trim() : d.typeChoice);

export function PartnersPage() {
  const [items, setItems] = useState<Partner[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Partner | 'new' | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const [db, { collection, getDocs }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDocs(collection(db, 'partners'));
      setItems(snap.docs.map((d) => partnerFromDoc(d.id, d.data())).sort(byOrder));
    } catch (err) {
      console.error(err);
      setError('Could not load partners.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (task: () => Promise<void>, failure: string) => {
    setBusy(true);
    setError('');
    try {
      await task();
      await load();
    } catch (err) {
      console.error(err);
      setError(failure);
    } finally {
      setBusy(false);
    }
  };

  /** Swaps the display order of two neighbouring partners. */
  const move = (index: number, delta: -1 | 1) => {
    const a = items?.[index];
    const b = items?.[index + delta];
    if (!a || !b) return;
    const [orderA, orderB] = a.order === b.order ? [b.order + delta, a.order] : [b.order, a.order];
    run(async () => {
      const [db, { doc, writeBatch, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);
      batch.update(doc(db, 'partners', a.id), { order: orderA, updatedAt: serverTimestamp() });
      batch.update(doc(db, 'partners', b.id), { order: orderB, updatedAt: serverTimestamp() });
      await batch.commit();
    }, 'Could not reorder.');
  };

  const toggleActive = (p: Partner) =>
    run(async () => {
      const [db, { doc, updateDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      await updateDoc(doc(db, 'partners', p.id), { active: !p.active, updatedAt: serverTimestamp() });
    }, `Could not ${p.active ? 'deactivate' : 'activate'} ${p.name}.`);

  const activeCount = items?.filter((p) => p.active).length ?? 0;

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Website content</p>
          <h1>Partners</h1>
          <p className="muted">
            Strategic partners shown on the Home page, above “What we do”. Only active partners are public; the section is
            hidden until at least one is active.
          </p>
        </div>
        <div className="admin-actions">
          <a className="btn btn--outline btn--sm" href="/" target="_blank" rel="noopener noreferrer">
            View on site
            <span aria-hidden="true">
              <ExternalLink size={15} />
            </span>
          </a>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setEditing('new')} disabled={items === null}>
            Add partner
            <span aria-hidden="true">
              <Plus size={15} />
            </span>
          </button>
        </div>
      </header>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      <div className={`admin-split${editing ? ' admin-split--open' : ''}`}>
        <div className="card admin-list">
          {items === null && !error && <p className="admin-empty">Loading…</p>}
          {items?.length === 0 && <p className="admin-empty">No partners yet. Use “Add partner” to add your first one.</p>}
          {items && items.length > 0 && (
            <>
              <p className="admin-list__summary muted">
                {items.length} partner{items.length === 1 ? '' : 's'} · {activeCount} active on the website
              </p>
              <ul>
                {items.map((p, i) => (
                  <li key={p.id} className="admin-row admin-row--static" aria-current={editing !== 'new' && editing?.id === p.id}>
                    <span className="admin-partner-thumb" aria-hidden="true">
                      {p.logo ? <img src={p.logo} alt="" /> : <X size={16} />}
                    </span>
                    <span className="admin-row__main">
                      <strong>{p.name}</strong>
                      <span className="muted">{p.type}</span>
                    </span>
                    <span className="admin-row__tools">
                      <span className={`admin-status admin-status--${p.active ? 'published' : 'draft'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                      <button
                        type="button"
                        className="admin-icon-btn"
                        onClick={() => toggleActive(p)}
                        disabled={busy}
                        aria-label={p.active ? `Deactivate ${p.name}` : `Activate ${p.name}`}
                        title={p.active ? 'Deactivate (hide from website)' : 'Activate (show on website)'}
                      >
                        {p.active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button type="button" className="admin-icon-btn" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label={`Move ${p.name} up`}>
                        <ArrowUp size={16} />
                      </button>
                      <button type="button" className="admin-icon-btn" onClick={() => move(i, 1)} disabled={busy || i === items.length - 1} aria-label={`Move ${p.name} down`}>
                        <ArrowDown size={16} />
                      </button>
                      <button type="button" className="admin-icon-btn" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                        <Pencil size={16} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {editing && items && (
          <PartnerEditor
            key={editing === 'new' ? 'new' : editing.id}
            partner={editing === 'new' ? null : editing}
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

function PartnerEditor({
  partner,
  nextOrder,
  onClose,
  onChanged,
}: {
  partner: Partner | null;
  nextOrder: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const isNew = partner === null;
  const [draft, setDraft] = useState<Draft>(() => toDraft(partner, nextOrder));
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [busy, setBusy] = useState(false);
  const [logoBusy, setLogoBusy] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const uploadLogo = async (file: File | undefined) => {
    if (!file) return;
    setLogoBusy(true);
    setErrors((e) => ({ ...e, logo: undefined }));
    try {
      set('logo', await processLogo(file));
    } catch (err) {
      setErrors((e) => ({ ...e, logo: err instanceof Error ? err.message : 'The logo could not be processed.' }));
    } finally {
      setLogoBusy(false);
    }
  };

  const validate = () => {
    const e: Partial<Record<keyof Draft, string>> = {};
    const url = normalizeUrl(draft.url);
    if (!draft.name.trim()) e.name = 'Enter the partner’s name.';
    else if (draft.name.trim().length > PARTNER_LIMITS.name) e.name = `Use at most ${PARTNER_LIMITS.name} characters.`;
    if (!draft.logo) e.logo = 'Upload the partner’s logo.';
    if (draft.typeChoice === OTHER && !draft.customType.trim()) e.customType = 'Enter the partnership type.';
    else if (draftType(draft).length > PARTNER_LIMITS.type) e.customType = `Use at most ${PARTNER_LIMITS.type} characters.`;
    if (draft.description.length > PARTNER_LIMITS.description) e.description = `Use at most ${PARTNER_LIMITS.description} characters.`;
    if (draft.details.length > PARTNER_LIMITS.details) e.details = `Use at most ${PARTNER_LIMITS.details} characters.`;
    if (url && (!isWebUrl(url) || url.length > PARTNER_LIMITS.url)) e.url = 'Enter a full website address, e.g. https://example.com';
    if (!/^-?\d+$/.test(draft.order.trim())) e.order = 'Enter a whole number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setBusy(true);
    setError('');
    try {
      const [db, { collection, doc, getDoc, setDoc, serverTimestamp, Timestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const ref = isNew ? doc(collection(db, 'partners')) : doc(db, 'partners', partner.id);
      const existing = isNew ? null : await getDoc(ref);
      await setDoc(ref, {
        name: draft.name.trim(),
        logo: draft.logo,
        type: draftType(draft),
        description: draft.description.trim(),
        details: draft.details.trim(),
        url: normalizeUrl(draft.url),
        order: Number(draft.order.trim()),
        active: draft.active,
        // Kept from the original document on edits (the rules require it to be unchanged).
        createdAt: existing?.get('createdAt') instanceof Timestamp ? existing.get('createdAt') : serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      onChanged();
    } catch (err) {
      console.error(err);
      setError('Could not save the partner. Check the fields and try again.');
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!partner || !window.confirm(`Delete “${partner.name}”? It will be removed from the website. This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'partners', partner.id));
      onChanged();
    } catch (err) {
      console.error(err);
      setError('Could not delete the partner. Please try again.');
      setBusy(false);
    }
  };

  const preview: Partner = {
    id: 'preview',
    name: draft.name.trim() || 'Partner name',
    logo: draft.logo,
    type: draftType(draft),
    description: draft.description.trim(),
    details: draft.details.trim(),
    url: isWebUrl(normalizeUrl(draft.url)) ? normalizeUrl(draft.url) : '',
    order: 0,
    active: draft.active,
  };

  const counter = (value: string, max: number) => (
    <small className={`muted admin-counter${value.length > max ? ' admin-counter--over' : ''}`}>
      {value.length}/{max}
    </small>
  );

  return (
    <section className="card admin-detail-pane" aria-label={isNew ? 'New partner' : `Edit ${partner.name}`}>
      <div className="admin-detail-pane__head">
        <h2>{isNew ? 'New partner' : 'Edit partner'}</h2>
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
        <div className="field">
          <label htmlFor="pt-name">
            Partner name <span aria-hidden="true">*</span>
          </label>
          <input id="pt-name" className="input" value={draft.name} maxLength={PARTNER_LIMITS.name} required aria-invalid={errors.name ? true : undefined} onChange={(e) => set('name', e.target.value)} />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </div>

        <div className="field">
          <span className="field__label" id="pt-logo-label">
            Partner logo <span aria-hidden="true">*</span>
          </span>
          <div className="admin-partner-logo">
            <div className="admin-partner-logo__stage">{draft.logo ? <img src={draft.logo} alt="Logo preview" /> : <span className="muted">No logo yet</span>}</div>
            <div className="admin-actions">
              <label className="btn btn--outline btn--sm admin-upload">
                {logoBusy ? 'Processing…' : draft.logo ? 'Replace logo' : 'Upload logo'}
                <span aria-hidden="true">{logoBusy ? <LoaderCircle size={15} className="spin" /> : <Upload size={15} />}</span>
                <input type="file" accept={LOGO_TYPES.join(',')} disabled={logoBusy} aria-labelledby="pt-logo-label" onChange={(e) => uploadLogo(e.target.files?.[0])} />
              </label>
              {draft.logo && (
                <button type="button" className="btn btn--outline btn--sm admin-danger" onClick={() => set('logo', '')}>
                  Remove logo
                  <span aria-hidden="true">
                    <X size={15} />
                  </span>
                </button>
              )}
            </div>
          </div>
          <small className="muted">PNG with a transparent background works best. SVG, JPEG and WebP are also accepted (max 5 MB); it is resized automatically.</small>
          {errors.logo && <span className="field__error">{errors.logo}</span>}
        </div>

        <div className="field">
          <label htmlFor="pt-type">Partnership type</label>
          <select id="pt-type" className="input" value={draft.typeChoice} onChange={(e) => set('typeChoice', e.target.value)}>
            {partnershipTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            <option value={OTHER}>Other (custom type)…</option>
          </select>
          {draft.typeChoice === OTHER && (
            <input
              className="input"
              style={{ marginTop: 'var(--space-2)' }}
              placeholder="e.g. Research Partner"
              aria-label="Custom partnership type"
              value={draft.customType}
              maxLength={PARTNER_LIMITS.type}
              aria-invalid={errors.customType ? true : undefined}
              onChange={(e) => set('customType', e.target.value)}
            />
          )}
          {errors.customType && <span className="field__error">{errors.customType}</span>}
        </div>

        <div className="field">
          <label htmlFor="pt-desc">Short description</label>
          <textarea id="pt-desc" className="input" rows={3} value={draft.description} aria-invalid={errors.description ? true : undefined} onChange={(e) => set('description', e.target.value)} />
          {counter(draft.description, PARTNER_LIMITS.description)}
          {errors.description && <span className="field__error">{errors.description}</span>}
        </div>

        <div className="field">
          <label htmlFor="pt-details">Collaboration details (optional)</label>
          <textarea id="pt-details" className="input" rows={4} value={draft.details} aria-invalid={errors.details ? true : undefined} onChange={(e) => set('details', e.target.value)} />
          <small className="muted">Shown behind a “Collaboration details” toggle on the card. {draft.details.length}/{PARTNER_LIMITS.details}</small>
          {errors.details && <span className="field__error">{errors.details}</span>}
        </div>

        <div className="field">
          <label htmlFor="pt-url">Official website URL</label>
          <input
            id="pt-url"
            className="input"
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            value={draft.url}
            aria-invalid={errors.url ? true : undefined}
            onChange={(e) => set('url', e.target.value)}
            onBlur={() => set('url', normalizeUrl(draft.url))}
          />
          <small className="muted">When set, the logo and name link to this site.</small>
          {errors.url && <span className="field__error">{errors.url}</span>}
        </div>

        <div className="field">
          <label htmlFor="pt-order">Display order</label>
          <input id="pt-order" className="input" inputMode="numeric" value={draft.order} aria-invalid={errors.order ? true : undefined} onChange={(e) => set('order', e.target.value)} style={{ maxWidth: 140 }} />
          <small className="muted">Lower numbers appear first. You can also use the arrows in the list.</small>
          {errors.order && <span className="field__error">{errors.order}</span>}
        </div>

        <label className="checkbox">
          <input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)} />
          <span>Active (shown on the Home page)</span>
        </label>

        <div className="field">
          <span className="field__label">Preview</span>
          <div className="admin-partner-preview">
            <PartnerCard partner={preview} />
          </div>
          {!draft.active && <small className="muted">Inactive: this partner will not appear on the website.</small>}
        </div>

        {error && <p className="field__error">{error}</p>}
        <div className="admin-actions">
          <button type="submit" className="btn btn--primary btn--sm" disabled={busy || logoBusy}>
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
