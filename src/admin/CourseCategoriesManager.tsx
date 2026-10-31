import { useEffect, useState, type FormEvent } from 'react';
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Plus,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultCourseCategories, type CourseCategory } from '../data/courses';

const firestore = () => import('firebase/firestore/lite');

export function CourseCategoriesManager() {
  const [categories, setCategories] = useState<CourseCategory[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs, query, orderBy }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDocs(query(collection(db, 'course_categories'), orderBy('order', 'asc')));

      if (snap.empty) {
        setCategories(defaultCourseCategories);
      } else {
        const list: CourseCategory[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || ''),
            slug: String(data.slug || d.id),
            description: String(data.description || ''),
            icon: String(data.icon || ''),
            imageUrl: String(data.imageUrl || ''),
            order: typeof data.order === 'number' ? data.order : 0,
            active: data.active !== false,
          };
        });
        setCategories(list);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load categories from database. Using local defaults.');
      setCategories(defaultCourseCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (listToSave: CourseCategory[]) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const [db, { doc, writeBatch, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const batch = writeBatch(db);

      listToSave.forEach((c, idx) => {
        const ref = doc(db, 'course_categories', c.id);
        batch.set(
          ref,
          {
            name: c.name.trim(),
            slug: c.slug.trim(),
            description: c.description || '',
            order: idx + 1,
            active: c.active !== false,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      setCategories(listToSave);
      setSuccess('Course categories saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save categories. Check admin permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      order: (categories?.length || 0) + 1,
      active: true,
    });
  };

  const handleSaveModal = (e: FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    const slug = editingCategory.slug.trim() || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const completed = { ...editingCategory, slug };

    let updatedList = [...(categories || [])];
    if (isNew) {
      updatedList.push(completed);
    } else {
      updatedList = updatedList.map((c) => (c.id === completed.id ? completed : c));
    }

    setCategories(updatedList);
    setEditingCategory(null);
    handleSaveAll(updatedList);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this course category?')) return;
    const updated = (categories || []).filter((c) => c.id !== id);
    setCategories(updated);

    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'course_categories', id));
      handleSaveAll(updated);
    } catch {
      handleSaveAll(updated);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!categories) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setCategories(next);
    handleSaveAll(next);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoaderCircle size={24} className="spin" />
          <span>Loading categories…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Course Categories</h1>
          <p className="admin-page__sub">Manage academy topic categories and discipline filters.</p>
        </div>
        <div className="admin-page__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Category
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
                <th style={{ width: 80 }}>Order</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th style={{ width: 100 }}>Status</th>
                <th style={{ width: 140, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.length > 0 ? (
                categories.map((c, idx) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-order-btns">
                        <button
                          type="button"
                          className="btn-icon"
                          disabled={idx === 0}
                          onClick={() => moveItem(idx, 'up')}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <span>{idx + 1}</span>
                        <button
                          type="button"
                          className="btn-icon"
                          disabled={idx === categories.length - 1}
                          onClick={() => moveItem(idx, 'down')}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>
                      <code>{c.slug}</code>
                    </td>
                    <td>{c.description || <span className="muted">—</span>}</td>
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
                          setEditingCategory(c);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm btn--danger"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="admin-table-empty">
                    No categories created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingCategory && (
        <div className="admin-modal-backdrop" onClick={() => setEditingCategory(null)}>
          <div className="admin-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <h2>{isNew ? 'Add Course Category' : `Edit: ${editingCategory.name}`}</h2>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setEditingCategory(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="admin-modal__form">
              <div className="admin-field">
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>

              <div className="admin-field">
                <label>Slug (URL identifier)</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. artificial-intelligence"
                />
              </div>

              <div className="admin-field">
                <label>Short Description (optional)</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Brief summary of topics in this category..."
                />
              </div>

              <div className="admin-field admin-field--checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={editingCategory.active}
                    onChange={(e) => setEditingCategory({ ...editingCategory, active: e.target.checked })}
                  />
                  <span>Active (Visible in course filters and categories)</span>
                </label>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

