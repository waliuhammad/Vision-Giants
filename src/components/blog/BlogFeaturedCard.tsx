import { Link } from 'react-router';
import { ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import type { BlogPost } from '../../data/blog';
import { BlogThumbnail } from './BlogThumbnail';
import { Button } from '../ui/Button';

interface BlogFeaturedCardProps {
  post: BlogPost;
  onSelect?: (post: BlogPost) => void;
}

export function BlogFeaturedCard({ post, onSelect }: BlogFeaturedCardProps) {
  const { slug, title, excerpt, category, date, readTime, author, tags, imageUrl } = post;

  const authorInitials = author.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <article className="blog-featured card card--interactive">
      <div className="blog-featured__grid">
        <div className="blog-featured__media">
          <Link
            to={`/blog/${slug}`}
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(post);
              }
            }}
            tabIndex={-1}
            aria-label={`Read featured article: ${title}`}
          >
            <BlogThumbnail category={category} title={title} imageUrl={imageUrl} className="blog-featured__thumb" />
          </Link>
          <div className="blog-featured__badge-group">
            <span className="badge badge--primary">
              <Sparkles size={12} aria-hidden="true" />
              Featured Article
            </span>
            <span className="badge">{category}</span>
          </div>
        </div>

        <div className="blog-featured__content">
          <div className="blog-card__meta">
            <span className="blog-card__meta-item">
              <Calendar size={14} aria-hidden="true" />
              <time dateTime={date}>{date}</time>
            </span>
            <span className="blog-card__meta-item">
              <Clock size={14} aria-hidden="true" />
              <span>{readTime}</span>
            </span>
          </div>

          <h2 className="blog-featured__title">
            <Link
              to={`/blog/${slug}`}
              onClick={(e) => {
                if (onSelect) {
                  e.preventDefault();
                  onSelect(post);
                }
              }}
            >
              {title}
            </Link>
          </h2>

          <p className="blog-featured__excerpt">{excerpt}</p>

          <ul className="tech-tags blog-featured__tags" aria-label="Article tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          <div className="blog-featured__footer">
            <div className="blog-card__author">
              <div className="blog-card__author-avatar" aria-hidden="true">
                {authorInitials}
              </div>
              <div>
                <span className="blog-card__author-name">{author.name}</span>
                <span className="blog-card__author-role">{author.role}</span>
              </div>
            </div>

            <Button
              to={`/blog/${slug}`}
              onClick={(e) => {
                if (onSelect) {
                  e.preventDefault();
                  onSelect(post);
                }
              }}
              size="sm"
              icon={<ArrowRight size={16} />}
            >
              Read Article
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
