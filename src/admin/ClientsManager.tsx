import { useEffect, useState, type FormEvent } from 'react';
import {
  Building2,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  X,
  GripVertical,
} from 'lucide-react';
import { getAdminDb, getAdminStorage } from './firebase';
import { defaultClients, type ClientItem } from '../data/clients';

const firestore = () => import('firebase/firestore/lite');
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];

export function ClientsManager() {
  const [clients, setClients] = useState<ClientItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing modal
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs, query, orderBy }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDocs(query(collection(db, 'clients'), orderBy('order', 'asc')));

      if (snap.empty) {
        setClients(defaultClients);
      } else {
        const list: ClientItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: typeof data.name === 'string' ? data.name : '',
            logo: typeof data.logo === 'string' ? data.logo : '',
            industry: typeof data.industry === 'string' ? data.industry : 'Technology',
            description: typeof data.description === 'string' ? data.description : '',
            websiteUrl: typeof data.websiteUrl === 'string' ? data.websiteUrl : '',
            order: typeof data.order === 'number' ? data.order : 0,
            active: data.active !== false,
          };
        });
        setClients(list);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load clients from database. Using local defaults.');
      setClients(defaultClients);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (listToSave: ClientItem[]) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const [db, { doc, writeBatch, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);

      listToSave.forEach((c, idx) => {
        const ref = doc(db, 'clients', c.id);
        batch.set(
          ref,
          {
            name: c.name.trim(),
            logo: c.logo || '',
            industry: c.industry.trim() || 'Technology',
            description: c.description || '',
            websiteUrl: c.websiteUrl || '',
            order: idx + 1,
            active: c.active !== false,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      setClients(listToSave);
      setSuccess('Clients updated successfully! Changes are live on the website.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save clients to Firestore. Please verify admin privileges.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      setLogoUploadError('Please select a valid image file (PNG, SVG, WebP, JPEG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('Image size must be under 5MB.');
      return;
    }

    setUploadingLogo(true);
    setLogoUploadError('');
    try {
      const [storage, { ref, uploadBytes, getDownloadURL }] = await Promise.all([
        getAdminStorage(),
        import('firebase/storage'),
      ]);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileRef = ref(storage, `content/clients/${Date.now()}-${cleanName}`);
      await uploadBytes(fileRef, file, { contentType: file.type });
      const downloadUrl = await getDownloadURL(fileRef);

      if (editingClient) {
        setEditingClient({ ...editingClient, logo: downloadUrl });
      }
    } catch (err) {
      console.error(err);
      setLogoUploadError('Upload failed. Check Firebase Storage permissions.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingClient({
      id: `client-${Date.now()}`,
      name: '',
      logo: '',
      industry: 'Technology',
      description: '',
      websiteUrl: '',
      order: (clients?.length || 0) + 1,
      active: true,
    });
  };

  const handleSaveModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.name.trim()) return;

    let updatedList = [...(clients || [])];
    if (isNew) {
      updatedList.push(editingClient);
    } else {
      updatedList = updatedList.map((c) => (c.id === editingClient.id ? editingClient : c));
    }

    setClients(updatedList);
    setEditingClient(null);
    handleSaveAll(updatedList);
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    const updated = (clients || []).filter((c) => c.id !== id);
    setClients(updated);

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'clients', id));
      handleSaveAll(updated);
    } catch {
      handleSaveAll(updated);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!clients || fromIndex === toIndex) return;
    const next = [...clients];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setClients(next);
    handleSaveAll(next);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoaderCircle size={24} className="spin" />
          <span>Loading client records…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Client Management</h1>
          <p className="admin-page__sub">
            Manage authorized client logos and showcase details on the About Us page.
          </p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenAdd}>
            <Plus size={16} /> Add New Client
          </button>
        </div>
      </header>

      {error && (
        <div className="admin-notice admin-notice--error" role="alert">
          <CircleAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="admin-notice admin-notice--success" role="status">
          <CircleCheck size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="card admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 80, textAlign: 'center' }}>Position</th>
                <th style={{ width: 90 }}>Logo</th>
                <th>Company Name</th>
                <th>Industry</th>
                <th>Website URL</th>
                <th style={{ width: 100 }}>Status</th>
                <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients && clients.length > 0 ? (
                clients.map((c, idx) => (
                  <tr
                    key={c.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      setDragIndex(idx);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (dropTarget !== idx) setDropTarget(idx);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setDropTarget(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null && dragIndex !== idx) {
                        handleReorder(dragIndex, idx);
                      }
                      setDragIndex(null);
                      setDropTarget(null);
                    }}
                    className={`admin-draggable-row${dragIndex === idx ? ' is-dragging' : ''}${dropTarget === idx ? ' is-drop-target' : ''}`}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <div className="admin-drag-handle" title="Drag and drop to change position">
                        <GripVertical size={16} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{idx + 1}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-client-logo-preview">
                        {c.logo ? (
                          <img src={c.logo} alt="" />
                        ) : (
                          <Building2 size={20} className="muted" />
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{c.name}</strong>
                      {c.description && <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>{c.description}</p>}
                    </td>
                    <td>{c.industry}</td>
                    <td>
                      {c.websiteUrl ? (
                        <a href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="admin-link">
                          Visit <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${c.active ? 'badge--primary' : 'badge--neutral'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        style={{ marginRight: 6 }}
                        onClick={() => {
                          setIsNew(false);
                          setEditingClient(c);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm btn--danger"
                        onClick={() => handleDeleteClient(c.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="admin-table-empty">
                    No clients added yet. Click &quot;Add New Client&quot; to showcase your partners.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / ADD CLIENT MODAL */}
      {editingClient && (
        <div className="admin-modal-backdrop" onClick={() => setEditingClient(null)}>
          <div className="admin-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <h2>{isNew ? 'Add Client' : 'Edit Client Details'}</h2>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setEditingClient(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="admin-modal__form">
              <div className="admin-field">
                <label>Company Name *</label>
                <input
                  type="text"
                  required
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  placeholder="e.g. Sportif Padel"
                />
              </div>

              <div className="admin-field">
                <label>Industry / Business Category *</label>
                <input
                  type="text"
                  required
                  value={editingClient.industry}
                  onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                  placeholder="e.g. E-Commerce & Retail"
                />
              </div>

              <div className="admin-field">
                <label>Website URL (optional)</label>
                <input
                  type="url"
                  value={editingClient.websiteUrl || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, websiteUrl: e.target.value })}
                  placeholder="https://company.com"
                />
              </div>

              <div className="admin-field">
                <label>Short Description (optional)</label>
                <textarea
                  rows={2}
                  value={editingClient.description || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, description: e.target.value })}
                  placeholder="Brief note about the client or project..."
                />
              </div>

              <div className="admin-field">
                <label>Company Logo</label>
                <div className="admin-logo-upload-wrap">
                  {editingClient.logo ? (
                    <div className="admin-logo-current">
                      <img src={editingClient.logo} alt="Logo preview" />
                      <button
                        type="button"
                        className="btn btn--outline btn--sm btn--danger"
                        onClick={() => setEditingClient({ ...editingClient, logo: '' })}
                      >
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div className="admin-logo-upload-box">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        id="client-logo-input"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file);
                        }}
                      />
                      <label htmlFor="client-logo-input" className="btn btn--outline btn--sm">
                        {uploadingLogo ? (
                          <>
                            <LoaderCircle size={15} className="spin" /> Uploading…
                          </>
                        ) : (
                          <>
                            <Upload size={15} /> Upload Logo File
                          </>
                        )}
                      </label>
                      <span className="muted" style={{ fontSize: '0.8rem', marginLeft: 10 }}>
                        PNG, SVG, or WebP (max 5MB)
                      </span>
                    </div>
                  )}
                  {logoUploadError && <span className="field__error">{logoUploadError}</span>}
                </div>
              </div>

              <div className="admin-field admin-field--checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={editingClient.active}
                    onChange={(e) => setEditingClient({ ...editingClient, active: e.target.checked })}
                  />
                  <span>Active (Displayed publicly on the About Us page)</span>
                </label>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setEditingClient(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving || uploadingLogo}>
                  {saving ? 'Saving…' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

