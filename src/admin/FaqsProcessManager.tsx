import { useState, useEffect, type FormEvent } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  CircleCheck,
  CircleAlert,
  LoaderCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { defaultFaqItems, defaultProcessStepItems } from '../content/cmsDefaults';
import type { FaqItem, ProcessStepItem } from '../content/cmsTypes';

const firestore = () => import('firebase/firestore/lite');

export function FaqsProcessManager() {
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqItems);
  const [steps, setSteps] = useState<ProcessStepItem[]>(defaultProcessStepItems);
  const [tab, setTab] = useState<'faqs' | 'process'>('faqs');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing modals
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);

  const [editingStep, setEditingStep] = useState<ProcessStepItem | null>(null);
  const [isNewStep, setIsNewStep] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
      const snap = await getDoc(doc(db, 'site_content', 'faqs_process'));
      if (snap.exists()) {
        const d = snap.data();
        if (Array.isArray(d.faqs)) setFaqs(d.faqs);
        if (Array.isArray(d.processSteps)) setSteps(d.processSteps);
      }
    } catch (err) {
      console.warn('Could not load FAQs/Process from Firestore, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (newFaqs: FaqItem[], newSteps: ProcessStepItem[]) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      const payload = {
        faqs: newFaqs,
        processSteps: newSteps,
        updatedAt: serverTimestamp(),
      };
      await Promise.all([
        setDoc(doc(db, 'site_content', 'faqs_process'), payload, { merge: true }),
        setDoc(doc(db, 'pages', 'faqs-process'), payload, { merge: true }),
      ]);
      setFaqs(newFaqs);
      setSteps(newSteps);
      setSuccess('FAQs and Process Steps saved successfully!');
      setTimeout(() => setSuccess(''), 4000);
      setEditingFaq(null);
      setEditingStep(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save to database.');
    } finally {
      setSaving(false);
    }
  };

  // FAQ handlers
  const startNewFaq = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      q: '',
      a: '',
      category: 'Services',
      order: faqs.length + 1,
    });
    setIsNewFaq(true);
  };

  const saveFaq = (e: FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    let list: FaqItem[];
    if (isNewFaq) {
      list = [...faqs, editingFaq];
    } else {
      list = faqs.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    }
    handleSaveAll(list, steps);
  };

  const deleteFaq = (id: string) => {
    if (!window.confirm('Delete this FAQ question?')) return;
    const list = faqs.filter((f) => f.id !== id);
    handleSaveAll(list, steps);
  };

  const moveFaq = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= faqs.length) return;
    const copy = [...faqs];
    const temp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = temp;
    handleSaveAll(copy, steps);
  };

  // Process Step handlers
  const startNewStep = () => {
    setEditingStep({
      id: `step-${Date.now()}`,
      n: `0${steps.length + 1}`,
      title: '',
      text: '',
      order: steps.length + 1,
    });
    setIsNewStep(true);
  };

  const saveStep = (e: FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;
    let list: ProcessStepItem[];
    if (isNewStep) {
      list = [...steps, editingStep];
    } else {
      list = steps.map((s) => (s.id === editingStep.id ? editingStep : s));
    }
    handleSaveAll(faqs, list);
  };

  const deleteStep = (id: string) => {
    if (!window.confirm('Delete this process milestone?')) return;
    const list = steps.filter((s) => s.id !== id);
    handleSaveAll(faqs, list);
  };

  const moveStep = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= steps.length) return;
    const copy = [...steps];
    const temp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = temp;
    handleSaveAll(faqs, copy);
  };

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">WordPress-Style CMS</p>
          <h1>FAQs & Process Timeline Management</h1>
        </div>
        <div className="admin-page__actions">
          {tab === 'faqs' ? (
            <button type="button" className="btn btn--primary" onClick={startNewFaq}>
              <Plus size={16} style={{ marginRight: 6 }} /> Add Question
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={startNewStep}>
              <Plus size={16} style={{ marginRight: 6 }} /> Add Process Step
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
          className={`btn btn--sm ${tab === 'faqs' ? 'btn--primary' : 'btn--outline'}`}
          onClick={() => setTab('faqs')}
        >
          Frequently Asked Questions ({faqs.length})
        </button>
        <button
          type="button"
          className={`btn btn--sm ${tab === 'process' ? 'btn--primary' : 'btn--outline'}`}
          onClick={() => setTab('process')}
        >
          Process Steps Timeline ({steps.length})
        </button>
      </div>

      {loading ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <LoaderCircle size={28} className="spin text-primary" style={{ margin: '0 auto 1rem' }} />
          <p>Loading FAQs and process steps...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: FAQs */}
          {tab === 'faqs' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      style={{ padding: 2 }}
                      disabled={idx === 0}
                      onClick={() => moveFaq(idx, 'up')}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      style={{ padding: 2 }}
                      disabled={idx === faqs.length - 1}
                      onClick={() => moveFaq(idx, 'down')}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.35rem' }}>{faq.q}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => {
                        setEditingFaq({ ...faq });
                        setIsNewFaq(false);
                      }}
                    >
                      <Pencil size={13} style={{ marginRight: 4 }} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      onClick={() => deleteFaq(faq.id)}
                      style={{ color: '#dc2626' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Process Steps */}
          {tab === 'process' && (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      style={{ padding: 2 }}
                      disabled={idx === 0}
                      onClick={() => moveStep(idx, 'up')}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      style={{ padding: 2 }}
                      disabled={idx === steps.length - 1}
                      onClick={() => moveStep(idx, 'down')}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: 'var(--color-primary, #2563eb)',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {step.n}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem' }}>{step.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                      {step.text}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => {
                        setEditingStep({ ...step });
                        setIsNewStep(false);
                      }}
                    >
                      <Pencil size={13} style={{ marginRight: 4 }} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--plain btn--sm"
                      onClick={() => deleteStep(step.id)}
                      style={{ color: '#dc2626' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FAQ Modal */}
      {editingFaq && (
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
          onClick={() => setEditingFaq(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 540, width: '100%', padding: '1.5rem', borderRadius: 12, background: '#fff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem' }}>{isNewFaq ? 'Add FAQ Item' : 'Edit FAQ Item'}</h3>
            <form onSubmit={saveFaq} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Question:</label>
                <input
                  type="text"
                  value={editingFaq.q}
                  onChange={(e) => setEditingFaq({ ...editingFaq, q: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Answer:</label>
                <textarea
                  rows={4}
                  value={editingFaq.a}
                  onChange={(e) => setEditingFaq({ ...editingFaq, a: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditingFaq(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step Modal */}
      {editingStep && (
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
          onClick={() => setEditingStep(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 540, width: '100%', padding: '1.5rem', borderRadius: 12, background: '#fff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem' }}>{isNewStep ? 'Add Process Step' : 'Edit Process Step'}</h3>
            <form onSubmit={saveStep} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Number:</label>
                  <input
                    type="text"
                    value={editingStep.n}
                    onChange={(e) => setEditingStep({ ...editingStep, n: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Step Title:</label>
                  <input
                    type="text"
                    value={editingStep.title}
                    onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Description:</label>
                <textarea
                  rows={3}
                  value={editingStep.text}
                  onChange={(e) => setEditingStep({ ...editingStep, text: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditingStep(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={saving}>
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
