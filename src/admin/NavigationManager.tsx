import { useState, useEffect, type FormEvent } from 'react';
import {
  Save,
  Menu,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Link as LinkIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultNavigationSettings } from '../content/cmsDefaults';
import type { NavigationSettings } from '../content/cmsTypes';

const firestore = () => import('firebase/firestore/lite');

export function NavigationManager() {
  const [data, setData] = useState<NavigationSettings>(defaultNavigationSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadNav();
  }, []);

  const loadNav = async () => {
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'site_content', 'navigation'));
      if (snap.exists()) {
        setData({ ...defaultNavigationSettings, ...(snap.data() as Partial<NavigationSettings>) });
      }
    } catch (err) {
      console.warn('Could not load navigation from Firestore, using defaults:', err);
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
        setDoc(doc(db, 'site_content', 'navigation'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'navigation'), payload, { merge: true }),
      ]);
      setSuccess('Navigation menus saved successfully! Header and footer links are updated.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save navigation menus to database.');
    } finally {
      setSaving(false);
    }
  };

  // Header Nav helpers
  const updateHeaderItem = (idx: number, field: 'label' | 'to', value: string) => {
    const list = [...data.headerNav];
    list[idx] = { ...list[idx], [field]: value };
    setData({ ...data, headerNav: list });
  };

  const toggleHeaderActive = (idx: number) => {
    const list = [...data.headerNav];
    list[idx] = { ...list[idx], active: list[idx].active === false ? true : false };
    setData({ ...data, headerNav: list });
  };

  const moveHeaderItem = (idx: number, dir: 'up' | 'down') => {
    const list = [...data.headerNav];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;
    setData({ ...data, headerNav: list });
  };

  const addHeaderItem = () => {
    setData({
      ...data,
      headerNav: [...data.headerNav, { label: 'New Link', to: '/new-page/', active: true }],
    });
  };

  const removeHeaderItem = (idx: number) => {
    setData({
      ...data,
      headerNav: data.headerNav.filter((_, i) => i !== idx),
    });
  };

  // Footer Company Nav helpers
  const updateFooterItem = (idx: number, field: 'label' | 'to', value: string) => {
    const list = [...data.footerCompanyNav];
    list[idx] = { ...list[idx], [field]: value };
    setData({ ...data, footerCompanyNav: list });
  };

  const toggleFooterActive = (idx: number) => {
    const list = [...data.footerCompanyNav];
    list[idx] = { ...list[idx], active: list[idx].active === false ? true : false };
    setData({ ...data, footerCompanyNav: list });
  };

  const moveFooterItem = (idx: number, dir: 'up' | 'down') => {
    const list = [...data.footerCompanyNav];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;
    setData({ ...data, footerCompanyNav: list });
  };

  const addFooterItem = () => {
    setData({
      ...data,
      footerCompanyNav: [...data.footerCompanyNav, { label: 'New Footer Link', to: '/about/', active: true }],
    });
  };

  const removeFooterItem = (idx: number) => {
    setData({
      ...data,
      footerCompanyNav: data.footerCompanyNav.filter((_, i) => i !== idx),
    });
  };

  if (loading) {
    return (
      <div className="admin-page text-center" style={{ padding: '4rem 1rem' }}>
        <LoaderCircle size={32} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
        <p>Loading navigation menus...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Navigation & Menu Management</h1>
        </div>
        <div className="admin-page__actions">
          <button type="submit" form="navigation-form" className="btn btn--primary" disabled={saving}>
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

      <form id="navigation-form" onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
        {/* Main Header Menu */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Menu size={20} className="text-primary" />
                Main Header Navigation
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                Items displayed in the top navbar and responsive slide-out drawer.
              </span>
            </div>
            <button type="button" className="btn btn--outline btn--sm" onClick={addHeaderItem}>
              <Plus size={14} style={{ marginRight: 4 }} /> Add Menu Item
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {data.headerNav.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: item.active === false ? '#f1f5f9' : '#fff',
                  opacity: item.active === false ? 0.65 : 1,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    style={{ padding: 2 }}
                    disabled={idx === 0}
                    onClick={() => moveHeaderItem(idx, 'up')}
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    style={{ padding: 2 }}
                    disabled={idx === data.headerNav.length - 1}
                    onClick={() => moveHeaderItem(idx, 'down')}
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateHeaderItem(idx, 'label', e.target.value)}
                    placeholder="Link Label"
                    className="input"
                    style={{ height: 36, fontSize: '0.875rem' }}
                  />
                  <input
                    type="text"
                    value={item.to}
                    onChange={(e) => updateHeaderItem(idx, 'to', e.target.value)}
                    placeholder="URL Path (/services/)"
                    className="input"
                    style={{ height: 36, fontSize: '0.875rem' }}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn--plain btn--sm"
                  onClick={() => toggleHeaderActive(idx)}
                  title={item.active === false ? 'Show link' : 'Hide link'}
                >
                  {item.active === false ? <EyeOff size={16} /> : <Eye size={16} className="text-primary" />}
                </button>

                <button
                  type="button"
                  className="btn btn--plain btn--sm"
                  onClick={() => removeHeaderItem(idx)}
                  style={{ color: '#dc2626' }}
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Header CTA Button */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon size={20} className="text-primary" />
            Header Primary CTA Button
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Button Text:</label>
              <input
                type="text"
                value={data.primaryCta.label}
                onChange={(e) => setData({ ...data, primaryCta: { ...data.primaryCta, label: e.target.value } })}
                className="input"
                placeholder="Start a Project"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Destination URL:</label>
              <input
                type="text"
                value={data.primaryCta.to}
                onChange={(e) => setData({ ...data, primaryCta: { ...data.primaryCta, to: e.target.value } })}
                className="input"
                placeholder="/contact/"
              />
            </div>
          </div>
        </div>

        {/* Footer Company Menu */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Menu size={20} className="text-primary" />
                Footer Company Column Navigation
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                Links shown in the &quot;Company&quot; column of the footer.
              </span>
            </div>
            <button type="button" className="btn btn--outline btn--sm" onClick={addFooterItem}>
              <Plus size={14} style={{ marginRight: 4 }} /> Add Footer Link
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {data.footerCompanyNav.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: item.active === false ? '#f1f5f9' : '#fff',
                  opacity: item.active === false ? 0.65 : 1,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    style={{ padding: 2 }}
                    disabled={idx === 0}
                    onClick={() => moveFooterItem(idx, 'up')}
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    style={{ padding: 2 }}
                    disabled={idx === data.footerCompanyNav.length - 1}
                    onClick={() => moveFooterItem(idx, 'down')}
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateFooterItem(idx, 'label', e.target.value)}
                    placeholder="Link Label"
                    className="input"
                    style={{ height: 36, fontSize: '0.875rem' }}
                  />
                  <input
                    type="text"
                    value={item.to}
                    onChange={(e) => updateFooterItem(idx, 'to', e.target.value)}
                    placeholder="URL Path (/team/)"
                    className="input"
                    style={{ height: 36, fontSize: '0.875rem' }}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn--plain btn--sm"
                  onClick={() => toggleFooterActive(idx)}
                  title={item.active === false ? 'Show link' : 'Hide link'}
                >
                  {item.active === false ? <EyeOff size={16} /> : <Eye size={16} className="text-primary" />}
                </button>

                <button
                  type="button"
                  className="btn btn--plain btn--sm"
                  onClick={() => removeFooterItem(idx)}
                  style={{ color: '#dc2626' }}
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

