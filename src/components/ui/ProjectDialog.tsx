import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { categoryLabels, type Project } from '../../data/portfolio';
import { ProjectMedia } from '../visuals/ProjectPreview';
import { Button } from './Button';

/** Screenshot viewer: large image with previous/next controls and a thumbnail strip. */
function ProjectGallery({ project }: { project: Project }) {
  const images = project.images?.length ? project.images : project.imageUrl ? [project.imageUrl] : [];
  const [index, setIndex] = useState(0);
  // Portrait images (mobile screenshots) are shown whole instead of cropped; detected once loaded.
  const [portrait, setPortrait] = useState<Record<string, boolean>>({});
  const isPortrait = (img: string) => portrait[img] === true;
  const measure = (img: string) => (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (h > w && !portrait[img]) setPortrait((p) => ({ ...p, [img]: true }));
  };

  if (images.length === 0) {
    return (
      <div className="modal__media">
        <ProjectMedia project={project} />
      </div>
    );
  }
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);
  const src = images[index];

  return (
    <div className="gallery">
      <div
        className={`gallery__stage${isPortrait(src) ? ' gallery__stage--portrait' : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
      >
        <img key={src} src={src} alt={`${project.title}: screenshot ${index + 1} of ${images.length}`} decoding="async" onLoad={measure(src)} />
        {images.length > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label="Previous screenshot">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label="Next screenshot">
              <ChevronRight size={20} />
            </button>
            <span className="gallery__count" aria-hidden="true">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="gallery__thumbs" aria-label="Screenshots">
          {images.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                className={`gallery__thumb${isPortrait(img) ? ' gallery__thumb--portrait' : ''}`}
                aria-current={i === index}
                aria-label={`Show screenshot ${i + 1}${isPortrait(img) ? ' (mobile)' : ''}`}
                onClick={() => setIndex(i)}
              >
                <img src={img} alt="" loading="lazy" decoding="async" onLoad={measure(img)} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="modal modal--wide"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {project && (
        <>
          <ProjectGallery key={project.id} project={project} />
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close project details">
            <X size={18} />
          </button>
          <div className="modal__body">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge">{categoryLabels[project.category]}</span>
              {project.industry && <span className="badge badge--neutral">{project.industry}</span>}
              {project.isDemo && <span className="badge badge--neutral">Concept project</span>}
            </div>
            <h2 id="project-dialog-title">{project.title}</h2>
            <p className="muted">{project.details}</p>
            <div className="modal__cols">
              <div>
                <h3>Key features</h3>
                <ul className="check-list">
                  {project.features.map((f) => (
                    <li key={f}>
                      <Check size={15} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Technologies</h3>
                <ul className="tech-tags">
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal__actions">
              {project.url && (
                <Button href={project.url} target="_blank" icon={<ExternalLink size={16} />}>
                  Visit website
                </Button>
              )}
              <Button to="/contact/" variant={project.url ? 'outline' : 'primary'} icon={<ArrowRight size={16} />}>
                Discuss a similar project
              </Button>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}

