import { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  RefreshCw,
  History,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { pageDefs, pageTextsFromDoc, type PageDef } from '../content/pages';
import { logAdminActivity } from './activityLogger';

const firestore = () => import('firebase/firestore/lite');

interface RevisionSnapshot {
  id: string;
  timestamp: string;
  summary: string;
  values: Record<string, string>;
  hiddenSections: Record<string, boolean>;
  sectionOrder: number[];
}

export function VisualPageBuilder() {
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [hiddenSections, setHiddenSections] = useState<Record<string, boolean>>({});
  const [sectionOrder, setSectionOrder] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRevisions, setShowRevisions] = useState(false);
  const [revisions, setRevisions] = useState<RevisionSnapshot[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentPageDef: PageDef = pageDefs.find((p) => p.id === selectedPageId) || pageDefs[0];

  // Load page data & revisions
  useEffect(() => {
    let active = true;
    setError('');
    setSuccess('');

    const fields = currentPageDef.sections.flatMap((s) => s.fields);
    const defaults = Object.fromEntries(fields.map((f) => [f.key, f.default]));
    setSectionOrder(currentPageDef.sections.map((_, i) => i));

    (async () => {
      try {
        const [db, { doc, getDoc, collection, getDocs, limit, query, orderBy }] = await Promise.all([
          getAdminDb(),
          firestore(),
        ]);
        const snap = await getDoc(doc(db, 'pages', currentPageDef.id));
        if (!active) return;
        if (snap.exists()) {
          const docData = snap.data();
          setValues({ ...defaults, ...pageTextsFromDoc(currentPageDef.id, docData) });
          if (docData._hiddenSections && typeof docData._hiddenSections === 'object') {
            setHiddenSections(docData._hiddenSections as Record<string, boolean>);
          } else {
            setHiddenSections({});
          }
          if (Array.isArray(docData._sectionOrder)) {
            setSectionOrder(docData._sectionOrder);
          }
          setIsDraft(Boolean(docData._isDraft));
        } else {
          setValues(defaults);
          setHiddenSections({});
          setIsDraft(false);
        }

        // Fetch revisions
        try {
          const revSnap = await getDocs(
            query(collection(db, 'pages', currentPageDef.id, 'revisions'), orderBy('createdAt', 'desc'), limit(10))
          );
          if (active && !revSnap.empty) {
            const revList: RevisionSnapshot[] = revSnap.docs.map((d) => {
              const r = d.data();
              return {
                id: d.id,
                timestamp: r.timestampStr || 'Previous Version',
                summary: r.summary || 'Saved revision',
                values: r.values || {},
                hiddenSections: r.hiddenSections || {},
                sectionOrder: r.sectionOrder || [],
              };
            });
            setRevisions(revList);
          } else if (active) {
            // Seed a clean initial snapshot if empty
            setRevisions([
              {
                id: 'initial',
                timestamp: 'Default Design System',
                summary: 'Baseline production design and layout',
                values: defaults,
                hiddenSections: {},
                sectionOrder: currentPageDef.sections.map((_, i) => i),
              },
            ]);
          }
        } catch {
          // Fallback if revisions subcollection is empty
          if (active) {
            setRevisions([
              {
                id: 'initial',
                timestamp: 'Default Design System',
                summary: 'Baseline production design and layout',
                values: defaults,
                hiddenSections: {},
                sectionOrder: currentPageDef.sections.map((_, i) => i),
              },
            ]);
          }
        }
      } catch (err) {
        console.warn('Could not load page text from Firestore, using defaults:', err);
        if (active) setValues(defaults);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedPageId]);

  const updateField = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const toggleSectionVisibility = (secTitle: string) => {
    setHiddenSections((prev) => ({
      ...prev,
      [secTitle]: !prev[secTitle],
    }));
  };

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= sectionOrder.length) return;
    const copy = [...sectionOrder];
    const temp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = temp;
    setSectionOrder(copy);
  };

  const handleSave = async (asDraft = false) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const [db, { doc, setDoc, serverTimestamp, collection, addDoc }] = await Promise.all([
        getAdminDb(),
        firestore(),
      ]);

      const payload = {
        ...values,
        _hiddenSections: hiddenSections,
        _sectionOrder: sectionOrder,
        _isDraft: asDraft,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'pages', currentPageDef.id), payload, { merge: true });

      // If publishing, create a revision snapshot in history
      if (!asDraft) {
        const revData = {
          timestampStr: new Date().toLocaleString(),
          summary: `Published updates for ${currentPageDef.title}`,
          values,
          hiddenSections,
          sectionOrder,
          createdAt: serverTimestamp(),
        };
        try {
          const revRef = await addDoc(collection(db, 'pages', currentPageDef.id, 'revisions'), revData);
          setRevisions((prev) => [
            {
              id: revRef.id,
              timestamp: 'Just now',
              summary: revData.summary,
              values,
              hiddenSections,
              sectionOrder,
            },
            ...prev,
          ]);
        } catch (revErr) {
          console.warn('Could not save revision snapshot:', revErr);
        }
      }

      setIsDraft(asDraft);
      const actionName = asDraft ? `Saved Draft: ${currentPageDef.title}` : `Published: ${currentPageDef.title}`;
      await logAdminActivity(actionName, 'pages', `Updated ${currentPageDef.title} via Visual Page Builder.`);

      setSuccess(
        asDraft
          ? `Draft for "${currentPageDef.title}" saved successfully!`
          : `Page "${currentPageDef.title}" published live to production!`
      );

      // Reload live iframe to reflect changes
      if (iframeRef.current) {
        iframeRef.current.src = currentPageDef.path + '?v=' + Date.now();
      }

      setTimeout(() => setSuccess(''), 4500);
    } catch (err) {
      console.error(err);
      setError('Failed to save changes to database.');
    } finally {
      setSaving(false);
    }
  };

  const restoreRevision = (rev: RevisionSnapshot) => {
    setValues(rev.values);
    setHiddenSections(rev.hiddenSections);
    if (rev.sectionOrder && rev.sectionOrder.length > 0) {
      setSectionOrder(rev.sectionOrder);
    }
    setShowRevisions(false);
    setSuccess(`Restored version from ${rev.timestamp}! Review and click "Publish" to apply.`);
  };

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = currentPageDef.path + '?t=' + Date.now();
    }
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 380;
      case 'tablet':
        return 768;
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <div className="admin-page" style={{ padding: 0, maxWidth: '100%', gap: 0 }}>
      {/* Visual Builder Top Control Bar */}
      <div
        style={{
          background: '#0b1736',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: '#38bdf8' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
              Visual Page Builder
            </span>
          </div>

          {/* Page Switcher */}
          <select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            style={{
              background: '#102448',
              color: '#fff',
              border: '1px solid #1e3a8a',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {pageDefs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.path})
              </option>
            ))}
          </select>

          {/* Status Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 999,
              background: isDraft ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isDraft ? '#fbbf24' : '#34d399',
              border: isDraft ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            {isDraft ? (
              <>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24' }} />
                Draft Mode
              </>
            ) : (
              <>
                <CheckCircle2 size={12} />
                Published Live
              </>
            )}
          </span>
        </div>

        {/* Viewport Toggles (Desktop, Tablet, Mobile) */}
        <div style={{ display: 'flex', background: '#102448', padding: 3, borderRadius: 8, gap: 2, border: '1px solid #1e3a8a' }}>
          <button
            type="button"
            className="btn btn--plain btn--sm"
            style={{
              color: viewport === 'desktop' ? '#fff' : '#94a3b8',
              background: viewport === 'desktop' ? '#2563eb' : 'transparent',
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.8rem',
            }}
            onClick={() => setViewport('desktop')}
            title="Desktop Mode (100% Full Width)"
          >
            <Monitor size={15} style={{ marginRight: 5 }} /> Desktop
          </button>
          <button
            type="button"
            className="btn btn--plain btn--sm"
            style={{
              color: viewport === 'tablet' ? '#fff' : '#94a3b8',
              background: viewport === 'tablet' ? '#2563eb' : 'transparent',
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.8rem',
            }}
            onClick={() => setViewport('tablet')}
            title="Tablet Mode (768px Width)"
          >
            <Tablet size={15} style={{ marginRight: 5 }} /> Tablet
          </button>
          <button
            type="button"
            className="btn btn--plain btn--sm"
            style={{
              color: viewport === 'mobile' ? '#fff' : '#94a3b8',
              background: viewport === 'mobile' ? '#2563eb' : 'transparent',
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.8rem',
            }}
            onClick={() => setViewport('mobile')}
            title="Mobile Mode (380px Width)"
          >
            <Smartphone size={15} style={{ marginRight: 5 }} /> Mobile
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={refreshPreview}
            className="btn btn--outline btn--sm"
            style={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', padding: '5px 9px' }}
            title="Reload Preview Frame"
          >
            <RefreshCw size={14} />
          </button>

          <button
            type="button"
            onClick={() => setShowRevisions(!showRevisions)}
            className="btn btn--outline btn--sm"
            style={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}
          >
            <History size={14} style={{ marginRight: 4 }} /> Revisions ({revisions.length})
          </button>

          <a
            href={currentPageDef.path}
            target="_blank"
            rel="noreferrer"
            className="btn btn--outline btn--sm"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}
          >
            <ExternalLink size={14} style={{ marginRight: 4 }} /> Open Live
          </a>

          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => handleSave(true)}
            disabled={saving}
            style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)', fontSize: '0.8rem' }}
          >
            Save Draft
          </button>

          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => handleSave(false)}
            disabled={saving}
            style={{ fontSize: '0.8rem', background: '#2563eb', borderColor: '#2563eb' }}
          >
            {saving ? (
              <>
                <LoaderCircle size={14} className="spin" style={{ marginRight: 4 }} /> Publishing...
              </>
            ) : (
              <>
                <Save size={14} style={{ marginRight: 4 }} /> Publish Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(239, 68, 68, 0.15)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="alert alert--error" style={{ margin: 0, padding: '6px 12px' }}>
            <CircleAlert size={16} aria-hidden="true" />
            <span>{error}</span>
          </p>
        </div>
      )}

      {success && (
        <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(16, 185, 129, 0.15)', borderBottom: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <p className="alert alert--success" style={{ margin: 0, padding: '6px 12px' }}>
            <CircleCheck size={16} aria-hidden="true" />
            <span>{success}</span>
          </p>
        </div>
      )}

      {/* Revisions Dropdown Modal */}
      {showRevisions && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 40,
            zIndex: 100,
            width: 360,
            background: '#1e293b',
            color: '#fff',
            borderRadius: 8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            border: '1px solid #334155',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <strong style={{ fontSize: '0.9rem' }}>Version History / Snapshots</strong>
            <button
              type="button"
              className="btn btn--plain btn--sm"
              style={{ color: '#94a3b8' }}
              onClick={() => setShowRevisions(false)}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem', maxHeight: 300, overflowY: 'auto' }}>
            {revisions.map((rev) => (
              <div
                key={rev.id}
                style={{
                  padding: '0.65rem',
                  borderRadius: 6,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: '#e2e8f0' }}>{rev.timestamp}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{rev.summary}</span>
                </div>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  style={{ fontSize: '0.72rem', padding: '3px 8px', color: '#38bdf8', borderColor: '#38bdf8' }}
                  onClick={() => restoreRevision(rev)}
                >
                  <RotateCcw size={12} style={{ marginRight: 3 }} /> Revert
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Builder Split Layout: Left Editing Inspector, Right Live Viewport */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          height: 'calc(100vh - 110px)',
          background: '#0f172a',
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Section Controls & Live Inspector */}
        <div
          style={{
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
              Sections ({currentPageDef.sections.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Reorder or click to edit text
            </span>
          </div>

          {/* Section Accordions */}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {sectionOrder.map((secIdx, listIdx) => {
              const sec = currentPageDef.sections[secIdx];
              if (!sec) return null;
              const isSelected = activeSectionIdx === secIdx;
              const isHidden = hiddenSections[sec.title];

              return (
                <div
                  key={secIdx}
                  style={{
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: isHidden ? '#f1f5f9' : '#fff',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Section Title Bar */}
                  <div
                    style={{
                      padding: '0.65rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected ? '#eff6ff' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveSectionIdx(secIdx)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          background: '#e2e8f0',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {listIdx + 1}
                      </span>
                      <strong
                        style={{
                          fontSize: '0.85rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: isHidden ? '#94a3b8' : '#0f172a',
                        }}
                      >
                        {sec.title}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Move buttons */}
                      <button
                        type="button"
                        className="btn btn--plain btn--sm"
                        style={{ padding: 3 }}
                        disabled={listIdx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(listIdx, 'up');
                        }}
                        title="Move Section Up"
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn--plain btn--sm"
                        style={{ padding: 3 }}
                        disabled={listIdx === sectionOrder.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(listIdx, 'down');
                        }}
                        title="Move Section Down"
                      >
                        <ChevronDown size={15} />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        type="button"
                        className="btn btn--plain btn--sm"
                        style={{ padding: 3 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionVisibility(sec.title);
                        }}
                        title={isHidden ? 'Show section' : 'Hide section'}
                      >
                        {isHidden ? <EyeOff size={15} style={{ color: '#94a3b8' }} /> : <Eye size={15} className="text-primary" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section Fields */}
                  {isSelected && (
                    <div
                      style={{
                        padding: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        background: '#fafafa',
                        display: 'grid',
                        gap: '0.85rem',
                      }}
                    >
                      {sec.fields.map((f) => (
                        <div key={f.key}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: '#334155',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {f.label}:
                          </label>
                          {f.long ? (
                            <textarea
                              rows={3}
                              value={values[f.key] ?? f.default}
                              onChange={(e) => updateField(f.key, e.target.value)}
                              className="input"
                              style={{ fontSize: '0.85rem', background: '#fff' }}
                            />
                          ) : (
                            <input
                              type="text"
                              value={values[f.key] ?? f.default}
                              onChange={(e) => updateField(f.key, e.target.value)}
                              className="input"
                              style={{ fontSize: '0.85rem', background: '#fff', height: 34 }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Tip */}
          <div
            style={{
              marginTop: 'auto',
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              fontSize: '0.75rem',
              color: '#64748b',
            }}
          >
            💡 <strong>Pro Tip:</strong> Wrap words in <code>*asterisks*</code> in headlines to highlight them in the brand accent gradient color!
          </div>
        </div>

        {/* Right Side: Live Viewport Canvas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#070e20',
            overflow: 'auto',
            padding: viewport === 'desktop' ? 0 : '1.5rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: getViewportWidth(),
              height: viewport === 'desktop' ? '100%' : '90vh',
              background: '#ffffff',
              borderRadius: viewport === 'desktop' ? 0 : 16,
              overflow: 'hidden',
              boxShadow: viewport === 'desktop' ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
              border: viewport === 'desktop' ? 'none' : '10px solid #102448',
              transition: 'width 0.25s ease',
              position: 'relative',
            }}
          >
            {/* Live iframe connected to actual route */}
            <iframe
              ref={iframeRef}
              src={currentPageDef.path}
              title={`Live Preview of ${currentPageDef.title}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
