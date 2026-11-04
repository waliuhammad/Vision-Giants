import { useState, useEffect, type FormEvent } from 'react';
import {
  Save,
  Layout,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Plus,
  Trash2,
  Sliders,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultHeaderFooterSettings } from '../content/cmsDefaults';
import type { HeaderFooterSettings } from '../content/cmsTypes';

const firestore = () => import('firebase/firestore/lite');

export function HeaderFooterManager() {
  const [data, setData] = useState<HeaderFooterSettings>(defaultHeaderFooterSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'site_content', 'header_footer'));
      if (snap.exists()) {
        setData({ ...defaultHeaderFooterSettings, ...(snap.data() as Partial<HeaderFooterSettings>) });
      }
    } catch (err) {
      console.warn('Could not load header/footer settings from Firestore, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      await Promise.all([
        setDoc(doc(db, 'site_content', 'header_footer'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'header-footer'), payload, { merge: true }),
      ]);
      setSuccess('Header and Footer layout settings saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save header/footer settings to database.');
    } finally {
      setSaving(false);
    }
  };

  const addLegalLink = () => {
    setData({
      ...data,
      footer: {
        ...data.footer,
        legalLinks: [...data.footer.legalLinks, { label: 'New Policy', to: '/privacy/' }],
      },
    });
  };

  const updateLegalLink = (idx: number, field: 'label' | 'to', value: string) => {
    const list = [...data.footer.legalLinks];
    list[idx] = { ...list[idx], [field]: value };
    setData({
      ...data,
      footer: {
        ...data.footer,
        legalLinks: list,
      },
    });
  };

  const removeLegalLink = (idx: number) => {
    setData({
      ...data,
      footer: {
        ...data.footer,
        legalLinks: data.footer.legalLinks.filter((_, i) => i !== idx),
      },
    });
  };

  if (loading) {
    return (
      <div className="admin-page text-center" style={{ padding: '4rem 1rem' }}>
        <LoaderCircle size={32} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
        <p>Loading header & footer settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Header & Footer Layout Settings</h1>
        </div>
        <div className="admin-page__actions">
          <button type="submit" form="header-footer-form" className="btn btn--primary" disabled={saving}>
            {saving ? (
              <>
                <LoaderCircle size={16} className="spin" style={{ marginRight: 6 }} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} style={{ marginRight: 6 }} />
                Save & Publish
              </>
            )}
          </button>
        </div>
      </header>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {success && (
        <p className="alert alert--success">
          <CircleCheck size={18} aria-hidden="true" />
          <span>{success}</span>
        </p>
      )}

      <form id="header-footer-form" onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
        {/* Header Options */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layout size={20} className="text-primary" />
            Website Header Options
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={data.header.sticky}
                  onChange={(e) => setData({ ...data, header: { ...data.header, sticky: e.target.checked } })}
                />
                Sticky Header on Scroll (frosted glass blur effect)
              </label>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={data.header.showCta}
                  onChange={(e) => setData({ ...data, header: { ...data.header, showCta: e.target.checked } })}
                />
                Show Action Button in Header
              </label>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Header CTA Text:</label>
              <input
                type="text"
                value={data.header.ctaText}
                onChange={(e) => setData({ ...data, header: { ...data.header, ctaText: e.target.value } })}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Header CTA Link:</label>
              <input
                type="text"
                value={data.header.ctaLink}
                onChange={(e) => setData({ ...data, header: { ...data.header, ctaLink: e.target.value } })}
                className="input"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={data.header.noticeBarEnabled || false}
                  onChange={(e) => setData({ ...data, header: { ...data.header, noticeBarEnabled: e.target.checked } })}
                />
                Enable Top Announcement / Notice Bar
              </label>
              <input
                type="text"
                value={data.header.noticeBarText || ''}
                onChange={(e) => setData({ ...data, header: { ...data.header, noticeBarText: e.target.value } })}
                placeholder="e.g. 🚀 Vision Giants Academy Enrollment is Now Open!"
                className="input"
                disabled={!data.header.noticeBarEnabled}
              />
            </div>
          </div>
        </div>

        {/* Footer Options */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} className="text-primary" />
            Website Footer Options
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Footer Brand Summary Paragraph:
              </label>
              <textarea
                rows={3}
                value={data.footer.description}
                onChange={(e) => setData({ ...data, footer: { ...data.footer, description: e.target.value } })}
                className="input"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Copyright Text:
              </label>
              <input
                type="text"
                value={data.footer.copyright}
                onChange={(e) => setData({ ...data, footer: { ...data.footer, copyright: e.target.value } })}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={data.footer.showSocials}
                  onChange={(e) => setData({ ...data, footer: { ...data.footer, showSocials: e.target.checked } })}
                />
                Display Social Media Icons in Footer
              </label>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={data.footer.showContactInfo}
                  onChange={(e) => setData({ ...data, footer: { ...data.footer, showContactInfo: e.target.checked } })}
                />
                Display Office Address & Phones Column
              </label>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={data.footer.showNewsletter}
                  onChange={(e) => setData({ ...data, footer: { ...data.footer, showNewsletter: e.target.checked } })}
                />
                Display Newsletter Subscription Block
              </label>
            </div>

            {/* Legal Links */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontWeight: 600 }}>Footer Legal & Policy Links:</label>
                <button type="button" className="btn btn--outline btn--sm" onClick={addLegalLink}>
                  <Plus size={14} style={{ marginRight: 4 }} /> Add Legal Link
                </button>
              </div>

              {data.footer.legalLinks.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateLegalLink(idx, 'label', e.target.value)}
                    placeholder="Link Label (e.g. Privacy Policy)"
                    className="input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    value={item.to}
                    onChange={(e) => updateLegalLink(idx, 'to', e.target.value)}
                    placeholder="URL (/privacy/)"
                    className="input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    onClick={() => removeLegalLink(idx)}
                    style={{ color: '#dc2626' }}
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
