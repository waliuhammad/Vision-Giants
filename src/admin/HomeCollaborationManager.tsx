import { useEffect, useState } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Rocket,
  Users,
  Target,
  Zap,
  Shield,
  Award,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import {
  defaultHomeCollaborationData,
  homeCollaborationDataFromDoc,
  type HomeCollaborationData,
  type CollaborationPillar,
} from '../content/homeCollaborationData';
import { HomeCollaborationSection } from '../components/ui/HomeCollaborationSection';

const firestore = () => import('firebase/firestore/lite');

const availableIcons = [
  { value: 'rocket', label: 'Rocket (Innovation)', icon: Rocket },
  { value: 'users', label: 'Users (Shared Expertise)', icon: Users },
  { value: 'target', label: 'Target (Client Success)', icon: Target },
  { value: 'zap', label: 'Zap (Fast / Agile)', icon: Zap },
  { value: 'shield', label: 'Shield (Security / Trust)', icon: Shield },
  { value: 'award', label: 'Award (Quality / Excellence)', icon: Award },
] as const;

export default function HomeCollaborationManager() {
  const [data, setData] = useState<HomeCollaborationData>(defaultHomeCollaborationData);
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

  const updatePillar = (index: number, patch: Partial<CollaborationPillar>) => {
    const next = [...data.pillars];
    next[index] = { ...next[index], ...patch };
    setData({ ...data, pillars: next });
  };

  const addPillar = () => {
    if (data.pillars.length >= 4) return;
    const newPillar: CollaborationPillar = {
      id: `p-${Date.now()}`,
      icon: 'rocket',
      title: 'New Pillar',
      subtitle: 'Value',
    };
    setData({ ...data, pillars: [...data.pillars, newPillar] });
  };

  const removePillar = (index: number) => {
    if (data.pillars.length <= 1) return;
    const next = data.pillars.filter((_, i) => i !== index);
    setData({ ...data, pillars: next });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-empty">Loading collaboration section data…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Website Content</p>
          <h1>Home Collaboration Section</h1>
          <p className="muted">
            Manage the &ldquo;Our Collaboration / Stronger Together, Greater Impact&rdquo; section displayed right below the Home page Hero.
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
          <span>Collaboration section updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 'var(--space-4)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="admin-form">
        {/* Section Heading & Copy */}
        <section className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-navy)' }}>
            1. Section Header & Copy
          </h2>
          <div className="grid grid--2" style={{ gap: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="collab-eyebrow">Eyebrow Tag</label>
              <input
                id="collab-eyebrow"
                className="input"
                value={data.eyebrow}
                onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                placeholder="OUR COLLABORATION"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="collab-badge">Partner Pill Badge</label>
              <input
                id="collab-badge"
                className="input"
                value={data.badge}
                onChange={(e) => setData({ ...data, badge: e.target.value })}
                placeholder="STRATEGIC PARTNER"
                required
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="collab-title-input">Section Title</label>
            <input
              id="collab-title-input"
              className="input"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Stronger Together, Greater Impact"
              required
            />
          </div>

          <div className="field" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="collab-lead-input">Introductory Subtitle / Lead</label>
            <textarea
              id="collab-lead-input"
              className="input"
              rows={2}
              value={data.lead}
              onChange={(e) => setData({ ...data, lead: e.target.value })}
              placeholder="We collaborate with innovative organizations..."
              required
            />
          </div>
        </section>

        {/* Partner Details */}
        <section className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-navy)' }}>
            2. Strategic Partner Details
          </h2>

          <div className="grid grid--2" style={{ gap: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="partner-name">Partner Name</label>
              <input
                id="partner-name"
                className="input"
                value={data.partnerName}
                onChange={(e) => setData({ ...data, partnerName: e.target.value })}
                placeholder="TechNova Solutions"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="partner-subtitle">Partner Sub-Label</label>
              <input
                id="partner-subtitle"
                className="input"
                value={data.partnerSubtitle || ''}
                onChange={(e) => setData({ ...data, partnerSubtitle: e.target.value })}
                placeholder="SOLUTIONS"
              />
            </div>
          </div>

          <div className="field" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="partner-logo">Custom Partner Logo Image URL (Optional)</label>
            <input
              id="partner-logo"
              className="input"
              value={data.partnerLogo || ''}
              onChange={(e) => setData({ ...data, partnerLogo: e.target.value })}
              placeholder="Leave blank to use the high-res 3D isometric TechNova logo"
            />
            <small className="muted">If empty, a pristine 3D geometric hexagon matching the reference is displayed.</small>
          </div>

          <div className="field" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="partner-desc">Collaboration Description</label>
            <textarea
              id="partner-desc"
              className="input"
              rows={3}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="This collaboration enables us to deliver advanced technology solutions..."
              required
            />
          </div>

          <div className="grid grid--2" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <div className="field">
              <label htmlFor="btn-text">Button Text</label>
              <input
                id="btn-text"
                className="input"
                value={data.buttonText}
                onChange={(e) => setData({ ...data, buttonText: e.target.value })}
                placeholder="Visit Partner Website"
              />
            </div>
            <div className="field">
              <label htmlFor="btn-url">Partner Website URL</label>
              <input
                id="btn-url"
                className="input"
                value={data.buttonUrl}
                onChange={(e) => setData({ ...data, buttonUrl: e.target.value })}
                placeholder="https://technova.example.com"
              />
            </div>
          </div>
        </section>

        {/* Collaboration Pillars */}
        <section className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-navy)' }}>
              3. Partnership Pillars (Up to 3-4 items)
            </h2>
            {data.pillars.length < 4 && (
              <button type="button" className="btn btn--outline btn--sm" onClick={addPillar}>
                <Plus size={14} />
                <span>Add Pillar</span>
              </button>
            )}
          </div>

          <div className="grid grid--3" style={{ gap: 'var(--space-4)' }}>
            {data.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  background: 'var(--color-surface-2)',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb' }}>Pillar #{idx + 1}</span>
                  {data.pillars.length > 1 && (
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={() => removePillar(idx)}
                      title="Remove pillar"
                    >
                      <Trash2 size={15} style={{ color: 'var(--color-danger)' }} />
                    </button>
                  )}
                </div>

                <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
                  <label htmlFor={`pillar-icon-${idx}`}>Icon</label>
                  <select
                    id={`pillar-icon-${idx}`}
                    className="input"
                    value={pillar.icon}
                    onChange={(e) => updatePillar(idx, { icon: e.target.value as CollaborationPillar['icon'] })}
                  >
                    {availableIcons.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field" style={{ marginBottom: 'var(--space-3)' }}>
                  <label htmlFor={`pillar-title-${idx}`}>Primary Word</label>
                  <input
                    id={`pillar-title-${idx}`}
                    className="input"
                    value={pillar.title}
                    onChange={(e) => updatePillar(idx, { title: e.target.value })}
                    placeholder="e.g. Innovation"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor={`pillar-sub-${idx}`}>Secondary Word</label>
                  <input
                    id={`pillar-sub-${idx}`}
                    className="input"
                    value={pillar.subtitle}
                    onChange={(e) => updatePillar(idx, { subtitle: e.target.value })}
                    placeholder="e.g. Driven"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Quote */}
        <section className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-navy)' }}>
            4. Bottom Quote & Tagline
          </h2>
          <div className="field">
            <label htmlFor="collab-quote">Bottom Quote</label>
            <input
              id="collab-quote"
              className="input"
              value={data.footerQuote}
              onChange={(e) => setData({ ...data, footerQuote: e.target.value })}
              placeholder="One goal. One vision. A better tomorrow."
            />
          </div>
        </section>

        {/* Live Section Preview */}
        <section className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--color-navy)' }}>
            Live Preview
          </h2>
          <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>
            This is how the collaboration section looks on the public Home page:
          </p>
          <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', background: '#ffffff' }}>
            <HomeCollaborationSection data={data} />
          </div>
        </section>

        <div className="admin-actions" style={{ justifyContent: 'flex-end', marginBottom: 'var(--space-7)' }}>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
            <Save size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
