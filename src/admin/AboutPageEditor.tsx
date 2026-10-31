import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { getAdminDb, getAdminStorage } from './firebase';
import { aboutDataFromDoc, defaultAboutData, type AboutCoreValue, type AboutPageData, type AboutWhyReason } from '../content/about';
import type { TeamMember } from '../data/team';

const firestore = () => import('firebase/firestore/lite');
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'];

async function uploadImage(file: File, prefix: string): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error('Use PNG, JPEG, WebP, AVIF or GIF images.');
  if (file.size >= 5 * 1024 * 1024) throw new Error('Images must be smaller than 5 MB.');
  const [storage, { ref, uploadBytes, getDownloadURL }] = await Promise.all([getAdminStorage(), import('firebase/storage')]);
  const safe = file.name.replace(/[^\w.-]+/g, '_').slice(-80);
  const result = await uploadBytes(ref(storage, `${prefix}/${Date.now()}-${safe}`), file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000',
  });
  return getDownloadURL(result.ref);
}

export function AboutPageEditor() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), firestore()]);
        const snap = await getDoc(doc(db, 'pages', 'about'));
        setData(snap.exists() ? aboutDataFromDoc(snap.data()) : defaultAboutData);
      } catch (err) {
        console.error(err);
        setError('Could not load About page data. Showing default content.');
        setData(defaultAboutData);
      }
    })();
  }, []);

  const update = (patch: Partial<AboutPageData>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaved(false);
    setNotice('');
  };

  const updateVisibility = (key: keyof AboutPageData['visibility'], value: boolean) => {
    if (!data) return;
    update({ visibility: { ...data.visibility, [key]: value } });
  };

  // ---------------- Core Values Handlers ----------------
  const updateValue = (index: number, patch: Partial<AboutCoreValue>) => {
    if (!data) return;
    const list = [...data.valuesList];
    list[index] = { ...list[index], ...patch };
    update({ valuesList: list });
  };

  const addValue = () => {
    if (!data) return;
    const newId = `val-${Date.now()}`;
    update({
      valuesList: [
        ...data.valuesList,
        { id: newId, title: 'New Core Value', description: 'Description of the principle...', icon: 'star' },
      ],
    });
  };

  const removeValue = (index: number) => {
    if (!data) return;
    update({ valuesList: data.valuesList.filter((_, i) => i !== index) });
  };

  const moveValue = (index: number, delta: -1 | 1) => {
    if (!data) return;
    const target = index + delta;
    if (target < 0 || target >= data.valuesList.length) return;
    const list = [...data.valuesList];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    update({ valuesList: list });
  };

  // ---------------- Why Choose Us Handlers ----------------
  const updateWhy = (index: number, patch: Partial<AboutWhyReason>) => {
    if (!data) return;
    const list = [...data.whyList];
    list[index] = { ...list[index], ...patch };
    update({ whyList: list });
  };

  const addWhy = () => {
    if (!data) return;
    const newId = `why-${Date.now()}`;
    update({
      whyList: [
        ...data.whyList,
        { id: newId, title: 'New Reason', description: 'Why clients should choose our services...', icon: 'check-circle' },
      ],
    });
  };

  const removeWhy = (index: number) => {
    if (!data) return;
    update({ whyList: data.whyList.filter((_, i) => i !== index) });
  };

  const moveWhy = (index: number, delta: -1 | 1) => {
    if (!data) return;
    const target = index + delta;
    if (target < 0 || target >= data.whyList.length) return;
    const list = [...data.whyList];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    update({ whyList: list });
  };

  // ---------------- Team Members Handlers ----------------
  const updateTeamMember = (index: number, patch: Partial<TeamMember>) => {
    if (!data) return;
    const list = [...data.teamMembers];
    list[index] = { ...list[index], ...patch };
    update({ teamMembers: list });
  };

  const updateTeamSocial = (index: number, key: keyof NonNullable<TeamMember['socials']>, value: string) => {
    if (!data) return;
    const list = [...data.teamMembers];
    const currentMember = list[index];
    list[index] = {
      ...currentMember,
      socials: {
        ...currentMember.socials,
        [key]: value,
      },
    };
    update({ teamMembers: list });
  };

  const addTeamMember = () => {
    if (!data) return;
    const newId = `member-${Date.now()}`;
    update({
      teamMembers: [
        ...data.teamMembers,
        {
          id: newId,
          name: 'New Team Member',
          role: 'Role / Designation',
          bio: 'Short biography and professional background...',
          socials: {},
        },
      ],
    });
  };

  const removeTeamMember = (index: number) => {
    if (!data) return;
    const member = data.teamMembers[index];
    if (window.confirm(`Delete ${member.name || 'this team member'}?`)) {
      update({ teamMembers: data.teamMembers.filter((_, i) => i !== index) });
    }
  };

  const moveTeamMember = (index: number, delta: -1 | 1) => {
    if (!data) return;
    const target = index + delta;
    if (target < 0 || target >= data.teamMembers.length) return;
    const list = [...data.teamMembers];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    update({ teamMembers: list });
  };

  const handleHeroImageUpload = async (file?: File) => {
    if (!file) return;
    setUploadingHero(true);
    setError('');
    try {
      const url = await uploadImage(file, 'content/about/hero');
      update({ heroImage: url });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hero image upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleMemberImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    setError('');
    try {
      const url = await uploadImage(file, `content/about/team`);
      updateTeamMember(index, { image: url });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Member image upload failed');
    }
  };

  // ---------------- Save Handler ----------------
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
      await setDoc(doc(db, 'pages', 'about'), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setNotice('About Us page saved successfully! Changes are live on the website.');
    } catch (err) {
      console.error(err);
      setError('Could not save About Us changes. Check your connection or permissions.');
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return <div className="admin-boot">Loading About Us page editor…</div>;
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Website Content</p>
          <h1>About Us Page Management</h1>
          <p className="muted">
            Customize all 7 sections of the About Us page, manage team member profiles, upload images, and toggle section visibility.
          </p>
        </div>
        <div className="admin-actions">
          <a className="btn btn--outline btn--sm" href="/about/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={15} />
            View live page
          </a>
        </div>
      </header>

      <form className="form admin-profile" onSubmit={save} noValidate>
        {/* Section Visibility Master Control */}
        <section className="card admin-profile__section">
          <h2>Section Visibility</h2>
          <p className="muted">Show or hide individual sections on the public About Us page without deleting your data.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
            {(Object.keys(data.visibility) as (keyof AboutPageData['visibility'])[]).map((key) => (
              <label key={key} className="checkbox" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={data.visibility[key]}
                  onChange={(e) => updateVisibility(key, e.target.checked)}
                />
                <span style={{ textTransform: 'capitalize' }}>
                  {key === 'whoWeAre' ? 'Who We Are' : key === 'missionVision' ? 'Mission & Vision' : key === 'whyChooseUs' ? 'Why Choose Us' : key}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* 1. Hero Section */}
        <section className="card admin-profile__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>1. Hero Section</h2>
            <span className={`admin-status admin-status--${data.visibility.hero ? 'published' : 'draft'}`}>
              {data.visibility.hero ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="field">
            <label htmlFor="hero-eyebrow">Eyebrow Tag</label>
            <input
              id="hero-eyebrow"
              className="input"
              value={data.heroEyebrow}
              onChange={(e) => update({ heroEyebrow: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="hero-headline">Main Headline</label>
            <input
              id="hero-headline"
              className="input"
              value={data.heroHeadline}
              onChange={(e) => update({ heroHeadline: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="hero-description">Hero Introduction Description</label>
            <textarea
              id="hero-description"
              className="input"
              rows={3}
              value={data.heroDescription}
              onChange={(e) => update({ heroDescription: e.target.value })}
            />
          </div>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="hero-cta-text">CTA Button Text</label>
              <input
                id="hero-cta-text"
                className="input"
                value={data.heroCtaText}
                onChange={(e) => update({ heroCtaText: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="hero-cta-link">CTA Destination URL</label>
              <input
                id="hero-cta-link"
                className="input"
                value={data.heroCtaLink}
                onChange={(e) => update({ heroCtaLink: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>Hero Graphic / Background Image (Optional)</label>
            {data.heroImage ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: '8px' }}>
                <img
                  src={data.heroImage}
                  alt={data.heroImageAlt || 'Hero preview'}
                  style={{ width: '120px', height: '75px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
                <button
                  type="button"
                  className="btn btn--outline btn--sm admin-danger"
                  onClick={() => update({ heroImage: '' })}
                >
                  <X size={14} /> Remove image
                </button>
              </div>
            ) : null}
            <label className="btn btn--outline btn--sm admin-upload" style={{ width: 'fit-content' }}>
              {uploadingHero ? 'Uploading…' : data.heroImage ? 'Replace Hero Image' : 'Upload Hero Image'}
              <span aria-hidden="true">
                {uploadingHero ? <LoaderCircle size={15} className="spin" /> : <Upload size={15} />}
              </span>
              <input
                type="file"
                accept={IMAGE_TYPES.join(',')}
                disabled={uploadingHero}
                onChange={(e) => handleHeroImageUpload(e.target.files?.[0])}
              />
            </label>
          </div>
          {data.heroImage ? (
            <div className="field">
              <label htmlFor="hero-image-alt">Image Alt Text (Accessibility)</label>
              <input
                id="hero-image-alt"
                className="input"
                value={data.heroImageAlt || ''}
                onChange={(e) => update({ heroImageAlt: e.target.value })}
              />
            </div>
          ) : null}
        </section>

        {/* 2. Who We Are */}
        <section className="card admin-profile__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>2. Who We Are Section</h2>
            <span className={`admin-status admin-status--${data.visibility.whoWeAre ? 'published' : 'draft'}`}>
              {data.visibility.whoWeAre ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="field">
            <label htmlFor="who-eyebrow">Section Eyebrow</label>
            <input
              id="who-eyebrow"
              className="input"
              value={data.whoWeAreEyebrow}
              onChange={(e) => update({ whoWeAreEyebrow: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="who-heading">Section Heading</label>
            <input
              id="who-heading"
              className="input"
              value={data.whoWeAreHeading}
              onChange={(e) => update({ whoWeAreHeading: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="who-text">Company Description (Paragraphs separated by blank line)</label>
            <textarea
              id="who-text"
              className="input"
              rows={5}
              value={data.whoWeAreText}
              onChange={(e) => update({ whoWeAreText: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="who-bullets">Key Highlight Bullets (One per line)</label>
            <textarea
              id="who-bullets"
              className="input"
              rows={4}
              value={(data.whoWeAreBullets || []).join('\n')}
              onChange={(e) =>
                update({
                  whoWeAreBullets: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </div>
        </section>

        {/* 3. Mission & Vision */}
        <section className="card admin-profile__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>3. Mission & Vision</h2>
            <span className={`admin-status admin-status--${data.visibility.missionVision ? 'published' : 'draft'}`}>
              {data.visibility.missionVision ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="grid grid--2">
            <div>
              <div className="field">
                <label htmlFor="mission-heading">Mission Heading</label>
                <input
                  id="mission-heading"
                  className="input"
                  value={data.missionHeading}
                  onChange={(e) => update({ missionHeading: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="mission-text">Mission Statement</label>
                <textarea
                  id="mission-text"
                  className="input"
                  rows={4}
                  value={data.missionText}
                  onChange={(e) => update({ missionText: e.target.value })}
                />
              </div>
            </div>
            <div>
              <div className="field">
                <label htmlFor="vision-heading">Vision Heading</label>
                <input
                  id="vision-heading"
                  className="input"
                  value={data.visionHeading}
                  onChange={(e) => update({ visionHeading: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="vision-text">Vision Statement</label>
                <textarea
                  id="vision-text"
                  className="input"
                  rows={4}
                  value={data.visionText}
                  onChange={(e) => update({ visionText: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Core Values */}
        <section className="card admin-profile__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>4. Our Core Values</h2>
              <p className="muted" style={{ margin: '4px 0 0' }}>Manage the 6 core company values shown in grid layout.</p>
            </div>
            <button type="button" className="btn btn--outline btn--sm" onClick={addValue}>
              <Plus size={15} /> Add Value
            </button>
          </div>
          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="val-eyebrow">Values Eyebrow</label>
              <input
                id="val-eyebrow"
                className="input"
                value={data.valuesEyebrow}
                onChange={(e) => update({ valuesEyebrow: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="val-heading">Values Heading</label>
              <input
                id="val-heading"
                className="input"
                value={data.valuesHeading}
                onChange={(e) => update({ valuesHeading: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-rows">
            {data.valuesList.map((val, i) => (
              <div key={val.id || i} className="admin-rows__row" style={{ alignItems: 'flex-start', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-2)', width: '100%', marginBottom: '8px' }}>
                <div style={{ flex: 1, display: 'grid', gap: '8px' }}>
                  <input
                    className="input"
                    placeholder="Value Title (e.g. Innovation)"
                    value={val.title}
                    onChange={(e) => updateValue(i, { title: e.target.value })}
                  />
                  <textarea
                    className="input"
                    rows={2}
                    placeholder="Description of this value..."
                    value={val.description}
                    onChange={(e) => updateValue(i, { description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '8px' }}>
                  <button type="button" className="admin-icon-btn" onClick={() => moveValue(i, -1)} disabled={i === 0} title="Move up">
                    <ArrowUp size={15} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => moveValue(i, 1)} disabled={i === data.valuesList.length - 1} title="Move down">
                    <ArrowDown size={15} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => removeValue(i)} title="Remove value">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Why Choose Us */}
        <section className="card admin-profile__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>5. Why Choose Us</h2>
              <p className="muted" style={{ margin: '4px 0 0' }}>Client value propositions and differentiators.</p>
            </div>
            <button type="button" className="btn btn--outline btn--sm" onClick={addWhy}>
              <Plus size={15} /> Add Pillar
            </button>
          </div>
          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="why-eyebrow">Eyebrow</label>
              <input
                id="why-eyebrow"
                className="input"
                value={data.whyEyebrow}
                onChange={(e) => update({ whyEyebrow: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="why-heading">Heading</label>
              <input
                id="why-heading"
                className="input"
                value={data.whyHeading}
                onChange={(e) => update({ whyHeading: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-rows">
            {data.whyList.map((why, i) => (
              <div key={why.id || i} className="admin-rows__row" style={{ alignItems: 'flex-start', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-2)', width: '100%', marginBottom: '8px' }}>
                <div style={{ flex: 1, display: 'grid', gap: '8px' }}>
                  <input
                    className="input"
                    placeholder="Pillar Title (e.g. Skilled Development Team)"
                    value={why.title}
                    onChange={(e) => updateWhy(i, { title: e.target.value })}
                  />
                  <textarea
                    className="input"
                    rows={2}
                    placeholder="Short description of this benefit..."
                    value={why.description}
                    onChange={(e) => updateWhy(i, { description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '8px' }}>
                  <button type="button" className="admin-icon-btn" onClick={() => moveWhy(i, -1)} disabled={i === 0} title="Move up">
                    <ArrowUp size={15} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => moveWhy(i, 1)} disabled={i === data.whyList.length - 1} title="Move down">
                    <ArrowDown size={15} />
                  </button>
                  <button type="button" className="admin-icon-btn" onClick={() => removeWhy(i)} title="Remove pillar">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Team Members CRUD */}
        <section className="card admin-profile__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>6. Our Team Members</h2>
              <p className="muted" style={{ margin: '4px 0 0' }}>Manage the team profiles, photos, bios, and social links.</p>
            </div>
            <button type="button" className="btn btn--outline btn--sm" onClick={addTeamMember}>
              <Plus size={15} /> Add Team Member
            </button>
          </div>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="team-eyebrow">Team Section Eyebrow</label>
              <input
                id="team-eyebrow"
                className="input"
                value={data.teamEyebrow}
                onChange={(e) => update({ teamEyebrow: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="team-heading">Team Section Heading</label>
              <input
                id="team-heading"
                className="input"
                value={data.teamHeading}
                onChange={(e) => update({ teamHeading: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            {data.teamMembers.map((member, i) => (
              <div
                key={member.id || i}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  background: 'var(--color-surface-2)',
                  display: 'grid',
                  gap: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-surface)', display: 'grid', placeItems: 'center', border: '1px solid var(--border)' }}>
                      {member.image ? (
                        <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <User size={24} style={{ color: 'var(--color-muted)' }} />
                      )}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.05rem' }}>{member.name || 'Unnamed Member'}</strong>
                      <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>{member.role || 'Designation'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" className="admin-icon-btn" onClick={() => moveTeamMember(i, -1)} disabled={i === 0} title="Move up">
                      <ArrowUp size={15} />
                    </button>
                    <button type="button" className="admin-icon-btn" onClick={() => moveTeamMember(i, 1)} disabled={i === data.teamMembers.length - 1} title="Move down">
                      <ArrowDown size={15} />
                    </button>
                    <button type="button" className="admin-icon-btn admin-danger" onClick={() => removeTeamMember(i)} title="Delete member">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid--2">
                  <div className="field">
                    <label>Full Name</label>
                    <input
                      className="input"
                      value={member.name}
                      onChange={(e) => updateTeamMember(i, { name: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Job Designation</label>
                    <input
                      className="input"
                      value={member.role}
                      onChange={(e) => updateTeamMember(i, { role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Short Introduction / Bio</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={member.bio}
                    onChange={(e) => updateTeamMember(i, { bio: e.target.value })}
                  />
                </div>

                {/* Photo Upload */}
                <div className="field">
                  <label>Profile Picture</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <label className="btn btn--outline btn--sm admin-upload">
                      <Upload size={14} /> Upload Photograph
                      <input
                        type="file"
                        accept={IMAGE_TYPES.join(',')}
                        onChange={(e) => handleMemberImageUpload(i, e.target.files?.[0])}
                      />
                    </label>
                    {member.image ? (
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        onClick={() => updateTeamMember(i, { image: '' })}
                      >
                        Remove Photo
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Social Profiles */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-3)' }}>
                  <p className="muted" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>Social Profiles (Optional)</p>
                  <div className="grid grid--3">
                    <input
                      className="input"
                      placeholder="LinkedIn URL (https://...)"
                      value={member.socials?.linkedin || ''}
                      onChange={(e) => updateTeamSocial(i, 'linkedin', e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Twitter / X URL (https://...)"
                      value={member.socials?.twitter || ''}
                      onChange={(e) => updateTeamSocial(i, 'twitter', e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="GitHub URL (https://...)"
                      value={member.socials?.github || ''}
                      onChange={(e) => updateTeamSocial(i, 'github', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Final Call to Action */}
        <section className="card admin-profile__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>7. Final Call to Action</h2>
            <span className={`admin-status admin-status--${data.visibility.cta ? 'published' : 'draft'}`}>
              {data.visibility.cta ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="field">
            <label htmlFor="cta-heading">Heading</label>
            <input
              id="cta-heading"
              className="input"
              value={data.ctaHeading}
              onChange={(e) => update({ ctaHeading: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="cta-description">Description</label>
            <textarea
              id="cta-description"
              className="input"
              rows={2}
              value={data.ctaDescription}
              onChange={(e) => update({ ctaDescription: e.target.value })}
            />
          </div>
          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="cta-btn-text">Button Text</label>
              <input
                id="cta-btn-text"
                className="input"
                value={data.ctaButtonText}
                onChange={(e) => update({ ctaButtonText: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="cta-btn-link">Button Destination Link</label>
              <input
                id="cta-btn-link"
                className="input"
                value={data.ctaButtonLink}
                onChange={(e) => update({ ctaButtonLink: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Sticky Save Bar */}
        <div className="admin-profile__bar">
          <div aria-live="polite">
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
          </div>
          <button type="submit" className="btn btn--primary btn--sm" disabled={busy || saved}>
            {busy ? 'Saving…' : saved ? 'Saved' : 'Save About Us Changes'}
            <span aria-hidden="true">
              <Save size={15} />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

