import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Search, X, RotateCcw, BookOpen } from 'lucide-react';
import { blogPosts, blogCategories, type BlogCategory, type BlogPost } from '../data/blog';
import { PageHero } from '../components/ui/PageHero';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogFeaturedCard } from '../components/blog/BlogFeaturedCard';
import { BlogSidebar } from '../components/blog/BlogSidebar';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';
import { BlogPostDialog } from '../components/blog/BlogPostDialog';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/animations/Reveal';
import { NetworkVisual } from '../components/visuals/IsoVisuals';

const ITEMS_PER_PAGE = 6;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [dialogPost, setDialogPost] = useState<BlogPost | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    blogPosts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  // Filtered posts based on category, search query, and active tag
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      // Category match
      if (selectedCategory !== 'All Articles' && post.category !== selectedCategory) {
        return false;
      }
      // Tag match
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = post.title.toLowerCase().includes(q);
        const inExcerpt = post.excerpt.toLowerCase().includes(q);
        const inAuthor = post.author.name.toLowerCase().includes(q);
        const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inExcerpt && !inAuthor && !inTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery, selectedTag]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchQuery, selectedTag]);

  // Featured article (only when in "All Articles" and no active search/tag filter)
  const isDefaultView = selectedCategory === 'All Articles' && !searchQuery.trim() && !selectedTag;
  const featuredPost = isDefaultView ? blogPosts.find((p) => p.featured) || blogPosts[0] : null;

  // Grid posts: if a featured post is highlighted, exclude it from the main grid below it
  const gridPosts = useMemo(() => {
    if (featuredPost && isDefaultView) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost, isDefaultView]);

  const paginatedPosts = useMemo(() => {
    return gridPosts.slice(0, visibleCount);
  }, [gridPosts, visibleCount]);

  const hasMore = visibleCount < gridPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Articles');
    setSearchQuery('');
    setSelectedTag(null);
  };

  const getCategoryCount = (category: BlogCategory) => {
    if (category === 'All Articles') return blogPosts.length;
    return blogPosts.filter((p) => p.category === category).length;
  };

  return (
    <div className="blog-page">
      {/* Compact, impactful Hero Section */}
      <PageHero
        crumb="Blog"
        eyebrow="Insights & Ideas"
        title="Insights, Ideas & Innovation."
        lead="In-depth perspectives on modern web and mobile architecture, cloud infrastructure, AI engineering, UI/UX trends, and digital business strategy."
        visual={<NetworkVisual />}
      />

      <div className="container blog-page__container">
        {/* Top Controls: Search Input + Category Filter Pills */}
        <div className="blog-controls-section">
          {/* Search bar */}
          <div className="blog-search-bar">
            <div className="blog-search-input-wrap">
              <Search size={18} className="blog-search-icon" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keywords, tags or authors…"
                className="blog-search-input"
                aria-label="Search articles"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="blog-search-clear-btn"
                  aria-label="Clear search input"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="blog-status-count" aria-live="polite">
              <span>
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="filters blog-category-filters" role="tablist" aria-label="Filter blog by category">
            {blogCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  className="filter-btn blog-filter-pill"
                  aria-selected={isActive}
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {isActive && (
                    <m.span layoutId="blog-filter-active" className="filter-btn__bg" transition={{ duration: 0.28 }} />
                  )}
                  <span>
                    {cat}
                    <span className="filter-count">{getCategoryCount(cat)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tag Filter Indicator */}
          {selectedTag && (
            <div className="blog-active-tag-banner">
              <span>Filtering by topic:</span>
              <span className="badge badge--primary">
                #{selectedTag}
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="blog-active-tag-remove"
                  aria-label={`Remove topic filter ${selectedTag}`}
                >
                  <X size={12} />
                </button>
              </span>
              <button type="button" onClick={handleResetFilters} className="text-link blog-reset-link">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Featured Story (shown only on initial unfiltered view) */}
        {featuredPost && (
          <section className="blog-featured-section" aria-label="Featured Story">
            <Reveal>
              <BlogFeaturedCard post={featuredPost} onSelect={(p) => setDialogPost(p)} />
            </Reveal>
          </section>
        )}

        {/* Main Content Layout: Grid + Sidebar */}
        <div className="blog-layout">
          <main className="blog-main-content" aria-label="Blog Articles Listing">
            {paginatedPosts.length > 0 ? (
              <>
                <m.div layout className="blog-grid">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {paginatedPosts.map((post) => (
                      <m.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <BlogCard post={post} onSelect={(p) => setDialogPost(p)} />
                      </m.div>
                    ))}
                  </AnimatePresence>
                </m.div>

                {/* Load More / Pagination */}
                {hasMore && (
                  <div className="blog-pagination">
                    <Button variant="outline" size="sm" onClick={handleLoadMore}>
                      Load More Articles ({gridPosts.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="blog-empty-state card text-center">
                <div className="icon-wrap blog-empty-state__icon" aria-hidden="true">
                  <BookOpen size={28} />
                </div>
                <h3>No articles found</h3>
                <p>
                  No insights matched your criteria {searchQuery && `for "${searchQuery}"`}
                  {selectedTag && ` with tag "#${selectedTag}"`}. Try refining your search terms or view all articles.
                </p>
                <Button variant="outline" size="sm" icon={<RotateCcw size={15} />} onClick={handleResetFilters}>
                  Reset Filters & View All
                </Button>
              </div>
            )}
          </main>

          {/* Supporting Sidebar */}
          <BlogSidebar
            categories={blogCategories}
            activeCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            recentPosts={blogPosts}
            allTags={allTags}
            activeTag={selectedTag}
            onSelectTag={(t) => setSelectedTag(t)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            getCategoryCount={getCategoryCount}
            onSelectPost={(p) => setDialogPost(p)}
          />
        </div>

        {/* Newsletter Section */}
        <Reveal delay={120}>
          <BlogNewsletter />
        </Reveal>
      </div>

      {/* Accessible Quick-Read Dialog */}
      <BlogPostDialog post={dialogPost} onClose={() => setDialogPost(null)} />
    </div>
  );
}
