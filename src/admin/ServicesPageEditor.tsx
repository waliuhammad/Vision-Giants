import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import {
  CircleAlert,
  CircleCheck,
  ExternalLink,
  Eye,
  Layers,
  LoaderCircle,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { getAdminDb, getAdminStorage } from './firebase';
import {
  defaultServicesPageData,
  servicesPageDataFromDoc,
  type ServicesPageData,
  type ServiceWhyReason,
} from '../content/servicesPageData';
import { services as defaultServices } from '../data/services';

const firestore = () => import('firebase/firestore/lite');
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'];

async function uploadImage(file: File, prefix: string): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Use PNG, JPEG, WebP, AVIF or GIF images.');
  if (file.size >= 5 * 1024 * 1024) throw new Error('Images must be smaller than 5 MB.');
  const [storage, { ref, uploadBytes, getDownloadURL }] = await Promise.all([
    getAdminStorage(),
    import('firebase/storage'),
  ]);
  const safe = file.name.replace(/[^\w.-]+/g, '_').slice(-80);
  const result = await uploadBytes(ref(storage, `${prefix}/${Date.now()}-${safe}`), file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000',
  });
  return getDownloadURL(result.ref);
}

export function ServicesPageEditor() {
  const [data, setData] = useState<ServicesPageData>(defaultServicesPageData);
  const [activeTab, setActiveTab] = useState<'hero' | 'whatWeDo' | 'whyChooseUs' | 'grid' | 'visibility'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingWhy, setUploadingWhy] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'pages', 'services-page'));
      if (snap.exists()) {
        setData(servicesPageDataFromDoc(snap.data()));
      } else {
        const legacySnap = await getDoc(doc(db, 'pages', 'services'));
        if (legacySnap.exists()) {
          setData(servicesPageDataFromDoc(legacySnap.data()));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Could not load services page configuration from database. Showing default content.');
    } finally {
      setLoading(false);
    }
  };

  const update = (patch: Partial<ServicesPageData>) => {
    setData((prev) => ({ ...prev, ...patch }));
    setSuccess('');
    setError('');
  };

  const updateVisibility = (key: keyof ServicesPageData['visibility'], value: boolean) => {
    update({
      visibility: {
        ...data.visibility,
        [key]: value,
      },
    });
  };

  const handleSave = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const [db, { doc, setDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await Promise.all([
        setDoc(doc(db, 'pages', 'services-page'), data, { merge: true }),
        setDoc(doc(db, 'pages', 'services'), data, { merge: true }),
      ]);
      setSuccess('Services Page content updated and published successfully!');
      setTimeout(() => setSuccess(''), 4500);
    } catch (err) {
      console.error(err);
      setError('Failed to save to database. Please check permissions.');
    } finally {
      setSaving(false);
    }
  };

  // Focus points handlers
  const handleAddFocusPoint = () => {
    update({
      whatWeDoFocusPoints: [...data.whatWeDoFocusPoints, 'New focus area'],
    });
  };

  const handleUpdateFocusPoint = (index: number, val: string) => {
    const next = [...data.whatWeDoFocusPoints];
    next[index] = val;
    update({ whatWeDoFocusPoints: next });
  };

  const handleDeleteFocusPoint = (index: number) => {
    update({
      whatWeDoFocusPoints: data.whatWeDoFocusPoints.filter((_, i) => i !== index),
    });
  };

  // Why choose us reasons handlers
  const handleAddReason = () => {
    const newReason: ServiceWhyReason = {
      id: `reason-${Date.now()}`,
      title: 'New Benefit Title',
      description: 'Explain this key advantage and what value it creates for the client.',
      icon: 'award',
    };
    update({
      whyChooseUsReasons: [...data.whyChooseUsReasons, newReason],
    });
  };

  const handleUpdateReason = (index: number, patch: Partial<ServiceWhyReason>) => {
    const next = [...data.whyChooseUsReasons];
    next[index] = { ...next[index], ...patch };
    update({ whyChooseUsReasons: next });
  };

  const handleDeleteReason = (index: number) => {
    update({
      whyChooseUsReasons: data.whyChooseUsReasons.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center' }}>
        <LoaderCircle className="spin" size={28} />
        <p style={{ marginTop: '0.75rem', color: 'var(--color-muted)' }}>Loading Services Page Editor…</p>
      </div>
    );
  }

  return (
    <div className="admin-editor services-editor">
      {/* Top Header Bar */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge" style={{ background: 'var(--color-surface-blue)', color: 'var(--color-primary)' }}>
              Page Customizer
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>/services</span>
          </div>
          <h1 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.75rem', fontWeight: 700 }}>
            Services Page Editor
          </h1>
          <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            Customize the banner, "What We Do" focus areas, "Why Choose Us" showcase, and highlighted service card.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="/services/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Eye size={16} />
            <span>View Live Page</span>
            <ExternalLink size={13} style={{ opacity: 0.6 }} />
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="btn btn--primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />}
            <span>{saving ? 'Publishing…' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="admin-alert admin-alert--error" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.6rem' }}>
          <CircleAlert size={18} />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert--success" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.6rem' }}>
          <CircleCheck size={18} />
          <div>{success}</div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        className="admin-tabs"
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '2rem',
          paddingBottom: '0.25rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`admin-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
          style={{
            padding: '0.6rem 1.1rem',
            background: activeTab === 'hero' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'hero' ? '#fff' : 'var(--color-text)',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          1. Hero Banner
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatWeDo')}
          className={`admin-tab-btn ${activeTab === 'whatWeDo' ? 'active' : ''}`}
          style={{
            padding: '0.6rem 1.1rem',
            background: activeTab === 'whatWeDo' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'whatWeDo' ? '#fff' : 'var(--color-text)',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          2. What We Do
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whyChooseUs')}
          className={`admin-tab-btn ${activeTab === 'whyChooseUs' ? 'active' : ''}`}
          style={{
            padding: '0.6rem 1.1rem',
            background: activeTab === 'whyChooseUs' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'whyChooseUs' ? '#fff' : 'var(--color-text)',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          3. Why Choose Us
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grid')}
          className={`admin-tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
          style={{
            padding: '0.6rem 1.1rem',
            background: activeTab === 'grid' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'grid' ? '#fff' : 'var(--color-text)',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          4. Services Grid & Highlight
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visibility')}
          className={`admin-tab-btn ${activeTab === 'visibility' ? 'active' : ''}`}
          style={{
            padding: '0.6rem 1.1rem',
            background: activeTab === 'visibility' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'visibility' ? '#fff' : 'var(--color-text)',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          5. Section Visibility
        </button>
      </div>

      {/* TAB 1: HERO BANNER */}
      {activeTab === 'hero' && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Top Hero Banner
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            The top header banner with background image, title, and the bottom-right notched breadcrumb tab.
          </p>

          <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label className="admin-label">Banner Title</label>
              <input
                type="text"
                className="admin-input"
                value={data.heroTitle}
                onChange={(e) => update({ heroTitle: e.target.value })}
                placeholder="Services"
              />
            </div>

            <div>
              <label className="admin-label">Breadcrumb Text</label>
              <input
                type="text"
                className="admin-input"
                value={data.heroBreadcrumb}
                onChange={(e) => update({ heroBreadcrumb: e.target.value })}
                placeholder="Home → Services"
              />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label className="admin-label">Banner Background Image</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                className="admin-input"
                value={data.heroBackgroundImage}
                onChange={(e) => update({ heroBackgroundImage: e.target.value })}
                placeholder="https://..."
                style={{ flex: 1 }}
              />
              <label className="btn btn--outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={16} />
                <span>{uploadingHero ? 'Uploading…' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingHero}
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingHero(true);
                    try {
                      const url = await uploadImage(file, 'services-hero');
                      update({ heroBackgroundImage: url });
                    } catch (err: unknown) {
                      alert(err instanceof Error ? err.message : 'Upload failed');
                    } finally {
                      setUploadingHero(false);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Banner Preview */}
          {data.heroBackgroundImage && (
            <div style={{ marginTop: '1.5rem' }}>
              <span className="admin-label">Banner Live Preview</span>
              <div
                style={{
                  position: 'relative',
                  height: '180px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundImage: `linear-gradient(rgba(11, 23, 48, 0.75), rgba(11, 23, 48, 0.75)), url(${data.heroBackgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{data.heroTitle || 'Services'}</h3>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#fff',
                    color: 'var(--color-navy)',
                    padding: '0.4rem 1.25rem',
                    borderTopLeftRadius: '14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {data.heroBreadcrumb || 'Home → Services'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WHAT WE DO */}
      {activeTab === 'whatWeDo' && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            "What We Do" Section
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Two-column layout with bold headline, intro paragraphs, and checklist of key focus areas.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="admin-label">Small Tag / Badge</label>
            <input
              type="text"
              className="admin-input"
              value={data.whatWeDoBadge}
              onChange={(e) => update({ whatWeDoBadge: e.target.value })}
              placeholder="What we do"
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="admin-label">Main Heading</label>
            <input
              type="text"
              className="admin-input"
              value={data.whatWeDoHeading}
              onChange={(e) => update({ whatWeDoHeading: e.target.value })}
              placeholder="Empowering You to Live Your Best Life & Achieve Lasting Personal Transformation"
            />
          </div>

          <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="admin-label">Paragraph 1</label>
              <textarea
                className="admin-input"
                rows={4}
                value={data.whatWeDoDescription1}
                onChange={(e) => update({ whatWeDoDescription1: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Paragraph 2</label>
              <textarea
                className="admin-input"
                rows={4}
                value={data.whatWeDoDescription2}
                onChange={(e) => update({ whatWeDoDescription2: e.target.value })}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label" style={{ marginBottom: 0 }}>Checklist Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.whatWeDoFocusHeading}
                  onChange={(e) => update({ whatWeDoFocusHeading: e.target.value })}
                  style={{ marginTop: '0.35rem', maxWidth: '320px' }}
                />
              </div>

              <button
                type="button"
                onClick={handleAddFocusPoint}
                className="btn btn--outline btn--sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={15} />
                <span>Add Focus Point</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {data.whatWeDoFocusPoints.map((point, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--color-surface-2)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>✓</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={point}
                    onChange={(e) => handleUpdateFocusPoint(index, e.target.value)}
                    style={{ background: '#fff', border: '1px solid var(--border)', padding: '0.4rem 0.6rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFocusPoint(index)}
                    className="icon-btn"
                    title="Delete item"
                    style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHY CHOOSE US */}
      {activeTab === 'whyChooseUs' && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            "Why Choose Us" Showcase
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Featured mentor/advisor photo with interactive circle button and 4 key trust cards.
          </p>

          <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="admin-label">Tag / Badge</label>
              <input
                type="text"
                className="admin-input"
                value={data.whyChooseUsBadge}
                onChange={(e) => update({ whyChooseUsBadge: e.target.value })}
                placeholder="Why Choose Us?"
              />
            </div>
            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={data.whyChooseUsHeading}
                onChange={(e) => update({ whyChooseUsHeading: e.target.value })}
                placeholder="Why Choose Us for Your Personal Transformation Journey?"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label className="admin-label">Advisor / Mentor Photo URL</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                className="admin-input"
                value={data.whyChooseUsImage}
                onChange={(e) => update({ whyChooseUsImage: e.target.value })}
                placeholder="https://..."
                style={{ flex: 1 }}
              />
              <label className="btn btn--outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={16} />
                <span>{uploadingWhy ? 'Uploading…' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingWhy}
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingWhy(true);
                    try {
                      const url = await uploadImage(file, 'services-why');
                      update({ whyChooseUsImage: url });
                    } catch (err: unknown) {
                      alert(err instanceof Error ? err.message : 'Upload failed');
                    } finally {
                      setUploadingWhy(false);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Benefit Cards List */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Benefit Cards (Right Column)</h3>
                <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                  Cards displayed on the right of the advisor photo with rounded icon badges.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddReason}
                className="btn btn--outline btn--sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Plus size={15} />
                <span>Add Benefit Card</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.whyChooseUsReasons.map((reason, index) => (
                <div
                  key={reason.id || index}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    background: 'var(--color-surface-2)',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-surface-blue)', color: 'var(--color-primary)', fontWeight: 700 }}>
                    {index + 1}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="admin-label">Card Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={reason.title}
                        onChange={(e) => handleUpdateReason(index, { title: e.target.value })}
                        style={{ background: '#fff' }}
                      />
                    </div>

                    <div>
                      <label className="admin-label">Icon Identifier</label>
                      <select
                        className="admin-input"
                        value={reason.icon || 'award'}
                        onChange={(e) => handleUpdateReason(index, { icon: e.target.value })}
                        style={{ background: '#fff' }}
                      >
                        <option value="award">Award / Certified</option>
                        <option value="star">Star / Proven Success</option>
                        <option value="target">Target / Action Plans</option>
                        <option value="shield-check">Shield / Supportive Space</option>
                        <option value="heart">Heart / Care & Wellness</option>
                        <option value="users">Users / Mentorship</option>
                        <option value="zap">Zap / Fast Acceleration</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="admin-label">Card Description</label>
                      <textarea
                        className="admin-input"
                        rows={2}
                        value={reason.description}
                        onChange={(e) => handleUpdateReason(index, { description: e.target.value })}
                        style={{ background: '#fff' }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReason(index)}
                    className="icon-btn"
                    title="Delete card"
                    style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES GRID & HIGHLIGHT */}
      {activeTab === 'grid' && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Services Grid & Highlighted Card
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Customize the 4-column service cards grid and choose which card is visually highlighted in the theme's signature accent style.
          </p>

          <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="admin-label">Badge</label>
              <input
                type="text"
                className="admin-input"
                value={data.servicesGridBadge}
                onChange={(e) => update({ servicesGridBadge: e.target.value })}
                placeholder="Our Services"
              />
            </div>

            <div>
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={data.servicesGridHeading}
                onChange={(e) => update({ servicesGridHeading: e.target.value })}
                placeholder="Tailored Services to *Grow & Protect* Your Wealth"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="admin-label">Intro / Subtitle Text</label>
            <textarea
              className="admin-input"
              rows={2}
              value={data.servicesGridLead}
              onChange={(e) => update({ servicesGridLead: e.target.value })}
            />
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(44, 67, 119, 0.08) 0%, rgba(20, 36, 74, 0.04) 100%)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Featured / Highlighted Card (Card #2 Accent Style)
              </h3>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
              In the design, the 2nd card is rendered in the signature accent color with contrasting typography and badge.
              Select which service you want to highlight below:
            </p>

            <div style={{ maxWidth: '400px' }}>
              <label className="admin-label">Select Featured Service</label>
              <select
                className="admin-input"
                value={data.featuredServiceId}
                onChange={(e) => update({ featuredServiceId: e.target.value })}
                style={{ background: '#fff', fontWeight: 600 }}
              >
                {defaultServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.id})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Link
                to="/admin/services"
                className="btn btn--outline btn--sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Layers size={14} />
                <span>Manage Individual Services (Titles, Descriptions, Deliverables)</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VISIBILITY */}
      {activeTab === 'visibility' && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Section Visibility Toggles
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Turn individual sections of the Services Page on or off.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.visibility.hero}
                onChange={(e) => updateVisibility('hero', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 600 }}>Top Hero Banner</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.visibility.whatWeDo}
                onChange={(e) => updateVisibility('whatWeDo', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 600 }}>"What We Do" Section</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.visibility.whyChooseUs}
                onChange={(e) => updateVisibility('whyChooseUs', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 600 }}>"Why Choose Us" Showcase</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.visibility.services}
                onChange={(e) => updateVisibility('services', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 600 }}>Services Grid (4-Column Cards)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.visibility.faq}
                onChange={(e) => updateVisibility('faq', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 600 }}>Frequently Asked Questions (FAQ)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={data.visibility.cta}
                onChange={(e) => updateVisibility('cta', e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 600 }}>Closing Call to Action (CTA Band)</span>
            </label>
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: '1rem',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
          Click Save to publish your Services Page updates to Firestore.
        </span>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="btn btn--primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />}
          <span>{saving ? 'Publishing…' : 'Save & Publish'}</span>
        </button>
      </div>
    </div>
  );
}
