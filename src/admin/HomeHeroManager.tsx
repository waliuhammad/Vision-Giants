import { useEffect, useState, type FormEvent } from 'react';
import {
  CircleAlert,
  CircleCheck,
  ExternalLink,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import {
  defaultHomePageHeroData,
  homePageHeroDataFromDoc,
  type HomePageHeroData,
} from '../content/homeHeroData';

const firestore = () => import('firebase/firestore/lite');

export function HomeHeroManager() {
  const [data, setData] = useState<HomePageHeroData>(defaultHomePageHeroData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'pages', 'home-hero'));
      if (snap.exists()) {
        setData(homePageHeroDataFromDoc(snap.data()));
      }
    } catch (err) {
      console.error(err);
      setError('Could not load hero content from database.');
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
      const [db, { doc, setDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await setDoc(doc(db, 'pages', 'home-hero'), data, { merge: true });
      setSuccess('Home page hero section updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save to database. Check permissions.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (patch: Partial<HomePageHeroData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const updateMenuItem = (index: number, label: string) => {
    const next = [...data.menuItems];
    next[index] = { ...next[index], label };
    updateField({ menuItems: next });
  };

  const updateCapability = (index: number, title: string, subtitle: string) => {
    const next = [...data.capabilities];
    next[index] = { ...next[index], title, subtitle };
    updateField({ capabilities: next });
  };

  const updateBrand = (index: number, name: string) => {
    const next = [...data.trustBrands];
    next[index] = name;
    updateField({ trustBrands: next });
  };

  const addBrand = () => {
    updateField({ trustBrands: [...data.trustBrands, 'NEW BRAND'] });
  };

  const removeBrand = (index: number) => {
    updateField({ trustBrands: data.trustBrands.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoaderCircle size={24} className="spin" />
          <span>Loading Home Hero content…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Homepage Customization</p>
          <h1>Home Hero Section</h1>
          <p className="admin-page__sub">
            Customize the modern IT software dark hero layout (pill badge, bold title, holographic services menu, developer counter, bottom capabilities & client logos).
          </p>
        </div>
        <div className="admin-actions">
          <a className="btn btn--outline btn--sm" href="/" target="_blank" rel="noopener noreferrer">
            View Live Site <ExternalLink size={14} />
          </a>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <LoaderCircle size={15} className="spin" /> : <Save size={15} />}
            <span>Save Hero Section</span>
          </button>
        </div>
      </header>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} />
          <span>{error}</span>
        </p>
      )}

      {success && (
        <p className="alert alert--success">
          <CircleCheck size={18} />
          <span>{success}</span>
        </p>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gap: 'var(--space-6)' }}>
        {/* 1. Main Headline & Badge */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>1. Main Headline & Copy</h2>
          <div className="grid grid--2">
            <div className="field">
              <label>Top Pill Badge Text</label>
              <input
                type="text"
                className="input"
                value={data.badgeText}
                onChange={(e) => updateField({ badgeText: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Dark Hero Background Photo URL</label>
              <input
                type="text"
                className="input"
                value={data.backgroundImage}
                onChange={(e) => updateField({ backgroundImage: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Headline Line 1 (White)</label>
              <input
                type="text"
                className="input"
                value={data.titleLine1}
                onChange={(e) => updateField({ titleLine1: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Headline Line 2 (Accent Blue)</label>
              <input
                type="text"
                className="input"
                value={data.titleLine2}
                onChange={(e) => updateField({ titleLine2: e.target.value })}
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: '12px' }}>
            <label>Lead Paragraph</label>
            <textarea
              className="input"
              rows={3}
              value={data.lead}
              onChange={(e) => updateField({ lead: e.target.value })}
            />
          </div>
        </div>

        {/* 2. Call to Action Buttons */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>2. Action Buttons</h2>
          <div className="grid grid--2">
            <div className="field">
              <label>Primary Button Text (Solid Blue)</label>
              <input
                type="text"
                className="input"
                value={data.primaryCtaText}
                onChange={(e) => updateField({ primaryCtaText: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Primary Button Link</label>
              <input
                type="text"
                className="input"
                value={data.primaryCtaLink}
                onChange={(e) => updateField({ primaryCtaLink: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Secondary Button Text (Glass Border)</label>
              <input
                type="text"
                className="input"
                value={data.secondaryCtaText}
                onChange={(e) => updateField({ secondaryCtaText: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Secondary Button Link</label>
              <input
                type="text"
                className="input"
                value={data.secondaryCtaLink}
                onChange={(e) => updateField({ secondaryCtaLink: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 3. Right Holographic Menu & Expert Badge */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>3. Floating Right Visuals (Menu & Expert Counter)</h2>
          <div className="grid grid--2" style={{ marginBottom: '16px' }}>
            <div className="field">
              <label>Developer Count (e.g. 50+)</label>
              <input
                type="text"
                className="input"
                value={data.expertBadgeCount}
                onChange={(e) => updateField({ expertBadgeCount: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Developer Label (e.g. Expert Developers)</label>
              <input
                type="text"
                className="input"
                value={data.expertBadgeLabel}
                onChange={(e) => updateField({ expertBadgeLabel: e.target.value })}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>Holographic Glass Menu Items (4 Services)</h4>
          <div className="grid grid--2">
            {data.menuItems.map((item, idx) => (
              <div key={idx} className="field">
                <label style={{ fontSize: '0.82rem' }}>Service #{idx + 1} ({item.icon})</label>
                <input
                  type="text"
                  className="input"
                  value={item.label}
                  onChange={(e) => updateMenuItem(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Bottom 3 Capabilities */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>4. Bottom 3 Quick Capability Badges</h2>
          <div className="grid grid--3">
            {data.capabilities.map((cap, idx) => (
              <div key={cap.id} style={{ background: 'var(--color-surface-2)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: 8 }}>
                  CAPABILITY #{idx + 1} ({cap.icon})
                </span>
                <div className="field" style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: '0.8rem' }}>Line 1 (Bold)</label>
                  <input
                    type="text"
                    className="input"
                    value={cap.title}
                    onChange={(e) => updateCapability(idx, e.target.value, cap.subtitle || '')}
                  />
                </div>
                <div className="field">
                  <label style={{ fontSize: '0.8rem' }}>Line 2 (Normal)</label>
                  <input
                    type="text"
                    className="input"
                    value={cap.subtitle || ''}
                    onChange={(e) => updateCapability(idx, cap.title, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Trusted By Strip */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>5. Trusted by Businesses Strip</h2>
            <button type="button" className="btn btn--outline btn--sm" onClick={addBrand}>
              <Plus size={14} /> Add Brand
            </button>
          </div>
          <div className="field" style={{ marginBottom: '16px' }}>
            <label>Strip Header Title</label>
            <input
              type="text"
              className="input"
              value={data.trustHeading}
              onChange={(e) => updateField({ trustHeading: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {data.trustBrands.map((b, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input"
                  value={b}
                  onChange={(e) => updateBrand(idx, e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon admin-danger"
                  onClick={() => removeBrand(idx)}
                  title="Remove Brand"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
