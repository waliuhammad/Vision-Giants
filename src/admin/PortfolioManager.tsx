import { useState, useEffect, type FormEvent } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  X,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  Search,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { projects as defaultProjects, categoryLabels, type Project, type ProjectCategory } from '../data/portfolio';
import { fromDoc } from '../content/schema';
import { MediaPickerModal } from './MediaPickerModal';

const firestore = () => import('firebase/firestore/lite');

export function PortfolioManager() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Editing state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTargetIdx, setMediaPickerTargetIdx] = useState<number | 'cover' | 'gallery'>('cover');

  // Form text helpers
  const [featuresStr, setFeaturesStr] = useState('');
  const [techStr, setTechStr] = useState('');
  const [imagesList, setImagesList] = useState<string[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDocs(collection(db, 'projects'));
      if (snap.empty) {
        setProjects(defaultProjects);
      } else {
        const loaded = snap.docs
          .map((d) => ({
            order: Number(d.get('order') ?? 0),
            item: fromDoc.projects(d.id, d.data()),
          }))
          .sort((a, b) => a.order - b.order)
          .map((x) => x.item);
        setProjects(loaded.length > 0 ? loaded : defaultProjects);
      }
    } catch (err) {
      console.warn('Could not load projects from Firestore, showing default projects:', err);
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Project) => {
    setEditingProject({ ...p });
    setIsNew(false);
    setFeaturesStr((p.features || []).join('\n'));
    setTechStr((p.tech || []).join(', '));
    setImagesList(p.images && p.images.length > 0 ? [...p.images] : p.imageUrl ? [p.imageUrl] : []);
  };

  const startNew = () => {
    const id = `project-${Date.now()}`;
    const newProj: Project = {
      id,
      title: 'New Featured Project',
      category: 'web',
      industry: 'Custom Software',
      summary: 'A short description of this client or internal project.',
      details: 'Comprehensive project details and outcome overview.',
      features: ['Modern responsive design', 'Fast loading speed', 'Secure API integration'],
      tech: ['React', 'TypeScript', 'Node.js'],
      url: 'https://example.com',
      images: [],
      preview: 'dashboard',
      isDemo: false,
    };
    setEditingProject(newProj);
    setIsNew(true);
    setFeaturesStr(newProj.features.join('\n'));
    setTechStr(newProj.tech.join(', '));
    setImagesList([]);
  };

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const parsedFeatures = featuresStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedTech = techStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: Project = {
      ...editingProject,
      features: parsedFeatures,
      tech: parsedTech,
      images: imagesList,
      imageUrl: imagesList[0] || '',
    };

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const currentProjects = projects || [];
      const order = isNew
        ? currentProjects.length
        : currentProjects.findIndex((p) => p.id === updated.id);

      await setDoc(doc(db, 'projects', updated.id), {
        title: updated.title,
        category: updated.category,
        industry: updated.industry || '',
        summary: updated.summary,
        details: updated.details,
        features: updated.features,
        tech: updated.tech,
        url: updated.url || '',
        images: updated.images,
        imageUrl: updated.imageUrl || '',
        preview: updated.preview,
        isDemo: updated.isDemo,
        published: true,
        order: order >= 0 ? order : currentProjects.length,
        updatedAt: serverTimestamp(),
      });

      // Also ensure contentManaged is marked true in config/public
      await setDoc(doc(db, 'config', 'public'), { contentManaged: true }, { merge: true });

      setProjects((prev) => {
        if (!prev) return [updated];
        if (isNew) return [...prev, updated];
        return prev.map((p) => (p.id === updated.id ? updated : p));
      });

      setSuccess(`Project "${updated.title}" saved successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      setEditingProject(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save project to Firestore. Check permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'projects', id));
      setProjects((prev) => (prev ? prev.filter((p) => p.id !== id) : []));
      setSuccess(`Project "${title}" deleted.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete project from Firestore.');
    }
  };

  const addImageToGallery = (url: string) => {
    if (mediaPickerTargetIdx === 'cover') {
      setImagesList([url, ...imagesList.filter((u) => u !== url)]);
    } else {
      setImagesList([...imagesList, url]);
    }
  };

  const removeGalleryImage = (idx: number) => {
    setImagesList(imagesList.filter((_, i) => i !== idx));
  };

  const filteredProjects = (projects || []).filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      (p.industry || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Portfolio & Projects Management</h1>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary" onClick={startNew}>
            <Plus size={16} style={{ marginRight: 6 }} /> Add New Project
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

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn--sm ${selectedCategory === 'all' ? 'btn--primary' : 'btn--outline'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Projects ({projects?.length || 0})
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`btn btn--sm ${selectedCategory === key ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => setSelectedCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search projects by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: 34,
              paddingRight: 10,
              height: 36,
              fontSize: '0.875rem',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
            }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <LoaderCircle size={28} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
          <p>Loading portfolio projects...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredProjects.map((proj) => {
            const coverImage = proj.images?.[0] || proj.imageUrl;
            return (
              <div
                key={proj.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: 12,
                }}
              >
                {/* Thumbnail / Cover */}
                <div
                  style={{
                    height: 160,
                    background: '#0f172a',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                      <Briefcase size={32} style={{ margin: '0 auto 6px' }} />
                      <span style={{ fontSize: '0.8rem', display: 'block' }}>{proj.preview} illustration</span>
                    </div>
                  )}

                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 4,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {categoryLabels[proj.category] || proj.category}
                  </span>

                  {proj.isDemo && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: '#f59e0b',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      CONCEPT
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{proj.title}</h3>
                    {proj.industry && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                        {proj.industry}
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-muted)',
                      margin: '0.5rem 0 1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                    }}
                  >
                    {proj.summary}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: '1rem' }}>
                    {proj.tech.slice(0, 4).map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          background: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {proj.tech.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                        +{proj.tech.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => startEdit(proj)}
                      >
                        <Pencil size={14} style={{ marginRight: 4 }} /> Edit
                      </button>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn--plain btn--sm"
                          title="Open Live Site"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      onClick={() => handleDelete(proj.id, proj.title)}
                      style={{ color: '#dc2626' }}
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Edit / Create Modal */}
      {editingProject && (
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
          onClick={() => setEditingProject(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: 820,
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              background: '#fff',
              borderRadius: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>
                  {isNew ? 'Create New Portfolio Project' : `Edit: ${editingProject.title}`}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  ID: <code>{editingProject.id}</code>
                </span>
              </div>
              <button
                type="button"
                className="btn btn--plain btn--sm"
                onClick={() => setEditingProject(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              id="project-edit-form"
              onSubmit={handleSaveProject}
              style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'grid', gap: '1.25rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Project Title:
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Category:
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="input"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Industry / Subtitle:
                  </label>
                  <input
                    type="text"
                    value={editingProject.industry || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, industry: e.target.value })}
                    placeholder="e.g. E-commerce · Sports equipment (UAE)"
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Live Website URL:
                  </label>
                  <input
                    type="url"
                    value={editingProject.url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, url: e.target.value })}
                    placeholder="https://sportifpadel.com"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Card Summary (1-2 sentences):
                </label>
                <textarea
                  rows={2}
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Full Details & Case Study Description:
                </label>
                <textarea
                  rows={4}
                  value={editingProject.details}
                  onChange={(e) => setEditingProject({ ...editingProject, details: e.target.value })}
                  className="input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Key Features (one per line):
                  </label>
                  <textarea
                    rows={4}
                    value={featuresStr}
                    onChange={(e) => setFeaturesStr(e.target.value)}
                    placeholder="Shop by series&#10;Sale pricing and discount codes&#10;WhatsApp chat integration"
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Technologies Used (comma-separated):
                  </label>
                  <textarea
                    rows={4}
                    value={techStr}
                    onChange={(e) => setTechStr(e.target.value)}
                    placeholder="React, TypeScript, Tailwind, Firebase, Stripe"
                    className="input"
                  />
                </div>
              </div>

              {/* Screenshots Gallery with Media Library Integration */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Screenshots & Cover Images:</label>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => {
                      setMediaPickerTargetIdx('gallery');
                      setMediaPickerOpen(true);
                    }}
                  >
                    <Plus size={14} style={{ marginRight: 4 }} /> Add Image from Media Library
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', minHeight: 80, background: '#f8fafc', padding: '0.75rem', borderRadius: 8 }}>
                  {imagesList.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 110,
                        height: 80,
                        borderRadius: 6,
                        overflow: 'hidden',
                        position: 'relative',
                        border: idx === 0 ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: '#fff',
                      }}
                    >
                      <img src={imgUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {idx === 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            left: 2,
                            background: '#2563eb',
                            color: '#fff',
                            fontSize: 9,
                            padding: '1px 4px',
                            borderRadius: 2,
                          }}
                        >
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {imagesList.length === 0 && (
                    <p style={{ margin: 'auto', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                      No images selected. First image added becomes the cover screenshot.
                    </p>
                  )}
                </div>
              </div>

              {/* Demo checkbox */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={editingProject.isDemo}
                    onChange={(e) => setEditingProject({ ...editingProject, isDemo: e.target.checked })}
                  />
                  Mark as Concept / Prototype Demo Project
                </label>
              </div>
            </form>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                background: '#fff',
              }}
            >
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => setEditingProject(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="project-edit-form"
                className="btn btn--primary btn--sm"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Project to Database'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(url) => {
            addImageToGallery(url);
            setMediaPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}
