import { useState, useEffect, type FormEvent } from 'react';
import {
  Save,
  Globe,
  Mail,
  Share2,
  Palette,
  Image as ImageIcon,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultGlobalSettings } from '../content/cmsDefaults';
import type { GlobalSettings } from '../content/cmsTypes';
import { MediaPickerModal } from './MediaPickerModal';

const firestore = () => import('firebase/firestore/lite');

export function GlobalSettingsManager() {
  const [data, setData] = useState<GlobalSettings>(defaultGlobalSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Media Picker state
  const [mediaPickerField, setMediaPickerField] = useState<'logoUrl' | 'logoMarkUrl' | 'faviconUrl' | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'site_content', 'global_settings'));
      if (snap.exists()) {
        setData({ ...defaultGlobalSettings, ...(snap.data() as Partial<GlobalSettings>) });
      }
    } catch (err) {
      console.warn('Could not load global settings from Firestore, using defaults:', err);
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
      // Save to both site_content and pages for redundancy and permission fallback
      await Promise.all([
        setDoc(doc(db, 'site_content', 'global_settings'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'global-settings'), payload, { merge: true }),
      ]);
      setSuccess('Global website settings saved successfully! Changes are live across the site.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save settings to database. Please check connection and permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (index: number, val: string) => {
    const list = [...data.phones];
    list[index] = val;
    setData({ ...data, phones: list });
  };

  const addPhone = () => {
    setData({ ...data, phones: [...data.phones, ''] });
  };

  const removePhone = (index: number) => {
    setData({ ...data, phones: data.phones.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="admin-page text-center" style={{ padding: '4rem 1rem' }}>
        <LoaderCircle size={32} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
        <p>Loading global website settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Global Website Settings</h1>
        </div>
        <div className="admin-page__actions">
          <button type="submit" form="global-settings-form" className="btn btn--primary" disabled={saving}>
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

      <form id="global-settings-form" onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
        {/* Company Identity */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} className="text-primary" />
            Company Identity & Branding
          </h2>

          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Brand Display Name:
              </label>
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => setData({ ...data, companyName: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Registered Legal Name:
              </label>
              <input
                type="text"
                value={data.legalName}
                onChange={(e) => setData({ ...data, legalName: e.target.value })}
                className="input"
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Company Tagline / Slogan:
              </label>
              <input
                type="text"
                value={data.tagline}
                onChange={(e) => setData({ ...data, tagline: e.target.value })}
                className="input"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                About Summary Description (used in footer & structured data):
              </label>
              <textarea
                rows={3}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={20} className="text-primary" />
            Direct Contact Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Primary Contact Email:
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="input"
                placeholder="info@vgiants.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Support / Help Email:
              </label>
              <input
                type="email"
                value={data.supportEmail || ''}
                onChange={(e) => setData({ ...data, supportEmail: e.target.value })}
                className="input"
                placeholder="support@vgiants.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                WhatsApp Direct Number (with Country Code):
              </label>
              <input
                type="text"
                value={data.whatsappNumber || ''}
                onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
                className="input"
                placeholder="+923080058600"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Official Office / Campus Address:
              </label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className="input"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Phone Numbers:</label>
                <button type="button" className="btn btn--outline btn--sm" onClick={addPhone}>
                  <Plus size={14} style={{ marginRight: 4 }} /> Add Phone
                </button>
              </div>

              {data.phones.map((phone, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(idx, e.target.value)}
                    className="input"
                    placeholder="+92 308 0058600"
                    style={{ flex: 1 }}
                  />
                  {data.phones.length > 1 && (
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      onClick={() => removePhone(idx)}
                      style={{ color: '#dc2626' }}
                      title="Remove phone"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Profiles */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} className="text-primary" />
            Social Media & Web Links
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>LinkedIn Profile / Page:</label>
              <input
                type="url"
                value={data.social.linkedin || ''}
                onChange={(e) => setData({ ...data, social: { ...data.social, linkedin: e.target.value } })}
                className="input"
                placeholder="https://linkedin.com/company/vision-giants"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Facebook Page:</label>
              <input
                type="url"
                value={data.social.facebook || ''}
                onChange={(e) => setData({ ...data, social: { ...data.social, facebook: e.target.value } })}
                className="input"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Instagram Profile:</label>
              <input
                type="url"
                value={data.social.instagram || ''}
                onChange={(e) => setData({ ...data, social: { ...data.social, instagram: e.target.value } })}
                className="input"
                placeholder="https://instagram.com/visiongiants"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>TikTok Handle / URL:</label>
              <input
                type="url"
                value={data.social.tiktok || ''}
                onChange={(e) => setData({ ...data, social: { ...data.social, tiktok: e.target.value } })}
                className="input"
                placeholder="https://tiktok.com/@vision.giants"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Twitter / X Profile:</label>
              <input
                type="url"
                value={data.social.twitter || ''}
                onChange={(e) => setData({ ...data, social: { ...data.social, twitter: e.target.value } })}
                className="input"
                placeholder="https://x.com/visiongiants"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>GitHub Organization:</label>
              <input
                type="url"
                value={data.social.github || ''}
                onChange={(e) => setData({ ...data, social: { ...data.social, github: e.target.value } })}
                className="input"
                placeholder="https://github.com/visiongiants"
              />
            </div>
          </div>
        </div>

        {/* Visual Brand Assets & Colors */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} className="text-primary" />
            Brand Assets & Color Tokens
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Logo Mark */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Logo Mark Image:</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={data.branding.logoMarkUrl || ''}
                  onChange={(e) => setData({ ...data, branding: { ...data.branding, logoMarkUrl: e.target.value } })}
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setMediaPickerField('logoMarkUrl')}
                >
                  <ImageIcon size={14} style={{ marginRight: 4 }} /> Browse
                </button>
              </div>
              {data.branding.logoMarkUrl && (
                <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: 8, borderRadius: 6, display: 'inline-block' }}>
                  <img src={data.branding.logoMarkUrl} alt="Logo Mark Preview" style={{ height: 40 }} />
                </div>
              )}
            </div>

            {/* Favicon */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Favicon Image URL:</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={data.branding.faviconUrl || ''}
                  onChange={(e) => setData({ ...data, branding: { ...data.branding, faviconUrl: e.target.value } })}
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => setMediaPickerField('faviconUrl')}
                >
                  <ImageIcon size={14} style={{ marginRight: 4 }} /> Browse
                </button>
              </div>
              {data.branding.faviconUrl && (
                <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: 8, borderRadius: 6, display: 'inline-block' }}>
                  <img src={data.branding.faviconUrl} alt="Favicon Preview" style={{ height: 32 }} />
                </div>
              )}
            </div>

            {/* Primary Color */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Theme Primary Color:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={data.branding.primaryColor || '#2563eb'}
                  onChange={(e) => setData({ ...data, branding: { ...data.branding, primaryColor: e.target.value } })}
                  style={{ width: 44, height: 38, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={data.branding.primaryColor || '#2563eb'}
                  onChange={(e) => setData({ ...data, branding: { ...data.branding, primaryColor: e.target.value } })}
                  className="input"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Theme Accent Glow Color:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={data.branding.accentColor || '#38bdf8'}
                  onChange={(e) => setData({ ...data, branding: { ...data.branding, accentColor: e.target.value } })}
                  style={{ width: 44, height: 38, border: 'none', borderRadius: 4, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={data.branding.accentColor || '#38bdf8'}
                  onChange={(e) => setData({ ...data, branding: { ...data.branding, accentColor: e.target.value } })}
                  className="input"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Media Picker Modal */}
      {mediaPickerField && (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setMediaPickerField(null)}
          onSelect={(url) => {
            setData({
              ...data,
              branding: {
                ...data.branding,
                [mediaPickerField]: url,
              },
            });
            setMediaPickerField(null);
          }}
          currentValue={data.branding[mediaPickerField]}
        />
      )}
    </div>
  );
}
