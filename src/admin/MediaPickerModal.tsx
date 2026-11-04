import { useState, useEffect } from 'react';
import {
  X,
  Search,
  Upload,
  Check,
  Image as ImageIcon,
  Plus,
  LoaderCircle,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import type { MediaItem } from '../content/cmsTypes';

const firestore = () => import('firebase/firestore/lite');

// Default built-in website assets that admins can reuse immediately
const BUILTIN_ASSETS: MediaItem[] = [
  { id: 'logo-mark', name: 'Vision Giants Mark', url: '/logo-mark.png', type: 'image/png', uploadedAt: 'Built-in' },
  { id: 'favicon', name: 'Vision Giants Favicon', url: '/favicon.png', type: 'image/png', uploadedAt: 'Built-in' },
  { id: 'og-image', name: 'Vision Giants OG Cover', url: '/og-image.png', type: 'image/png', uploadedAt: 'Built-in' },
  { id: 'about-hero', name: 'About Page Hero Team', url: '/images/about/hero.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-ai-brand', name: 'Client: AI Brand Craft', url: '/images/clients/ai-brand-craft.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-marketing', name: 'Client: AI Marketing Builders', url: '/images/clients/ai-marketing-builders.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-qaswa', name: 'Client: Al-Qaswa Foods', url: '/images/clients/al-qaswa-foods.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-alexa', name: 'Client: Alexa Movers', url: '/images/clients/alexa-movers.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-b-brothers', name: 'Client: B Brothers Mart', url: '/images/clients/b-brothers-mart.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-chicago', name: 'Client: Chicago Group', url: '/images/clients/chicago-group.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-direction', name: 'Client: Direction Schools', url: '/images/clients/direction-schools.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-sportif', name: 'Client: Sportif Padel', url: '/images/clients/sportif-padel.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'client-pny', name: 'Client: PNY Trainings', url: '/images/clients/pny-trainings.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-sportif-1', name: 'Portfolio: Sportif Padel 1', url: '/portfolio/sportif-padel/1.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-sportif-2', name: 'Portfolio: Sportif Padel 2', url: '/portfolio/sportif-padel/2.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-sportif-3', name: 'Portfolio: Sportif Padel 3', url: '/portfolio/sportif-padel/3.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-sportif-mob', name: 'Portfolio: Sportif Mobile', url: '/portfolio/sportif-padel/mobile.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-tern-1', name: 'Portfolio: Tern Tech 1', url: '/portfolio/tern-technologies/1.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-tern-2', name: 'Portfolio: Tern Tech 2', url: '/portfolio/tern-technologies/2.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-toyland-1', name: 'Portfolio: Toyland 1', url: '/portfolio/toyland/1.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-visionary-1', name: 'Portfolio: Visionary IT 1', url: '/portfolio/visionary-it/1.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'portfolio-zmart-1', name: 'Portfolio: Zmart 1', url: '/portfolio/zmart/1.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'service-web', name: 'Service: Web Development', url: '/images/services/web-development.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'service-app', name: 'Service: App Development', url: '/images/services/app-development.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'service-ai', name: 'Service: AI & Machine Learning', url: '/images/services/artificial-intelligence.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'service-cloud', name: 'Service: Cloud Solutions', url: '/images/services/cloud-solutions.webp', type: 'image/webp', uploadedAt: 'Built-in' },
  { id: 'service-design', name: 'Service: UI/UX Design', url: '/images/services/ui-ux-design.webp', type: 'image/webp', uploadedAt: 'Built-in' },
];

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  title = 'Select Media',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'url'>('browse');
  const [search, setSearch] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(BUILTIN_ASSETS);
  const [selectedUrl, setSelectedUrl] = useState(currentValue || '');
  const [customUrl, setCustomUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Load uploaded media from Firestore
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    (async () => {
      try {
        const [db, { collection, getDocs }] = await Promise.all([getAdminDb(), firestore()]);
        const snap = await getDocs(collection(db, 'media'));
        if (!active) return;
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
        setMediaItems([...uploaded, ...BUILTIN_ASSETS]);
      } catch (err) {
        console.warn('Could not load custom media from Firestore; showing built-in assets', err);
      }
    })();
    return () => {
      active = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size must be under 2MB for fast delivery.');
      return;
    }

    setUploading(true);
    setUploadError('');

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
        };

        // Save to Firestore media collection
        const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
        await setDoc(doc(db, 'media', newItem.id), {
          ...newItem,
          createdAt: serverTimestamp(),
        });

        setMediaItems((prev) => [newItem, ...prev]);
        setSelectedUrl(dataUrl);
        setActiveTab('browse');
      } catch (err) {
        console.error(err);
        setUploadError('Failed to save media to database.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (activeTab === 'url' && customUrl.trim()) {
      onSelect(customUrl.trim());
    } else if (selectedUrl) {
      onSelect(selectedUrl);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="admin-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 23, 48, 0.75)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          background: 'var(--color-surface, #ffffff)',
          borderRadius: 'var(--radius-lg, 12px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--color-border, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ImageIcon size={20} className="text-primary" />
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>{title}</h2>
          </div>
          <button
            type="button"
            className="btn btn--plain btn--sm"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs & Search */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--color-border, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn btn--sm ${activeTab === 'browse' ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => setActiveTab('browse')}
            >
              Browse Library ({mediaItems.length})
            </button>
            <button
              type="button"
              className={`btn btn--sm ${activeTab === 'upload' ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={14} style={{ marginRight: 4 }} />
              Upload New
            </button>
            <button
              type="button"
              className={`btn btn--sm ${activeTab === 'url' ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => setActiveTab('url')}
            >
              Custom URL
            </button>
          </div>

          {activeTab === 'browse' && (
            <div style={{ position: 'relative', width: 260 }}>
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
                placeholder="Search images by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 32,
                  paddingRight: 10,
                  height: 34,
                  fontSize: '0.875rem',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                }}
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', minHeight: 320 }}>
          {activeTab === 'browse' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '1rem',
              }}
            >
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedUrl(item.url)}
                    style={{
                      border: isSelected
                        ? '2px solid var(--color-primary, #2563eb)'
                        : '1px solid var(--color-border, #e2e8f0)',
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'var(--color-surface, #fff)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        height: 90,
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                        loading="lazy"
                      />
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            background: 'var(--color-primary, #2563eb)',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={13} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}>
                      <strong
                        style={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={item.name}
                      >
                        {item.name}
                      </strong>
                      <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>
                        {item.uploadedAt}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredItems.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
                  <ImageIcon size={36} className="text-muted" style={{ margin: '0 auto 0.5rem' }} />
                  <p>No media files found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div
              style={{
                border: '2px dashed var(--color-border, #cbd5e1)',
                borderRadius: 12,
                padding: '3rem 2rem',
                textAlign: 'center',
                background: '#f8fafc',
              }}
            >
              <Upload size={40} style={{ color: 'var(--color-primary)', margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Upload Image to Library</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Supports PNG, JPEG, WebP, SVG, and GIF up to 2MB.
              </p>

              {uploadError && (
                <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {uploadError}
                </p>
              )}

              <label className="btn btn--primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                {uploading ? (
                  <>
                    <LoaderCircle size={16} className="spin" style={{ marginRight: 6 }} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus size={16} style={{ marginRight: 6 }} />
                    Select Image File
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
          )}

          {activeTab === 'url' && (
            <div style={{ maxWidth: 500, margin: '2rem auto' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Direct Image or Media URL:
              </label>
              <input
                type="url"
                placeholder="https://example.com/images/hero.jpg"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  marginBottom: '1rem',
                }}
              />
              {customUrl && (
                <div
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    padding: '0.5rem',
                    textAlign: 'center',
                    background: '#f8fafc',
                  }}
                >
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: '0 0 0.5rem' }}>
                    Preview:
                  </p>
                  <img
                    src={customUrl}
                    alt="Preview"
                    style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--color-border, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface, #fff)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', maxWidth: '60%' }}>
            {selectedUrl && (
              <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Selected: <code>{selectedUrl}</code>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn--outline btn--sm" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              disabled={activeTab === 'url' ? !customUrl.trim() : !selectedUrl}
              onClick={handleConfirm}
            >
              Choose Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
