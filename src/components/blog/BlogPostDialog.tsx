import { useEffect, useRef } from 'react';
import { X, Calendar, Clock, Share2, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../../data/blog';
import { BlogThumbnail } from './BlogThumbnail';
import { Button } from '../ui/Button';

interface BlogPostDialogProps {
  post: BlogPost | null;
  onClose: () => void;
}

export function BlogPostDialog({ post, onClose }: BlogPostDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!post) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  const { title, category, date, readTime, author, tags, content, imageUrl } = post;
  const authorInitials = author.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-article-title"
    >
      <div ref={dialogRef} className="modal blog-dialog" tabIndex={-1}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close article modal"
        >
          <X size={20} />
        </button>

        <div className="blog-dialog__hero">
          <BlogThumbnail category={category} title={title} imageUrl={imageUrl} className="blog-dialog__thumb" />
          <div className="blog-dialog__hero-content">
            <div className="blog-card__meta">
              <span className="badge">{category}</span>
              <span className="blog-card__meta-item">
                <Calendar size={13} aria-hidden="true" />
                <span>{date}</span>
              </span>
              <span className="blog-card__meta-item">
                <Clock size={13} aria-hidden="true" />
                <span>{readTime}</span>
              </span>
            </div>
            <h1 id="dialog-article-title" className="blog-dialog__title">
              {title}
            </h1>

            <div className="blog-dialog__author-bar">
              <div className="blog-card__author">
                <div className="blog-card__author-avatar">{authorInitials}</div>
                <div>
                  <span className="blog-card__author-name">{author.name}</span>
                  <span className="blog-card__author-role">{author.role}</span>
                </div>
              </div>

              <button
                type="button"
                className="blog-dialog__share-btn"
                onClick={handleShare}
                aria-label="Share article link"
                title="Share article"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="blog-dialog__body prose">
          <p className="lead blog-dialog__lead">{content.lead}</p>

          {content.sections.map((section, idx) => (
            <div key={idx} className="blog-dialog__section">
              {section.heading && <h2>{section.heading}</h2>}
              <p>{section.body}</p>

              {section.codeSnippet && (
                <div className="blog-dialog__code-block">
                  <div className="blog-dialog__code-header">
                    <span>{section.codeSnippet.language}</span>
                  </div>
                  <pre>
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {section.quote && (
                <blockquote className="blog-dialog__quote">
                  <p>"{section.quote}"</p>
                </blockquote>
              )}
            </div>
          ))}

          {content.takeaways && content.takeaways.length > 0 && (
            <div className="blog-dialog__takeaways">
              <h3>Key Architecture Takeaways</h3>
              <ul>
                {content.takeaways.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="blog-dialog__footer">
            <div className="blog-dialog__tags">
              <span className="blog-dialog__tags-label">Tags:</span>
              <ul className="tech-tags">
                {tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <Button to="/contact/" icon={<ArrowRight size={16} />} size="sm">
              Discuss Your Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
