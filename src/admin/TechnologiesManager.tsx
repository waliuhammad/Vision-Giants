import { useState, useEffect, type FormEvent } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Layers,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultTechnologiesContent } from '../content/cmsDefaults';
import type { TechnologiesContent } from '../content/cmsTypes';
import type { Technology, TechId } from '../data/technologies';

const firestore = () => import('firebase/firestore/lite');

export function TechnologiesManager() {
  const [data, setData] = useState<TechnologiesContent>(defaultTechnologiesContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active sub-tab
  const [tab, setTab] = useState<'core' | 'architecture' | 'supporting'>('core');

  // Core editing
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [isNewTech, setIsNewTech] = useState(false);
  const [usesStr, setUsesStr] = useState('');

  useEffect(() => {
    loadTech();
  }, []);

  const loadTech = async () => {
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'site_content', 'technologies'));
      if (snap.exists()) {
        setData({ ...defaultTechnologiesContent, ...(snap.data() as Partial<TechnologiesContent>) });
      }
    } catch (err) {
      console.warn('Could not load technologies from Firestore, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (updatedData: TechnologiesContent) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const payload = {
        ...updatedData,
        updatedAt: serverTimestamp(),
      };
      await Promise.all([
        setDoc(doc(db, 'site_content', 'technologies'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'technologies-stack'), payload, { merge: true }),
      ]);
      setData(updatedData);
      setSuccess('Technology stack & architecture saved to database!');
      setTimeout(() => setSuccess(''), 4000);
      setEditingTech(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save technologies to Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const startEditTech = (t: Technology) => {
    setEditingTech({ ...t });
    setIsNewTech(false);
    setUsesStr(t.uses.join(', '));
  };

  const startNewTech = () => {
    const id = `tech-${Date.now()}` as TechId;
    const newT: Technology = {
      id,
      name: '',
      category: 'Frontend',
      description: '',
      uses: ['Components', 'Interfaces'],
      href: 'https://',
    };
    setEditingTech(newT);
    setIsNewTech(true);
    setUsesStr(newT.uses.join(', '));
  };

  const saveEditingTech = (e: FormEvent) => {
    e.preventDefault();
    if (!editingTech) return;

    const parsedUses = usesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedTech = { ...editingTech, uses: parsedUses };

    let updatedList: Technology[];
    if (isNewTech) {
      updatedList = [...data.technologies, updatedTech];
    } else {
      updatedList = data.technologies.map((t) => (t.id === updatedTech.id ? updatedTech : t));
    }

    handleSaveAll({
      ...data,
      technologies: updatedList,
    });
  };

  const deleteTech = (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    handleSaveAll({
      ...data,
      technologies: data.technologies.filter((t) => t.id !== id),
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Technologies & Architecture Stack</h1>
        </div>
        <div className="admin-page__actions">
          {tab === 'core' && (
            <button type="button" className="btn btn--primary" onClick={startNewTech}>
              <Plus size={16} style={{ marginRight: 6 }} /> Add Core Tool
            </button>
          )}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`btn btn--sm ${tab === 'core' ? 'btn--primary' : 'btn--outline'}`}
          onClick={() => setTab('core')}
        >
          Core Technologies ({data.technologies.length})
        </button>
        <button
          type="button"
          className={`btn btn--sm ${tab === 'architecture' ? 'btn--primary' : 'btn--outline'}`}
          onClick={() => setTab('architecture')}
        >
          Architecture Tiers ({data.architecture.length})
        </button>
        <button
          type="button"
          className={`btn btn--sm ${tab === 'supporting' ? 'btn--primary' : 'btn--outline'}`}
          onClick={() => setTab('supporting')}
        >
          Supporting Stack Groups ({data.supportingStack.length})
        </button>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <LoaderCircle size={28} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
          <p>Loading technologies data...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: Core Technologies */}
          {tab === 'core' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {data.technologies.map((t) => (
                <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t.name}</h3>
                    <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 4 }}>
                      {t.category}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: '0.5rem 0 1rem', flex: 1 }}>
                    {t.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: '1rem' }}>
                    {t.uses.map((u, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
                        {u}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                    <button type="button" className="btn btn--outline btn--sm" onClick={() => startEditTech(t)}>
                      <Pencil size={13} style={{ marginRight: 4 }} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      onClick={() => deleteTech(t.id, t.name)}
                      style={{ color: '#dc2626' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Architecture Tiers */}
          {tab === 'architecture' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {data.architecture.map((tier) => (
                <div key={tier.id} className="card">
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={18} className="text-primary" />
                    Tier: {tier.label}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {tier.nodes.map((node) => (
                      <div key={node.id} style={{ border: '1px solid var(--color-border)', borderRadius: 8, padding: '0.75rem', background: '#f8fafc' }}>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>{node.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{node.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Supporting Stack */}
          {tab === 'supporting' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {data.supportingStack.map((group) => (
                <div key={group.id} className="card">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{group.group}</h3>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                    {group.items.map((item, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Technology Edit Modal */}
      {editingTech && (
        <div
          role="dialog"
          aria-modal="true"
          className="admin-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 23, 48, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setEditingTech(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: 580,
              width: '100%',
              padding: '1.5rem',
              borderRadius: 12,
              background: '#fff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem' }}>
              {isNewTech ? 'Add Core Technology' : `Edit ${editingTech.name}`}
            </h3>

            <form onSubmit={saveEditingTech} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Technology Name:</label>
                  <input
                    type="text"
                    value={editingTech.name}
                    onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Category:</label>
                  <input
                    type="text"
                    value={editingTech.category}
                    onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Description:</label>
                <textarea
                  rows={3}
                  value={editingTech.description}
                  onChange={(e) => setEditingTech({ ...editingTech, description: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Key Uses (comma-separated):</label>
                <input
                  type="text"
                  value={usesStr}
                  onChange={(e) => setUsesStr(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Documentation URL:</label>
                <input
                  type="url"
                  value={editingTech.href}
                  onChange={(e) => setEditingTech({ ...editingTech, href: e.target.value })}
                  className="input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditingTech(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Technology'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
