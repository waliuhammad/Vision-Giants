import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, Share2, Tag } from 'lucide-react';
import { blogPosts } from '../data/blog';
import { BlogThumbnail } from '../components/blog/BlogThumbnail';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/animations/Reveal';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const post = blogPosts.find((p) => p.slug === slug || p.id === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return (
      <div className="container section text-center" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div>
          <h2>Article Not Found</h2>
          <p className="lead" style={{ marginBottom: 'var(--space-5)' }}>
            The article you are looking for may have been moved or archived.
          </p>
          <Button to="/blog/" icon={<ArrowLeft size={16} />}>
            Back to All Articles
          </Button>
        </div>
      </div>
    );
  }

  const { title, category, date, readTime, author, tags, content, imageUrl } = post;
  const authorInitials = author.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  // Related posts (excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 2);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <article className="blog-detail-page">
      <header className="blog-detail-hero">
        <div className="bg-grid" aria-hidden="true" />
        <div className="container blog-detail-hero__container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/blog/">Blog</Link>
              </li>
              <li aria-current="page">{category}</li>
            </ol>
          </nav>

          <Link to="/blog/" className="blog-detail-back-link">
            <ArrowLeft size={16} />
            <span>Back to All Articles</span>
          </Link>

          <div className="blog-card__meta blog-detail-hero__meta">
            <span className="badge badge--primary">{category}</span>
            <span className="blog-card__meta-item">
              <Calendar size={14} aria-hidden="true" />
              <span>{date}</span>
            </span>
            <span className="blog-card__meta-item">
              <Clock size={14} aria-hidden="true" />
              <span>{readTime}</span>
            </span>
          </div>

          <h1 className="blog-detail-hero__title">{title}</h1>

          <div className="blog-detail-hero__author-bar">
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
              aria-label="Share article"
            >
              <Share2 size={16} />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container blog-detail-content-wrap">
        <div className="blog-detail-media">
          <BlogThumbnail category={category} title={title} imageUrl={imageUrl} />
        </div>

        <div className="blog-detail-body prose">
          <p className="lead blog-detail-lead">{content.lead}</p>

          {content.sections.map((section, idx) => (
            <Reveal key={idx} delay={idx * 60}>
              <div className="blog-detail-section">
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
            </Reveal>
          ))}

          {content.takeaways && content.takeaways.length > 0 && (
            <Reveal delay={120}>
              <div className="blog-dialog__takeaways">
                <h3>Key Architecture Takeaways</h3>
                <ul>
                  {content.takeaways.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          <div className="blog-detail-tags-bar">
            <span className="blog-dialog__tags-label">
              <Tag size={15} /> Topics:
            </span>
            <ul className="tech-tags">
              {tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section section--tight blog-related-section" aria-labelledby="related-heading">
          <div className="container">
            <h2 id="related-heading" className="section-title text-center" style={{ marginBottom: 'var(--space-6)' }}>
              Related Insights
            </h2>
            <div className="grid grid--2">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <div className="container" style={{ marginBlock: 'var(--space-6)' }}>
        <BlogNewsletter />
      </div>
    </article>
  );
}
