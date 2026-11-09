import { useState, useEffect, type FormEvent } from 'react';
import {
  Save,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Plus,
  Trash2,
  Sliders,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { logAdminActivity } from './activityLogger';

const firestore = () => import('firebase/firestore/lite');

export interface FooterSettings {
  tagline: string;
  copyright: string;
  officeAddress: string;
  contactEmail: string;
  contactPhone: string;
  businessHours: string;
  newsletterEnabled: boolean;
  newsletterHeading: string;
  newsletterLead: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  quickLinks: {
    title: string;
    url: string;
  }[];
}

const defaultFooterSettings: FooterSettings = {
  tagline: 'Building digital experiences that move businesses forward. Custom websites, mobile apps, and scalable cloud solutions.',
  copyright: `© ${new Date().getFullYear()} Vision Giants Software (Pvt) Ltd. All rights reserved.`,
  officeAddress: 'Commercial Zone, DHA Phase 5, Lahore, Pakistan',
  contactEmail: 'info@vgiants.com',
  contactPhone: '+92 300 1234567',
  businessHours: 'Monday – Friday: 9:00 AM – 6:00 PM PKT',
  newsletterEnabled: true,
  newsletterHeading: 'Stay ahead of digital trends',
  newsletterLead: 'Join our monthly newsletter for engineering insights, tech reviews, and company updates.',
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/visiongiants' },
    { platform: 'GitHub', url: 'https://github.com/visiongiants' },
    { platform: 'Twitter / X', url: 'https://twitter.com/visiongiants' },
  ],
  quickLinks: [
    { title: 'About Us', url: '/about/' },
    { title: 'Services', url: '/services/' },
    { title: 'Portfolio', url: '/portfolio/' },
    { title: 'Careers', url: '/careers/' },
    { title: 'Academy', url: '/courses/' },
    { title: 'Blog', url: '/blog/' },
    { title: 'Contact Us', url: '/contact/' },
    { title: 'Privacy Policy', url: '/privacy/' },
    { title: 'Terms of Service', url: '/terms/' },
  ],
};

export function FooterManager() {
  const [data, setData] = useState<FooterSettings>(defaultFooterSettings);
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
      const snap = await getDoc(doc(db, 'site_content', 'footer'));
      if (snap.exists()) {
        setData({ ...defaultFooterSettings, ...(snap.data() as Partial<FooterSettings>) });
      }
    } catch (err) {
      console.warn('Could not load footer settings from Firestore, using defaults:', err);
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
      await setDoc(doc(db, 'site_content', 'footer'), payload, { merge: true });
      await logAdminActivity('Updated Website Footer', 'settings', 'Saved new footer tagline, social links, and contact information.');
      setSuccess('Footer layout & content saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save footer settings.');
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'New Platform', url: 'https://' }],
    }));
  };

  const removeSocialLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', val: string) => {
    setData((prev) => {
      const updated = [...prev.socialLinks];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, socialLinks: updated };
    });
  };

  const addQuickLink = () => {
    setData((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { title: 'New Link', url: '/' }],
    }));
  };

  const removeQuickLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index),
    }));
  };

  const updateQuickLink = (index: number, field: 'title' | 'url', val: string) => {
    setData((prev) => {
      const updated = [...prev.quickLinks];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, quickLinks: updated };
    });
  };

  if (loading) {
    return <div className="admin-boot">Loading Footer Settings…</div>;
  }

  return (
    <div className="admin-page" style={{ maxWidth: 1100, margin: '0 auto', gap: '2rem' }}>
      <form onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
        {/* Page Head */}
        <div className="admin-page__head">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: '0.5rem' }}>
              <Sliders size={13} style={{ color: '#2563eb' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase' }}>
                Footer Customizer
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
              Website Footer Management
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              Customize footer company tagline, contact details, social links, navigation menus, and copyright text.
            </p>
          </div>

          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? (
              <>
                <LoaderCircle size={16} className="spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="alert alert--error">
            <CircleAlert size={18} /> <span>{error}</span>
          </p>
        )}

        {success && (
          <p className="alert alert--success">
            <CircleCheck size={18} /> <span>{success}</span>
          </p>
        )}

        {/* Brand & Contact Section */}
        <div className="card" style={{ padding: '1.75rem', display: 'grid', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
            Company Brand & Contact Information
          </h2>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
              Footer Company Tagline & Description
            </label>
            <textarea
              rows={3}
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Contact Email
              </label>
              <input
                type="email"
                value={data.contactEmail}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Contact Phone
              </label>
              <input
                type="text"
                value={data.contactPhone}
                onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Physical Office Address
              </label>
              <input
                type="text"
                value={data.officeAddress}
                onChange={(e) => setData({ ...data, officeAddress: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
                Business Hours
              </label>
              <input
                type="text"
                value={data.businessHours}
                onChange={(e) => setData({ ...data, businessHours: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: 4 }}>
              Copyright Notice
            </label>
            <input
              type="text"
              value={data.copyright}
              onChange={(e) => setData({ ...data, copyright: e.target.value })}
              className="input"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="card" style={{ padding: '1.75rem', display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
              Social Media Accounts
            </h2>
            <button type="button" onClick={addSocialLink} className="btn btn--outline btn--sm">
              <Plus size={14} /> Add Social Link
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {data.socialLinks.map((link, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Platform Name (e.g. LinkedIn)"
                  value={link.platform}
                  onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                  className="input"
                  style={{ width: 180 }}
                />
                <input
                  type="url"
                  placeholder="Profile URL (e.g. https://...)"
                  value={link.url}
                  onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="btn btn--plain btn--sm"
                  style={{ color: '#ef4444' }}
                  title="Remove link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="card" style={{ padding: '1.75rem', display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
              Footer Quick Links & Sitemap
            </h2>
            <button type="button" onClick={addQuickLink} className="btn btn--outline btn--sm">
              <Plus size={14} /> Add Quick Link
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {data.quickLinks.map((link, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Link Title (e.g. Privacy Policy)"
                  value={link.title}
                  onChange={(e) => updateQuickLink(idx, 'title', e.target.value)}
                  className="input"
                  style={{ width: 220 }}
                />
                <input
                  type="text"
                  placeholder="URL or Path (e.g. /privacy/)"
                  value={link.url}
                  onChange={(e) => updateQuickLink(idx, 'url', e.target.value)}
                  className="input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeQuickLink(idx)}
                  className="btn btn--plain btn--sm"
                  style={{ color: '#ef4444' }}
                  title="Remove link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save button bottom */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? (
              <>
                <LoaderCircle size={16} className="spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
