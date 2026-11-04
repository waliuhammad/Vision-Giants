import { useState, useEffect, type FormEvent } from 'react';
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
  Layers,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { pageDefs, pageTextsFromDoc, type PageDef } from '../content/pages';

const firestore = () => import('firebase/firestore/lite');

export function VisualPageBuilder() {
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [hiddenSections, setHiddenSections] = useState<Record<string, boolean>>({});
  const [sectionOrder, setSectionOrder] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentPageDef: PageDef = pageDefs.find((p) => p.id === selectedPageId) || pageDefs[0];

  // Load page data
  useEffect(() => {
    let active = true;
    setError('');

    const fields = currentPageDef.sections.flatMap((s) => s.fields);
    const defaults = Object.fromEntries(fields.map((f) => [f.key, f.default]));
    setSectionOrder(currentPageDef.sections.map((_, i) => i));

    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
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
        } else {
          setValues(defaults);
          setHiddenSections({});
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

  const handleSave = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const payload = {
        ...values,
        _hiddenSections: hiddenSections,
        _sectionOrder: sectionOrder,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'pages', currentPageDef.id), payload, { merge: true });
      setSuccess(`Page "${currentPageDef.title}" successfully published!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to publish changes to database.');
    } finally {
      setSaving(false);
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
    <div className="admin-page" style={{ padding: 0, maxWidth: '100%' }}>
      {/* Visual Builder Top Control Bar */}
      <div
        style={{
          background: '#0b1730',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} className="text-primary" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Visual Page Builder</span>
          </div>

          {/* Page Switcher */}
          <select
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            style={{
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {pageDefs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.path})
              </option>
            ))}
          </select>
        </div>

        {/* Viewport Toggles (Desktop, Tablet, Mobile) */}
        <div style={{ display: 'flex', background: '#1e293b', padding: 3, borderRadius: 6, gap: 2 }}>
          <button
            type="button"
            className="btn btn--plain btn--sm"
            style={{
              color: viewport === 'desktop' ? '#fff' : '#94a3b8',
              background: viewport === 'desktop' ? '#2563eb' : 'transparent',
              padding: '4px 8px',
            }}
            onClick={() => setViewport('desktop')}
            title="Desktop Mode (100%)"
          >
            <Monitor size={16} style={{ marginRight: 4 }} /> Desktop
          </button>
          <button
            type="button"
            className="btn btn--plain btn--sm"
            style={{
              color: viewport === 'tablet' ? '#fff' : '#94a3b8',
              background: viewport === 'tablet' ? '#2563eb' : 'transparent',
              padding: '4px 8px',
            }}
            onClick={() => setViewport('tablet')}
            title="Tablet Mode (768px)"
          >
            <Tablet size={16} style={{ marginRight: 4 }} /> Tablet
          </button>
          <button
            type="button"
            className="btn btn--plain btn--sm"
            style={{
              color: viewport === 'mobile' ? '#fff' : '#94a3b8',
              background: viewport === 'mobile' ? '#2563eb' : 'transparent',
              padding: '4px 8px',
            }}
            onClick={() => setViewport('mobile')}
            title="Mobile Mode (380px)"
          >
            <Smartphone size={16} style={{ marginRight: 4 }} /> Mobile
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href={currentPageDef.path}
            target="_blank"
            rel="noreferrer"
            className="btn btn--outline btn--sm"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <ExternalLink size={14} style={{ marginRight: 4 }} /> Open Live Tab
          </a>

          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => handleSave()}
            disabled={saving}
          >
            {saving ? (
              <>
                <LoaderCircle size={14} className="spin" style={{ marginRight: 4 }} /> Saving...
              </>
            ) : (
              <>
                <Save size={14} style={{ marginRight: 4 }} /> Save & Publish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div style={{ margin: '0.75rem 1.5rem 0' }}>
          <p className="alert alert--error">
            <CircleAlert size={18} aria-hidden="true" />
            <span>{error}</span>
          </p>
        </div>
      )}

      {success && (
        <div style={{ margin: '0.75rem 1.5rem 0' }}>
          <p className="alert alert--success">
            <CircleCheck size={18} aria-hidden="true" />
            <span>{success}</span>
          </p>
        </div>
      )}

      {/* Builder Split Layout: Left Editing Inspector, Right Live Viewport */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          height: 'calc(100vh - 120px)',
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
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
              Sections ({currentPageDef.sections.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              Select a section to edit
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
                      padding: '0.6rem 0.75rem',
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
                          padding: '2px 5px',
                          borderRadius: 3,
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
                        style={{ padding: 2 }}
                        disabled={listIdx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(listIdx, 'up');
                        }}
                        title="Move Section Up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn--plain btn--sm"
                        style={{ padding: 2 }}
                        disabled={listIdx === sectionOrder.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(listIdx, 'down');
                        }}
                        title="Move Section Down"
                      >
                        <ChevronDown size={14} />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        type="button"
                        className="btn btn--plain btn--sm"
                        style={{ padding: 2 }}
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
            💡 <strong>Pro Tip:</strong> Wrap words in <code>*asterisks*</code> inside main headings to highlight them in the brand accent gradient color!
          </div>
        </div>

        {/* Right Side: Live Viewport Canvas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0b1329',
            overflow: 'auto',
            padding: viewport === 'desktop' ? 0 : '1.5rem',
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
              border: viewport === 'desktop' ? 'none' : '8px solid #1e293b',
              transition: 'width 0.25s ease',
              position: 'relative',
            }}
          >
            {/* Live iframe connected to actual route */}
            <iframe
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
