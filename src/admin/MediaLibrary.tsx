import { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  LoaderCircle,
  CircleAlert,
  CircleCheck,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import type { MediaItem } from '../content/cmsTypes';

const firestore = () => import('firebase/firestore/lite');

const BUILTIN_MEDIA: MediaItem[] = [
  { id: 'logo-mark', name: 'Vision Giants Logo Mark', url: '/logo-mark.png', type: 'image/png', uploadedAt: 'System Asset' },
  { id: 'favicon', name: 'Favicon Icon', url: '/favicon.png', type: 'image/png', uploadedAt: 'System Asset' },
  { id: 'og-image', name: 'Social Open Graph Image', url: '/og-image.png', type: 'image/png', uploadedAt: 'System Asset' },
  { id: 'about-hero', name: 'About Page Team Photo', url: '/images/about/hero.webp', type: 'image/webp', uploadedAt: 'System Asset' },
  { id: 'client-ai-brand', name: 'Client Logo: AI Brand Craft', url: '/images/clients/ai-brand-craft.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-marketing', name: 'Client Logo: AI Marketing Builders', url: '/images/clients/ai-marketing-builders.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-qaswa', name: 'Client Logo: Al-Qaswa Foods', url: '/images/clients/al-qaswa-foods.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-alexa', name: 'Client Logo: Alexa Movers', url: '/images/clients/alexa-movers.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-b-brothers', name: 'Client Logo: B Brothers Mart', url: '/images/clients/b-brothers-mart.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-chicago', name: 'Client Logo: Chicago Group', url: '/images/clients/chicago-group.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-direction', name: 'Client Logo: Direction Schools', url: '/images/clients/direction-schools.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-sportif', name: 'Client Logo: Sportif Padel', url: '/images/clients/sportif-padel.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'client-pny', name: 'Client Logo: PNY Trainings', url: '/images/clients/pny-trainings.webp', type: 'image/webp', uploadedAt: 'Clients' },
  { id: 'portfolio-sportif-1', name: 'Portfolio: Sportif Padel Hero', url: '/portfolio/sportif-padel/1.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'portfolio-sportif-2', name: 'Portfolio: Sportif Padel Products', url: '/portfolio/sportif-padel/2.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'portfolio-sportif-3', name: 'Portfolio: Sportif Padel Detail', url: '/portfolio/sportif-padel/3.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'portfolio-sportif-mob', name: 'Portfolio: Sportif Mobile View', url: '/portfolio/sportif-padel/mobile.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'portfolio-tern-1', name: 'Portfolio: Tern Technologies Web', url: '/portfolio/tern-technologies/1.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'portfolio-toyland-1', name: 'Portfolio: Toyland Store', url: '/portfolio/toyland/1.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'portfolio-visionary-1', name: 'Portfolio: Visionary IT SaaS', url: '/portfolio/visionary-it/1.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'portfolio-zmart-1', name: 'Portfolio: Zmart E-commerce', url: '/portfolio/zmart/1.webp', type: 'image/webp', uploadedAt: 'Portfolio' },
  { id: 'service-web', name: 'Service: Web Development', url: '/images/services/web-development.webp', type: 'image/webp', uploadedAt: 'Services' },
  { id: 'service-app', name: 'Service: App Development', url: '/images/services/app-development.webp', type: 'image/webp', uploadedAt: 'Services' },
  { id: 'service-ai', name: 'Service: AI & Machine Learning', url: '/images/services/artificial-intelligence.webp', type: 'image/webp', uploadedAt: 'Services' },
  { id: 'service-cloud', name: 'Service: Cloud Solutions', url: '/images/services/cloud-solutions.webp', type: 'image/webp', uploadedAt: 'Services' },
  { id: 'service-design', name: 'Service: UI/UX Design', url: '/images/services/ui-ux-design.webp', type: 'image/webp', uploadedAt: 'Services' },
];

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>(BUILTIN_MEDIA);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadMedia = async () => {
    setLoading(true);
    try {
      const [db, { collection, getDocs }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDocs(collection(db, 'media'));
      const uploaded: MediaItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: (data.name as string) || d.id,
          url: (data.url as string) || '',
          type: (data.type as string) || 'image',
          size: Number(data.size) || 0,
          uploadedAt: (data.uploadedAt as string) || new Date().toISOString(),
          altText: (data.altText as string) || '',
        };
      });
      setItems([...uploaded, ...BUILTIN_MEDIA]);
    } catch (err) {
      console.warn('Could not load custom media from Firestore; showing built-in assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Media item size must be 2MB or less.');
      return;
    }

    setUploading(true);
    setError('');
    setNotice('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const newItem: MediaItem = {
          id: `media-${Date.now()}`,
          name: file.name,
          url: dataUrl,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toLocaleDateString(),
          altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        };

        const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
        await setDoc(doc(db, 'media', newItem.id), {
          ...newItem,
          createdAt: serverTimestamp(),
        });

        setItems((prev) => [newItem, ...prev]);
        setNotice('Media uploaded successfully to library!');
        setTimeout(() => setNotice(''), 4000);
      } catch (err) {
        console.error(err);
        setError('Failed to save uploaded media to database.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('portfolio-') || id.startsWith('client-') || id.startsWith('service-') || id === 'logo-mark' || id === 'favicon' || id === 'og-image' || id === 'about-hero') {
      setError('Built-in system assets cannot be deleted from the filesystem.');
      setTimeout(() => setError(''), 4000);
      return;
    }
    if (!window.confirm('Are you sure you want to delete this media item?')) return;

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'media', id));
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
      setNotice('Media item removed.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to delete media item.');
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Media Library</h1>
        </div>
        <div className="admin-page__actions">
          <label className="btn btn--primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
            {uploading ? (
              <>
                <LoaderCircle size={16} className="spin" style={{ marginRight: 6 }} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} style={{ marginRight: 6 }} />
                Upload New File
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </header>

      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {notice && (
        <p className="alert alert--success">
          <CircleCheck size={18} aria-hidden="true" />
          <span>{notice}</span>
        </p>
      )}

      {/* Upload Banner & Search Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ImageIcon size={22} className="text-primary" />
          <div>
            <strong>Total Assets in Library: {items.length}</strong>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              All media files used across Home, About, Services, Courses, Portfolio, and Blogs.
            </span>
          </div>
        </div>

        <div style={{ position: 'relative', width: 300 }}>
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
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: 34,
              paddingRight: 10,
              height: 38,
              fontSize: '0.875rem',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
            }}
          />
        </div>
      </div>

      {/* Grid of Media Assets */}
      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <LoaderCircle size={28} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
          <p>Loading media files...</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                position: 'relative',
              }}
            >
              {/* Thumbnail Container */}
              <div
                style={{
                  height: 130,
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>

              {/* Caption */}
              <div style={{ padding: '0.75rem', fontSize: '0.8rem', flex: 1 }}>
                <strong
                  style={{
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 4,
                  }}
                  title={item.name}
                >
                  {item.name}
                </strong>
                <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.75rem' }}>
                  {item.uploadedAt}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '0.5rem',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn--plain btn--sm"
                    style={{ fontSize: '0.75rem', padding: '3px 6px' }}
                    onClick={() => copyUrl(item.url, item.id)}
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    {copiedId === item.id ? 'Copied' : 'Copy'}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--plain btn--sm"
                    style={{ fontSize: '0.75rem', padding: '3px 6px' }}
                    title="Open Full Image"
                  >
                    <ExternalLink size={14} />
                  </a>

                  {!item.id.startsWith('portfolio-') &&
                    !item.id.startsWith('client-') &&
                    !item.id.startsWith('service-') &&
                    item.id !== 'logo-mark' &&
                    item.id !== 'favicon' &&
                    item.id !== 'og-image' &&
                    item.id !== 'about-hero' && (
                      <button
                        type="button"
                        className="btn btn--plain btn--sm"
                        style={{ fontSize: '0.75rem', padding: '3px 6px', marginLeft: 'auto', color: '#dc2626' }}
                        onClick={() => handleDelete(item.id)}
                        title="Delete Media"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="card text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
              <ImageIcon size={36} className="text-muted" style={{ margin: '0 auto 1rem' }} />
              <h3>No media items found</h3>
              <p className="muted">Try adjusting your search query or upload a new image above.</p>
            </div>
          )}
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedItem && (
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
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: 700,
              width: '100%',
              padding: 0,
              borderRadius: 'var(--radius-lg, 12px)',
              overflow: 'hidden',
              background: '#fff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedItem.name}</h3>
              <button
                type="button"
                className="btn btn--plain btn--sm"
                onClick={() => setSelectedItem(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', maxHeight: 380, overflow: 'hidden' }}>
              <img
                src={selectedItem.url}
                alt={selectedItem.name}
                style={{ maxHeight: 320, maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="muted">Type / Category:</span>
                <strong>{selectedItem.type} · {selectedItem.uploadedAt}</strong>
                <span className="muted">File URL:</span>
                <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{selectedItem.url}</code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => copyUrl(selectedItem.url, selectedItem.id)}
                >
                  {copiedId === selectedItem.id ? <Check size={15} className="text-success" /> : <Copy size={15} />}
                  {copiedId === selectedItem.id ? 'Copied to Clipboard' : 'Copy Direct URL'}
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setSelectedItem(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
