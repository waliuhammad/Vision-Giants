import { useEffect, useState } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building2,
  Globe,
  Info,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import {
  defaultHomeCollaborationData,
  homeCollaborationDataFromDoc,
  type HomeCollaborationData,
  type CollaborationPartner,
} from '../content/homeCollaborationData';
import { HomeCollaborationSection } from '../components/ui/HomeCollaborationSection';

const firestore = () => import('firebase/firestore/lite');

export default function HomeCollaborationManager() {
  const [data, setData] = useState<HomeCollaborationData>(defaultHomeCollaborationData);
  const [activePartnerIdx, setActivePartnerIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load collaboration data from Firestore
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
        const ref = doc(db, 'site_content', 'home_collaboration');
        const snap = await getDoc(ref);
        if (active && snap.exists()) {
          setData(homeCollaborationDataFromDoc(snap.data()));
        }
      } catch (err) {
        console.warn('Failed to load home collaboration data from Firestore, using default:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const ref = doc(db, 'site_content', 'home_collaboration');
      await setDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      console.error('Save failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to save collaboration data.');
    } finally {
      setSaving(false);
    }
  };

  const updatePartner = (index: number, patch: Partial<CollaborationPartner>) => {
    const next = [...data.partners];
    next[index] = { ...next[index], ...patch };
    setData({ ...data, partners: next });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-empty">Loading collaboration section data…</p>
      </div>
    );
  }

  const activePartner = data.partners[activePartnerIdx] || data.partners[0];

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Website Content</p>
          <h1>Our Collaboration Partners</h1>
          <p className="muted">
            Manage the &ldquo;Our Collaboration Partners&rdquo; section showcasing your 3 collaborating software houses directly below the Home page Hero.
          </p>
        </div>
        <div className="admin-actions">
          <a href="/#collab-title" target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm">
            <span>View on Site</span>
            <ExternalLink size={15} />
          </a>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleSave}
            disabled={saving}
          >
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
            <Save size={15} />
          </button>
        </div>
      </header>

      {savedSuccess && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-4)' }}>
          <CheckCircle2 size={18} />
          <span>Collaboration partners section updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="admin-form">
        {/* 1. Section Heading & Copy */}
        <section className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-navy)' }}>
            1. Section Heading & Subtitle
          </h2>
          <div className="grid grid--2" style={{ gap: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="collab-eyebrow">Eyebrow Tag</label>
              <input
                id="collab-eyebrow"
                className="input"
                value={data.eyebrow}
                onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                placeholder="STRATEGIC PARTNERSHIPS"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="collab-title-input">Section Title</label>
              <input
                id="collab-title-input"
                className="input"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Our Collaboration Partners"
                required
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="collab-lead-input">Subtitle / Description</label>
            <input
              id="collab-lead-input"
              className="input"
              value={data.lead}
              onChange={(e) => setData({ ...data, lead: e.target.value })}
              placeholder="Building stronger digital experiences through meaningful partnerships and collaboration."
              required
            />
          </div>
        </section>

        {/* 2. Four Collaboration Partners Tabs */}
        <section className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-navy)' }}>
              2. Collaboration Partners (3 Software Houses)
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              3 of 3 partners configured
            </span>
          </div>

          {/* Partner Select Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
            {data.partners.map((p, idx) => (
              <button
                key={p.id || idx}
                type="button"
                onClick={() => setActivePartnerIdx(idx)}
                className={`btn ${activePartnerIdx === idx ? 'btn--primary' : 'btn--outline'} btn--sm`}
                style={{ borderRadius: 'var(--radius-pill)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Building2 size={14} />
                <span>Partner {idx + 1}: {p.name || `Partner ${idx + 1}`}</span>
              </button>
            ))}
          </div>

          {/* Active Partner Editor Form */}
          {activePartner && (
            <div
              style={{
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-5)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
                <span
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {activePartnerIdx + 1}
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>
                  Editing Partner {activePartnerIdx + 1}
                </strong>
              </div>

              <div className="grid grid--2" style={{ gap: 'var(--space-4)' }}>
                <div className="field">
                  <label htmlFor={`partner-name-${activePartnerIdx}`}>Company Name</label>
                  <input
                    id={`partner-name-${activePartnerIdx}`}
                    className="input"
                    value={activePartner.name}
                    onChange={(e) => updatePartner(activePartnerIdx, { name: e.target.value })}
                    placeholder="e.g. Apex Software Systems"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor={`partner-url-${activePartnerIdx}`}>
                    Official Website URL
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      id={`partner-url-${activePartnerIdx}`}
                      className="input"
                      value={activePartner.websiteUrl}
                      onChange={(e) => updatePartner(activePartnerIdx, { websiteUrl: e.target.value })}
                      placeholder="https://company.example.com"
                      required
                    />
                    {activePartner.websiteUrl && (
                      <a
                        href={activePartner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--outline btn--sm"
                        title="Test link in new tab"
                        style={{ flexShrink: 0 }}
                      >
                        <Globe size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid--2" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                <div className="field">
                  <label htmlFor={`partner-logo-${activePartnerIdx}`}>
                    Company Logo URL
                  </label>
                  <input
                    id={`partner-logo-${activePartnerIdx}`}
                    className="input"
                    value={activePartner.logo}
                    onChange={(e) => updatePartner(activePartnerIdx, { logo: e.target.value })}
                    placeholder="https://... or /images/partners/logo.png"
                  />
                  <small className="muted" style={{ display: 'block', marginTop: '4px' }}>
                    Leave empty to show the elegant placeholder tech emblem.
                  </small>
                </div>

                <div className="field">
                  <label htmlFor={`partner-tagline-${activePartnerIdx}`}>
                    Specialization Tag / Tagline (Optional)
                  </label>
                  <input
                    id={`partner-tagline-${activePartnerIdx}`}
                    className="input"
                    value={activePartner.tagline || ''}
                    onChange={(e) => updatePartner(activePartnerIdx, { tagline: e.target.value })}
                    placeholder="e.g. Enterprise Cloud & DevOps"
                  />
                </div>
              </div>

              {/* Logo Preview */}
              {activePartner.logo && (
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Logo Preview:</span>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      maxHeight: '48px',
                    }}
                  >
                    <img
                      src={activePartner.logo}
                      alt={activePartner.name}
                      style={{ maxHeight: '32px', maxWidth: '120px', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="field" style={{ marginTop: 'var(--space-4)' }}>
                <label htmlFor={`partner-desc-${activePartnerIdx}`}>
                  Short Company Description
                </label>
                <textarea
                  id={`partner-desc-${activePartnerIdx}`}
                  className="input"
                  rows={3}
                  value={activePartner.description}
                  onChange={(e) => updatePartner(activePartnerIdx, { description: e.target.value })}
                  placeholder="Explain the company's services, expertise, or core specializations..."
                  required
                />
              </div>
            </div>
          )}
        </section>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={saving}
          >
            <span>{saving ? 'Saving Changes…' : 'Save All Changes'}</span>
            <Save size={16} />
          </button>
        </div>
      </form>

      {/* Live Preview */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
          <Info size={16} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-navy)' }}>
            Live Section Preview
          </h2>
        </div>
        <div
          style={{
            border: '2px dashed var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--color-background)',
          }}
        >
          <HomeCollaborationSection data={data} />
        </div>
      </section>
    </div>
  );
}
