import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  FileText,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Layout,
  Briefcase,
  BookOpen,
  UserCheck,
  Cpu,
  Mail,
  LoaderCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { pageDefs, pageTextsFromDoc, type PageDef } from '../content/pages';
import { MediaPickerModal } from './MediaPickerModal';

const firestore = () => import('firebase/firestore/lite');

interface ExtendedPageInfo {
  id: string;
  title: string;
  path: string;
  icon: typeof FileText;
  description: string;
  dedicatedManagerUrl?: string;
  dedicatedManagerLabel?: string;
}

const PAGE_REGISTRY: ExtendedPageInfo[] = [
  {
    id: 'home',
    title: 'Home Page',
    path: '/',
    icon: Layout,
    description: 'Hero, Strategic Collaboration, Services Strip, Portfolio Showcase, Why Vision Giants, Technology Strip, CTA',
    dedicatedManagerUrl: '/admin/home-hero',
    dedicatedManagerLabel: 'Manage Hero & Collaboration',
  },
  {
    id: 'about',
    title: 'About Us',
    path: '/about/',
    icon: UserCheck,
    description: 'Hero, Who We Are, Mission & Vision, Core Values, Expertise, Why Choose Us, Clients, Team & CTA',
    dedicatedManagerUrl: '/admin/about-page',
    dedicatedManagerLabel: 'Dedicated Full Editor',
  },
  {
    id: 'services',
    title: 'Services',
    path: '/services/',
    icon: Layers,
    description: 'Services List, Delivery Timeline Process, FAQ Accordion, Related Projects, CTA',
    dedicatedManagerUrl: '/admin/services',
    dedicatedManagerLabel: 'Services Cards Manager',
  },
  {
    id: 'careers',
    title: 'Careers & Jobs',
    path: '/careers/',
    icon: Briefcase,
    description: 'Hero, Stats Ribbon, Career Tracks, Culture Perks, Open Job Positions, Testimonials, CTA',
    dedicatedManagerUrl: '/admin/careers',
    dedicatedManagerLabel: 'Careers & Jobs Manager',
  },
  {
    id: 'courses',
    title: 'Vision Giants Academy',
    path: '/courses/',
    icon: BookOpen,
    description: 'Hero, Stats Ribbon, Top Programs, Why Choose Us, Interactive Catalog, Student Reviews, Demo CTA',
    dedicatedManagerUrl: '/admin/courses',
    dedicatedManagerLabel: 'Courses & Catalog Manager',
  },
  {
    id: 'blog',
    title: 'Blog & Articles',
    path: '/blog/',
    icon: FileText,
    description: 'Hero, Featured Spotlight, Categories, Article Grid, Tag Cloud, Newsletter Banner',
    dedicatedManagerUrl: '/admin/blog',
    dedicatedManagerLabel: 'Articles & Post Manager',
  },
  {
    id: 'team',
    title: 'Leadership & Team',
    path: '/team/',
    icon: UserCheck,
    description: 'Hero, Interactive Arc Showcase, Team Member Profiles, Social Links, CTA',
    dedicatedManagerUrl: '/admin/team',
    dedicatedManagerLabel: 'Team Members Manager',
  },
  {
    id: 'technologies',
    title: 'Technologies & Stack',
    path: '/technologies/',
    icon: Cpu,
    description: 'Hero, Core Stack Cards, Multi-Tier Application Architecture, Supporting Libraries, CTA',
    dedicatedManagerUrl: '/admin/technologies',
    dedicatedManagerLabel: 'Tech Stack Manager',
  },
  {
    id: 'contact',
    title: 'Contact Us',
    path: '/contact/',
    icon: Mail,
    description: 'Hero, Contact Details (Phone, Email, Office Address), Social Links, Interactive Project Inquiry Form',
    dedicatedManagerUrl: '/admin/global-settings',
    dedicatedManagerLabel: 'Contact Info Settings',
  },
];

/** Admin → Page Management: Central WordPress-Style page list */
export function SitePagesList() {
  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>Page Management</h1>
        </div>
        <div className="admin-page__actions">
          <Link to="/admin/visual-builder" className="btn btn--primary">
            <Sparkles size={16} style={{ marginRight: 6 }} /> Open Visual Page Builder
          </Link>
        </div>
      </header>

      <p className="muted admin-pages__intro" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Manage all pages, sections, headings, text, and components on your website. Every page has independent section-level controls, live previews, and dedicated content editors.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {PAGE_REGISTRY.map((page) => {
          const PageIcon = page.icon;
          const def = pageDefs.find((p) => p.id === page.id);
          const textCount = def ? def.sections.reduce((n, s) => n + s.fields.length, 0) : 0;

          return (
            <div
              key={page.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                gap: '1rem',
                flexWrap: 'wrap',
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 260, flex: 1 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PageIcon size={22} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{page.title}</strong>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        background: '#dcfce7',
                        color: '#15803d',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 12,
                      }}
                    >
                      Published
                    </span>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                    <code>{page.path}</code> · {page.description}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {page.dedicatedManagerUrl && (
                  <Link to={page.dedicatedManagerUrl} className="btn btn--outline btn--sm">
                    {page.dedicatedManagerLabel}
                  </Link>
                )}

                {def && (
                  <Link to={`/admin/pages/${page.id}`} className="btn btn--primary btn--sm">
                    <FileText size={14} style={{ marginRight: 4 }} /> Edit Sections ({textCount})
                  </Link>
                )}

                <a
                  href={page.path}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--plain btn--sm"
                  title="View Public Page"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Admin → Page Management → One Page: Section-level editor */
export function SitePageEditor() {
  const { id } = useParams<{ id: string }>();
  const def = pageDefs.find((p) => p.id === id);

  if (!def) {
    return (
      <div className="admin-page">
        <p className="alert alert--error">
          <CircleAlert size={18} aria-hidden="true" />
          <span>That page does not exist in the CMS directory.</span>
        </p>
        <Link to="/admin/pages" className="btn btn--outline btn--sm">
          <ArrowLeft size={15} aria-hidden="true" /> All pages
        </Link>
      </div>
    );
  }

  return <Editor key={def.id} def={def} />;
}

function Editor({ def }: { def: PageDef }) {
  const fields = def.sections.flatMap((s) => s.fields);
  const defaults = Object.fromEntries(fields.map((f) => [f.key, f.default]));
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [hiddenSections, setHiddenSections] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(def.sections.map((s) => [s.title, true]))
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [mediaPickerKey, setMediaPickerKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', def.id));
        if (snap.exists()) {
          const docData = snap.data();
          setValues({ ...defaults, ...pageTextsFromDoc(def.id, docData) });
          if (docData._hiddenSections && typeof docData._hiddenSections === 'object') {
            setHiddenSections(docData._hiddenSections as Record<string, boolean>);
          }
        } else {
          setValues({ ...defaults });
        }
      } catch (err) {
        console.error(err);
        setError('Could not load the saved text. Showing default text.');
        setValues({ ...defaults });
      }
    })();
  }, [def.id]);

  const set = (key: string, value: string) => {
    setValues((v) => (v ? { ...v, [key]: value } : v));
    setNotice('');
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleVisibility = (title: string) => {
    setHiddenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!values) return;
    setBusy(true);
    setError('');

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const payload = {
        ...values,
        _hiddenSections: hiddenSections,
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'pages', def.id), payload, { merge: true });
      setNotice('Saved successfully! Reload the website page to see live updates.');
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to save to database. Check permissions.');
    } finally {
      setBusy(false);
    }
  };

  const resetSection = (secTitle: string) => {
    const sec = def.sections.find((s) => s.title === secTitle);
    if (!sec) return;
    setValues((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      sec.fields.forEach((f) => {
        copy[f.key] = f.default;
      });
      return copy;
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/admin/pages">Site pages</Link>
              </li>
              <li aria-current="page">{def.title}</li>
            </ol>
          </nav>
          <h1>{def.title} Page Editor</h1>
        </div>
        <div className="admin-page__actions">
          <a href={def.path} target="_blank" rel="noreferrer" className="btn btn--outline btn--sm">
            <ExternalLink size={15} style={{ marginRight: 4 }} /> View Page
          </a>
          <button type="submit" form="page-editor-form" className="btn btn--primary" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle size={16} className="spin" style={{ marginRight: 6 }} /> Saving...
              </>
            ) : (
              <>
                <Save size={16} style={{ marginRight: 6 }} /> Save & Publish
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

      {notice && (
        <p className="alert alert--success">
          <CircleCheck size={18} aria-hidden="true" />
          <span>{notice}</span>
        </p>
      )}

      {!values ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <LoaderCircle size={28} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
          <p>Loading sections...</p>
        </div>
      ) : (
        <form id="page-editor-form" onSubmit={save} style={{ display: 'grid', gap: '1.5rem' }}>
          {def.sections.map((section, idx) => {
            const isExpanded = expandedSections[section.title] !== false;
            const isHidden = hiddenSections[section.title];

            return (
              <div
                key={section.title}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: 10,
                  border: isHidden ? '1px dashed #cbd5e1' : '1px solid var(--color-border)',
                  background: isHidden ? '#f8fafc' : '#fff',
                }}
              >
                {/* Section Title Header */}
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    background: isHidden ? '#f1f5f9' : '#f8fafc',
                    borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleSection(section.title)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        background: '#e2e8f0',
                        color: '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      Section #{idx + 1}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: isHidden ? '#94a3b8' : 'inherit' }}>
                      {section.title}
                    </strong>
                    {isHidden && (
                      <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
                        (Hidden on live site)
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(section.title);
                      }}
                      title={isHidden ? 'Show section' : 'Hide section'}
                    >
                      {isHidden ? <EyeOff size={16} /> : <Eye size={16} className="text-primary" />}
                    </button>

                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetSection(section.title);
                      }}
                      title="Reset section to original defaults"
                    >
                      <RotateCcw size={15} />
                    </button>

                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Section Fields */}
                {isExpanded && (
                  <div style={{ padding: '1.25rem', display: 'grid', gap: '1.25rem' }}>
                    {section.fields.map((f) => (
                      <div key={f.key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>{f.label}:</label>
                          {values[f.key] !== f.default && (
                            <span style={{ fontSize: '0.75rem', color: '#0284c7' }}>● Modified from default</span>
                          )}
                        </div>

                        {f.long ? (
                          <textarea
                            rows={3}
                            value={values[f.key] ?? f.default}
                            onChange={(e) => set(f.key, e.target.value)}
                            className="input"
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={values[f.key] ?? f.default}
                              onChange={(e) => set(f.key, e.target.value)}
                              className="input"
                              style={{ flex: 1 }}
                            />
                            {f.key.toLowerCase().includes('image') && (
                              <button
                                type="button"
                                className="btn btn--outline btn--sm"
                                onClick={() => setMediaPickerKey(f.key)}
                              >
                                <ImageIcon size={14} style={{ marginRight: 4 }} /> Browse
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </form>
      )}

      {/* Media Picker Modal */}
      {mediaPickerKey && (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setMediaPickerKey(null)}
          onSelect={(url) => {
            set(mediaPickerKey, url);
            setMediaPickerKey(null);
          }}
          currentValue={values ? values[mediaPickerKey] : ''}
        />
      )}
    </div>
  );
}
