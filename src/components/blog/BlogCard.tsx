import { Link } from 'react-router';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import type { BlogPost } from '../../data/blog';
import { BlogThumbnail } from './BlogThumbnail';

interface BlogCardProps {
  post: BlogPost;
  onSelect?: (post: BlogPost) => void;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

export function BlogCard({
  post,
  onSelect,
  headingLevel: H = 'h3',
  className = '',
}: BlogCardProps) {
  const { slug, title, excerpt, category, date, readTime, author, imageUrl } = post;

  const authorInitials = author.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <article className={`card card--interactive blog-card ${className}`.trim()}>
      <div className="blog-card__media">
        <Link
          to={`/blog/${slug}`}
          onClick={(e) => {
            if (onSelect) {
              e.preventDefault();
              onSelect(post);
            }
          }}
          aria-label={`Read article: ${title}`}
          tabIndex={-1}
        >
          <BlogThumbnail category={category} title={title} imageUrl={imageUrl} />
        </Link>
        <span className="badge blog-card__category">{category}</span>
      </div>

      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span className="blog-card__meta-item">
            <Calendar size={13} aria-hidden="true" />
            <time dateTime={date}>{date}</time>
          </span>
          <span className="blog-card__meta-item">
            <Clock size={13} aria-hidden="true" />
            <span>{readTime}</span>
          </span>
        </div>

        <H className="blog-card__title">
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
        </H>

        <p className="blog-card__excerpt">{excerpt}</p>

        <div className="blog-card__footer">
          <div className="blog-card__author">
            <div className="blog-card__author-avatar" aria-hidden="true">
              {authorInitials}
            </div>
            <div>
              <span className="blog-card__author-name">{author.name}</span>
              <span className="blog-card__author-role">{author.role}</span>
            </div>
          </div>

          <Link
            to={`/blog/${slug}`}
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(post);
              }
            }}
            className="text-link blog-card__action"
            aria-label={`Read article: ${title}`}
          >
            <span>Read</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
