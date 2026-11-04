import { useState, useEffect, type FormEvent } from 'react';
import {
  Save,
  Search,
  Globe,
  Share2,
  Image as ImageIcon,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultSeoSettings } from '../content/cmsDefaults';
import type { SeoSettings, PageSeoItem } from '../content/cmsTypes';
import { MediaPickerModal } from './MediaPickerModal';

const firestore = () => import('firebase/firestore/lite');

const PAGES: { id: string; label: string; path: string }[] = [
  { id: 'home', label: 'Home Page', path: '/' },
  { id: 'about', label: 'About Us Page', path: '/about/' },
  { id: 'services', label: 'Services Page', path: '/services/' },
  { id: 'careers', label: 'Careers & Jobs', path: '/careers/' },
  { id: 'courses', label: 'Vision Giants Academy', path: '/courses/' },
  { id: 'blog', label: 'Blog & Articles', path: '/blog/' },
  { id: 'team', label: 'Our Team Page', path: '/team/' },
  { id: 'technologies', label: 'Technologies & Stack', path: '/technologies/' },
  { id: 'contact', label: 'Contact Us Page', path: '/contact/' },
];

export function SeoManager() {
  const [data, setData] = useState<SeoSettings>(defaultSeoSettings);
  const [activePageId, setActivePageId] = useState<string>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    loadSeo();
  }, []);

  const loadSeo = async () => {
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'site_content', 'seo_settings'));
      if (snap.exists()) {
        setData({ ...defaultSeoSettings, ...(snap.data() as SeoSettings) });
      }
    } catch (err) {
      console.warn('Could not load SEO settings from Firestore, using defaults:', err);
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
        setDoc(doc(db, 'site_content', 'seo_settings'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'seo'), payload, { merge: true }),
      ]);
      setSuccess('SEO metadata saved successfully! Search engine tags updated.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save SEO metadata to database.');
    } finally {
      setSaving(false);
    }
  };

  const currentPage = PAGES.find((p) => p.id === activePageId) || PAGES[0];
  const currentSeo: PageSeoItem = data[activePageId] || defaultSeoSettings[activePageId] || {
    title: '',
    description: '',
    keywords: '',
    ogImage: '/og-image.png',
  };

  const updateCurrentField = (field: keyof PageSeoItem, val: string) => {
    setData({
      ...data,
      [activePageId]: {
        ...currentSeo,
        [field]: val,
      },
    });
  };

  if (loading) {
    return (
      <div className="admin-page text-center" style={{ padding: '4rem 1rem' }}>
        <LoaderCircle size={32} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
        <p>Loading SEO management...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>SEO & Meta Tags Management</h1>
        </div>
        <div className="admin-page__actions">
          <button type="submit" form="seo-form" className="btn btn--primary" disabled={saving}>
            {saving ? (
              <>
                <LoaderCircle size={16} className="spin" style={{ marginRight: 6 }} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} style={{ marginRight: 6 }} />
                Save All SEO Changes
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

      {/* Page Tabs */}
      <div
        className="card"
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          padding: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`btn btn--sm ${activePageId === p.id ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setActivePageId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form id="seo-form" onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Input Fields */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} className="text-primary" />
            SEO Settings for {currentPage.label}
            <small className="muted" style={{ fontWeight: 400, marginLeft: 8 }}>
              ({currentPage.path})
            </small>
          </h2>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontWeight: 600 }}>SEO Meta Title:</label>
                <span style={{ fontSize: '0.75rem', color: currentSeo.title.length > 60 ? '#f59e0b' : 'var(--color-muted)' }}>
                  {currentSeo.title.length} / 60 recommended chars
                </span>
              </div>
              <input
                type="text"
                value={currentSeo.title}
                onChange={(e) => updateCurrentField('title', e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontWeight: 600 }}>Meta Description:</label>
                <span style={{ fontSize: '0.75rem', color: currentSeo.description.length > 160 ? '#f59e0b' : 'var(--color-muted)' }}>
                  {currentSeo.description.length} / 160 recommended chars
                </span>
              </div>
              <textarea
                rows={4}
                value={currentSeo.description}
                onChange={(e) => updateCurrentField('description', e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Keywords (comma-separated):
              </label>
              <input
                type="text"
                value={currentSeo.keywords || ''}
                onChange={(e) => updateCurrentField('keywords', e.target.value)}
                placeholder="software house, web development, react..."
                className="input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Social Sharing / OG Image URL:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={currentSeo.ogImage || ''}
                  onChange={(e) => updateCurrentField('ogImage', e.target.value)}
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setMediaPickerOpen(true)}
                >
                  <ImageIcon size={14} style={{ marginRight: 4 }} /> Browse Library
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Google & Social Preview */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Google Search Preview */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} className="text-primary" />
              Google Search Result Snippet Preview
            </h3>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '1rem',
                fontFamily: 'arial, sans-serif',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#2563eb', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                  VG
                </div>
                <div>
                  <span style={{ fontSize: 12, color: '#202124', display: 'block', lineHeight: 1 }}>
                    Vision Giants
                  </span>
                  <span style={{ fontSize: 11, color: '#4d5156', display: 'block' }}>
                    https://visiongiants.com{currentPage.path}
                  </span>
                </div>
              </div>

              <h4 style={{ color: '#1a0dab', fontSize: 18, margin: '4px 0', fontWeight: 400, lineHeight: 1.3 }}>
                {currentSeo.title || 'Page Title'}
              </h4>

              <p style={{ color: '#4d5156', fontSize: 13, margin: 0, lineHeight: 1.4 }}>
                {currentSeo.description || 'Page description will appear here in Google search engine result pages.'}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={16} className="text-primary" />
              Social Card Preview (LinkedIn / Twitter / Facebook)
            </h3>

            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#f8fafc',
              }}
            >
              <div style={{ height: 160, background: '#e2e8f0', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                {currentSeo.ogImage ? (
                  <img
                    src={currentSeo.ogImage}
                    alt="OG Share Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ImageIcon size={32} className="text-muted" />
                )}
              </div>
              <div style={{ padding: '0.75rem' }}>
                <span style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                  VISIONGIANTS.COM
                </span>
                <strong style={{ display: 'block', fontSize: 14, margin: '2px 0 4px', color: '#0f172a' }}>
                  {currentSeo.title || 'Page Title'}
                </strong>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.3 }}>
                  {currentSeo.description || 'Page description preview for social share.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => {
            updateCurrentField('ogImage', url);
            setMediaPickerOpen(false);
          }}
          currentValue={currentSeo.ogImage}
        />
      )}
    </div>
  );
}
