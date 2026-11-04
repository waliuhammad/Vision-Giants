import { useEffect, useState, type FormEvent } from 'react';
import {
  CircleAlert,
  CircleCheck,
  ExternalLink,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import type { BlogCategory } from '../data/blog';

const firestore = () => import('firebase/firestore/lite');

// ─── Types ────────────────────────────────────────────────────────────────────

type PostCategory = Exclude<BlogCategory, 'All Articles'>;

const CATEGORIES: PostCategory[] = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'AI & Technology',
  'Programming Tutorials',
  'Business & Digital Growth',
];

interface SectionForm {
  heading: string;
  body: string;
  quote: string;
  codeLanguage: string;
  codeSnippet: string;
}

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  category: PostCategory;
  date: string;
  readTime: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  tags: string;          // comma-separated
  contentLead: string;
  takeaways: string;     // newline-separated
  sections: SectionForm[];
}

interface PostRecord {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  date: string;
  authorName: string;
  featured: boolean;
  published: boolean;
  order: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptySection = (): SectionForm => ({
  heading: '',
  body: '',
  quote: '',
  codeLanguage: '',
  codeSnippet: '',
});

const emptyForm = (): PostForm => ({
  title: '',
  slug: '',
  excerpt: '',
  category: 'Web Development',
  date: '',
  readTime: '',
  imageUrl: '',
  featured: false,
  published: true,
  order: 0,
  authorName: '',
  authorRole: '',
  authorAvatar: '',
  tags: '',
  contentLead: '',
  takeaways: '',
  sections: [emptySection()],
});

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToForm(id: string, data: Record<string, any>): PostForm & { _id: string } {
  const author = data.author ?? {};
  const content = data.content ?? {};
  const sections: SectionForm[] = Array.isArray(content.sections)
    ? content.sections.map((s: Record<string, unknown>) => ({
        heading: String(s.heading ?? ''),
        body: String(s.body ?? ''),
        quote: String(s.quote ?? ''),
        codeLanguage: s.codeSnippet ? String((s.codeSnippet as Record<string, unknown>).language ?? '') : '',
        codeSnippet: s.codeSnippet ? String((s.codeSnippet as Record<string, unknown>).code ?? '') : '',
      }))
    : [emptySection()];

  return {
    _id: id,
    title: String(data.title ?? ''),
    slug: String(data.slug ?? ''),
    excerpt: String(data.excerpt ?? ''),
    category: (data.category as PostCategory) ?? 'Web Development',
    date: String(data.date ?? ''),
    readTime: String(data.readTime ?? ''),
    imageUrl: String(data.imageUrl ?? ''),
    featured: Boolean(data.featured),
    published: data.published !== false,
    order: Number(data.order ?? 0),
    authorName: String(author.name ?? ''),
    authorRole: String(author.role ?? ''),
    authorAvatar: String(author.avatar ?? ''),
    tags: Array.isArray(data.tags) ? (data.tags as string[]).join(', ') : '',
    contentLead: String(content.lead ?? ''),
    takeaways: Array.isArray(content.takeaways) ? (content.takeaways as string[]).join('\n') : '',
    sections,
  };
}

function formToDoc(form: PostForm): Record<string, unknown> {
  return {
    slug: form.slug || toSlug(form.title),
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    category: form.category,
    date: form.date.trim(),
    readTime: form.readTime.trim(),
    imageUrl: form.imageUrl.trim(),
    featured: form.featured,
    published: form.published,
    order: Number(form.order) || 0,
    author: {
      name: form.authorName.trim(),
      role: form.authorRole.trim(),
      ...(form.authorAvatar.trim() ? { avatar: form.authorAvatar.trim() } : {}),
    },
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    content: {
      lead: form.contentLead.trim(),
      sections: form.sections
        .filter((s) => s.body.trim())
        .map((s) => ({
          ...(s.heading.trim() ? { heading: s.heading.trim() } : {}),
          body: s.body.trim(),
          ...(s.quote.trim() ? { quote: s.quote.trim() } : {}),
          ...(s.codeSnippet.trim()
            ? { codeSnippet: { language: s.codeLanguage.trim() || 'text', code: s.codeSnippet.trim() } }
            : {}),
        })),
      takeaways: form.takeaways
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
    },
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BlogManager() {
  const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list');
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit form state
  const [form, setForm] = useState<PostForm>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null); // null = new post
  const [slugAutoSync, setSlugAutoSync] = useState(true);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const [db, { collection, getDocs, query, orderBy }] = await Promise.all([
        getAdminDb(),
        firestore(),
      ]);
      const snap = await getDocs(query(collection(db, 'blog_posts'), orderBy('order', 'asc')));
      const list: PostRecord[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          slug: String(data.slug ?? ''),
          title: String(data.title ?? '(untitled)'),
          category: (data.category as PostCategory) ?? 'Web Development',
          date: String(data.date ?? ''),
          authorName: String(data.author?.name ?? ''),
          featured: Boolean(data.featured),
          published: data.published !== false,
          order: Number(data.order ?? 0),
        };
      });
      setPosts(list);
    } catch (err) {
      console.error(err);
      setError('Could not load blog posts from database.');
    } finally {
      setLoading(false);
    }
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const doc = formToDoc(form);
      const [db, { collection, doc: fsDoc, addDoc, setDoc }] = await Promise.all([
        getAdminDb(),
        firestore(),
      ]);

      if (editingId) {
        await setDoc(fsDoc(db, 'blog_posts', editingId), doc, { merge: true });
        setSuccess('Blog post updated successfully!');
      } else {
        const ref = await addDoc(collection(db, 'blog_posts'), doc);
        setEditingId(ref.id);
        setSuccess('Blog post created successfully!');
      }
      setTimeout(() => setSuccess(''), 4000);
      await loadPosts();
    } catch (err) {
      console.error(err);
      setError('Failed to save. Check your permissions.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    setError('');
    try {
      const [db, { doc, deleteDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await deleteDoc(doc(db, 'blog_posts', id));
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) {
        resetForm();
        setActiveTab('list');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete post.');
    } finally {
      setDeleting(null);
    }
  };

  // ── Inline toggle (featured / published) ─────────────────────────────────

  const handleToggle = async (id: string, field: 'featured' | 'published', value: boolean) => {
    try {
      const [db, { doc, updateDoc }] = await Promise.all([getAdminDb(), firestore()]);
      await updateDoc(doc(db, 'blog_posts', id), { [field]: value });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    } catch (err) {
      console.error(err);
      setError('Failed to update post.');
    }
  };

  // ── Open edit form ────────────────────────────────────────────────────────

  const openEdit = async (id: string) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'blog_posts', id));
      if (snap.exists()) {
        const { _id, ...rest } = docToForm(id, snap.data() as Record<string, unknown>);
        void _id; // only need id separately
        setForm(rest);
        setEditingId(id);
        setSlugAutoSync(false);
        setActiveTab('edit');
      }
    } catch (err) {
      console.error(err);
      setError('Could not load post for editing.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setSlugAutoSync(true);
    setError('');
    setSuccess('');
  };

  const openNew = () => {
    resetForm();
    setActiveTab('edit');
  };

  // ── Form helpers ──────────────────────────────────────────────────────────

  const setField = <K extends keyof PostForm>(key: K, value: PostForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugAutoSync ? toSlug(title) : prev.slug,
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugAutoSync(false);
    setField('slug', slug);
  };

  // Sections
  const updateSection = (index: number, patch: Partial<SectionForm>) => {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], ...patch };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setForm((prev) => ({ ...prev, sections: [...prev.sections, emptySection()] }));
  };

  const removeSection = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  if (loading && posts.length === 0) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoaderCircle size={24} className="spin" />
          <span>Loading blog posts…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* ── Page Header ── */}
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Content Management</p>
          <h1>Blog Manager</h1>
          <p className="admin-page__sub">
            Create and manage blog posts stored in Firestore. Toggle featured/published status
            directly from the list, or open a post to edit all fields.
          </p>
        </div>
        <div className="admin-actions">
          <a
            className="btn btn--outline btn--sm"
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Blog <ExternalLink size={14} />
          </a>
          <button type="button" className="btn btn--primary btn--sm" onClick={openNew}>
            <Plus size={15} /> New Post
          </button>
        </div>
      </header>

      {/* ── Alerts ── */}
      {error && (
        <p className="alert alert--error">
          <CircleAlert size={18} />
          <span>{error}</span>
        </p>
      )}
      {success && (
        <p className="alert alert--success">
          <CircleCheck size={18} />
          <span>{success}</span>
        </p>
      )}

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab${activeTab === 'list' ? ' admin-tab--active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <FileText size={15} /> Posts List
        </button>
        <button
          type="button"
          className={`admin-tab${activeTab === 'edit' ? ' admin-tab--active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          <Pencil size={15} /> {editingId ? 'Edit Post' : 'New Post'}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: Posts List
         ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'list' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {posts.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
              }}
            >
              <FileText size={32} style={{ opacity: 0.35, marginBottom: 12 }} />
              <p>No blog posts yet. Click <strong>New Post</strong> to create one.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'center' }}>Featured</th>
                    <th style={{ textAlign: 'center' }}>Published</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{post.title}</span>
                        <br />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          /{post.slug}
                        </span>
                      </td>
                      <td>
                        <span className="admin-badge">{post.category}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{post.authorName}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{post.date}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className={`btn-icon${post.featured ? ' admin-star--active' : ''}`}
                          title={post.featured ? 'Remove featured' : 'Mark featured'}
                          onClick={() => handleToggle(post.id, 'featured', !post.featured)}
                        >
                          <Star size={16} fill={post.featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <label className="admin-toggle" title={post.published ? 'Published' : 'Draft'}>
                          <input
                            type="checkbox"
                            checked={post.published}
                            onChange={(e) => handleToggle(post.id, 'published', e.target.checked)}
                          />
                          <span className="admin-toggle__track" />
                        </label>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn--outline btn--sm"
                            onClick={() => openEdit(post.id)}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn-icon admin-danger"
                            title="Delete post"
                            disabled={deleting === post.id}
                            onClick={() => handleDelete(post.id, post.title)}
                          >
                            {deleting === post.id ? (
                              <LoaderCircle size={14} className="spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: Edit / New Post
         ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSave} style={{ display: 'grid', gap: 'var(--space-6)' }}>

          {/* ── 1. Meta ── */}
          <div className="card" style={{ padding: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>1. Post Meta</h2>
              {editingId && (
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    resetForm();
                  }}
                  title="Discard and start new"
                >
                  <X size={13} /> Discard
                </button>
              )}
            </div>

            <div className="grid grid--2">
              <div className="field">
                <label>Title *</label>
                <input
                  type="text"
                  className="input"
                  value={form.title}
                  required
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Building Scalable APIs in 2026"
                />
              </div>
              <div className="field">
                <label>Slug</label>
                <input
                  type="text"
                  className="input"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="auto-generated from title"
                />
              </div>
              <div className="field">
                <label>Category</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value as PostCategory)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  value={form.tags}
                  onChange={(e) => setField('tags', e.target.value)}
                  placeholder="React, TypeScript, Performance"
                />
              </div>
              <div className="field">
                <label>Date</label>
                <input
                  type="text"
                  className="input"
                  value={form.date}
                  onChange={(e) => setField('date', e.target.value)}
                  placeholder="Oct 18, 2026"
                />
              </div>
              <div className="field">
                <label>Read Time</label>
                <input
                  type="text"
                  className="input"
                  value={form.readTime}
                  onChange={(e) => setField('readTime', e.target.value)}
                  placeholder="6 min read"
                />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Image URL</label>
                <input
                  type="text"
                  className="input"
                  value={form.imageUrl}
                  onChange={(e) => setField('imageUrl', e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="field">
                <label>Order (lower = first)</label>
                <input
                  type="number"
                  className="input"
                  value={form.order}
                  onChange={(e) => setField('order', Number(e.target.value))}
                />
              </div>
              <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setField('featured', e.target.checked)}
                  />
                  Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setField('published', e.target.checked)}
                  />
                  Published
                </label>
              </div>
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>Excerpt</label>
              <textarea
                className="input"
                rows={3}
                value={form.excerpt}
                onChange={(e) => setField('excerpt', e.target.value)}
                placeholder="Short description shown in the blog listing…"
              />
            </div>
          </div>

          {/* ── 2. Author ── */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>2. Author</h2>
            <div className="grid grid--3">
              <div className="field">
                <label>Author Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.authorName}
                  onChange={(e) => setField('authorName', e.target.value)}
                  placeholder="James Wilson"
                />
              </div>
              <div className="field">
                <label>Author Role</label>
                <input
                  type="text"
                  className="input"
                  value={form.authorRole}
                  onChange={(e) => setField('authorRole', e.target.value)}
                  placeholder="Chief Technology Officer"
                />
              </div>
              <div className="field">
                <label>Avatar URL (optional)</label>
                <input
                  type="text"
                  className="input"
                  value={form.authorAvatar}
                  onChange={(e) => setField('authorAvatar', e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          </div>

          {/* ── 3. Content ── */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>3. Content</h2>

            <div className="field">
              <label>Lead Paragraph</label>
              <textarea
                className="input"
                rows={4}
                value={form.contentLead}
                onChange={(e) => setField('contentLead', e.target.value)}
                placeholder="Opening paragraph shown at the top of the article…"
              />
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>Key Takeaways (one per line)</label>
              <textarea
                className="input"
                rows={4}
                value={form.takeaways}
                onChange={(e) => setField('takeaways', e.target.value)}
                placeholder="Edge computing reduces TTFB by 40%&#10;Island architecture limits JS payloads&#10;Serverless reduces ops overhead"
              />
            </div>
          </div>

          {/* ── 4. Sections ── */}
          <div className="card" style={{ padding: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>
                4. Article Sections ({form.sections.length})
              </h2>
              <button type="button" className="btn btn--outline btn--sm" onClick={addSection}>
                <Plus size={14} /> Add Section
              </button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {form.sections.map((section, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Section #{idx + 1}
                    </span>
                    {form.sections.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon admin-danger"
                        title="Remove section"
                        onClick={() => removeSection(idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="field">
                    <label style={{ fontSize: '0.82rem' }}>Heading (optional)</label>
                    <input
                      type="text"
                      className="input"
                      value={section.heading}
                      onChange={(e) => updateSection(idx, { heading: e.target.value })}
                      placeholder="Section heading…"
                    />
                  </div>

                  <div className="field">
                    <label style={{ fontSize: '0.82rem' }}>Body *</label>
                    <textarea
                      className="input"
                      rows={5}
                      value={section.body}
                      onChange={(e) => updateSection(idx, { body: e.target.value })}
                      placeholder="Section body text…"
                    />
                  </div>

                  <div className="field">
                    <label style={{ fontSize: '0.82rem' }}>Pull Quote (optional)</label>
                    <input
                      type="text"
                      className="input"
                      value={section.quote}
                      onChange={(e) => updateSection(idx, { quote: e.target.value })}
                      placeholder="Highlighted pull quote…"
                    />
                  </div>

                  <div className="grid grid--2">
                    <div className="field">
                      <label style={{ fontSize: '0.82rem' }}>Code Language (optional)</label>
                      <input
                        type="text"
                        className="input"
                        value={section.codeLanguage}
                        onChange={(e) => updateSection(idx, { codeLanguage: e.target.value })}
                        placeholder="typescript"
                      />
                    </div>
                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '0.82rem' }}>Code Snippet (optional)</label>
                      <textarea
                        className="input"
                        rows={4}
                        value={section.codeSnippet}
                        onChange={(e) => updateSection(idx, { codeSnippet: e.target.value })}
                        placeholder="const greeting = 'Hello, world!';"
                        style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={addSection}
              style={{ marginTop: 12 }}
            >
              <Plus size={14} /> Add Another Section
            </button>
          </div>

          {/* ── Save Bar ── */}
          <div
            className="card"
            style={{
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              {editingId ? `Editing post · ID: ${editingId}` : 'Creating a new post'}
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => setActiveTab('list')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary btn--sm"
                disabled={saving}
              >
                {saving ? <LoaderCircle size={15} className="spin" /> : <Save size={15} />}
                <span>{saving ? 'Saving…' : editingId ? 'Update Post' : 'Create Post'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
