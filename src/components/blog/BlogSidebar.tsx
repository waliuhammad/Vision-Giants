import { Link } from 'react-router';
import { Search, Tag, TrendingUp, Folder, X } from 'lucide-react';
import type { BlogCategory, BlogPost } from '../../data/blog';

interface BlogSidebarProps {
  categories: BlogCategory[];
  activeCategory: BlogCategory;
  onSelectCategory: (cat: BlogCategory) => void;
  recentPosts: BlogPost[];
  allTags: string[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  getCategoryCount: (cat: BlogCategory) => number;
  onSelectPost?: (post: BlogPost) => void;
}

export function BlogSidebar({
  categories,
  activeCategory,
  onSelectCategory,
  recentPosts,
  allTags,
  activeTag,
  onSelectTag,
  searchQuery,
  onSearchChange,
  getCategoryCount,
  onSelectPost,
}: BlogSidebarProps) {
  return (
    <aside className="blog-sidebar" aria-label="Blog filters and recommendations">
      {/* Search Widget */}
      <div className="blog-sidebar__widget card">
        <h3 className="blog-sidebar__widget-title">Search Articles</h3>
        <div className="blog-search-field">
          <Search size={16} className="blog-search-field__icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topics, keywords..."
            className="blog-search-field__input"
            aria-label="Search blog articles"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="blog-search-field__clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Categories Widget */}
      <div className="blog-sidebar__widget card">
        <h3 className="blog-sidebar__widget-title">
          <Folder size={16} aria-hidden="true" />
          <span>Categories</span>
        </h3>
        <ul className="blog-sidebar__categories" aria-label="Article categories">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <li key={cat}>
                <button
                  type="button"
                  className={`blog-sidebar__cat-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => onSelectCategory(cat)}
                  aria-pressed={isSelected}
                >
                  <span className="blog-sidebar__cat-name">{cat}</span>
                  <span className="blog-sidebar__cat-count">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recent Articles Widget */}
      <div className="blog-sidebar__widget card">
        <h3 className="blog-sidebar__widget-title">
          <TrendingUp size={16} aria-hidden="true" />
          <span>Recent Articles</span>
        </h3>
        <ul className="blog-sidebar__recent-list">
          {recentPosts.slice(0, 4).map((post) => (
            <li key={post.id} className="blog-sidebar__recent-item">
              <Link
                to={`/blog/${post.slug}`}
                onClick={(e) => {
                  if (onSelectPost) {
                    e.preventDefault();
                    onSelectPost(post);
                  }
                }}
                className="blog-sidebar__recent-link"
              >
                <span className="blog-sidebar__recent-title">{post.title}</span>
                <span className="blog-sidebar__recent-date">{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags Widget */}
      <div className="blog-sidebar__widget card">
        <h3 className="blog-sidebar__widget-title">
          <Tag size={16} aria-hidden="true" />
          <span>Popular Topics</span>
        </h3>
        <div className="blog-sidebar__tags">
          {activeTag && (
            <button
              type="button"
              className="blog-sidebar__tag-pill is-active"
              onClick={() => onSelectTag(null)}
              aria-label={`Clear active tag filter ${activeTag}`}
            >
              <span>{activeTag}</span>
              <X size={12} aria-hidden="true" />
            </button>
          )}
          {allTags
            .filter((t) => t !== activeTag)
            .map((tag) => (
              <button
                key={tag}
                type="button"
                className="blog-sidebar__tag-pill"
                onClick={() => onSelectTag(tag)}
              >
                #{tag}
              </button>
            ))}
        </div>
      </div>
    </aside>
  );
}
