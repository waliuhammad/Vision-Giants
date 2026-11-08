import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
  Layers,
  Search,
  Sparkles,
  ExternalLink,
  Edit3,
  CheckCircle,
  Filter,
} from 'lucide-react';

interface SectionItem {
  id: string;
  name: string;
  pageId: string;
  pageTitle: string;
  pagePath: string;
  fieldsCount: number;
  description: string;
  dedicatedUrl?: string;
  dedicatedLabel?: string;
}

const ALL_SECTIONS: SectionItem[] = [
  // Home Page sections
  {
    id: 'home-hero',
    name: 'Hero Section & Headline Banner',
    pageId: 'home',
    pageTitle: 'Home Page',
    pagePath: '/',
    fieldsCount: 3,
    description: 'Main greeting headline, subtitle, primary CTA button, and Navy Blue theme visuals.',
    dedicatedUrl: '/admin/home-hero',
    dedicatedLabel: 'Hero Manager',
  },
  {
    id: 'home-collab',
    name: 'Strategic Collaboration Partners',
    pageId: 'home',
    pageTitle: 'Home Page',
    pagePath: '/',
    fieldsCount: 4,
    description: 'Showcases 4 partner software houses with clickable logos, links, and capability tags.',
    dedicatedUrl: '/admin/collaboration',
    dedicatedLabel: 'Partners Manager',
  },
  {
    id: 'home-services',
    name: 'Core Services Strip',
    pageId: 'home',
    pageTitle: 'Home Page',
    pagePath: '/',
    fieldsCount: 3,
    description: 'Summary grid highlighting key design, mobile app, and cloud development services.',
    dedicatedUrl: '/admin/services',
    dedicatedLabel: 'Services Manager',
  },
  {
    id: 'home-work',
    name: 'Selected Work & Portfolio Showcase',
    pageId: 'home',
    pageTitle: 'Home Page',
    pagePath: '/',
    fieldsCount: 3,
    description: 'Real client case studies, responsive live preview links, and technologies used.',
    dedicatedUrl: '/admin/portfolio',
    dedicatedLabel: 'Portfolio Manager',
  },
  {
    id: 'home-why',
    name: 'Why Vision Giants Value Proposition',
    pageId: 'home',
    pageTitle: 'Home Page',
    pagePath: '/',
    fieldsCount: 3,
    description: 'Quality, clarity, engineering discipline, and scalable architecture highlights.',
    dedicatedUrl: '/admin/pages/home',
    dedicatedLabel: 'Page Editor',
  },
  {
    id: 'home-tech',
    name: 'Modern Technology Stack Strip',
    pageId: 'home',
    pageTitle: 'Home Page',
    pagePath: '/',
    fieldsCount: 3,
    description: 'Interactive cards for React, Node, Flutter, Python, Docker, AWS, and Cloud.',
    dedicatedUrl: '/admin/technologies',
    dedicatedLabel: 'Tech Manager',
  },
  {
    id: 'home-cta',
    name: 'Closing Call to Action (CTA)',
    pageId: 'home',
    pageTitle: 'Home Page',
    pagePath: '/',
    fieldsCount: 2,
    description: 'Project consultation prompt leading directly to the interactive inquiry contact form.',
    dedicatedUrl: '/admin/pages/home',
    dedicatedLabel: 'Page Editor',
  },

  // About Us Page sections
  {
    id: 'about-hero',
    name: 'About Us Hero Banner',
    pageId: 'about',
    pageTitle: 'About Us',
    pagePath: '/about/',
    fieldsCount: 3,
    description: 'Company origins, mission statement, and high-impact introductory statement.',
    dedicatedUrl: '/admin/about-page',
    dedicatedLabel: 'About Us Editor',
  },
  {
    id: 'about-mission',
    name: 'Mission, Vision & Core Values',
    pageId: 'about',
    pageTitle: 'About Us',
    pagePath: '/about/',
    fieldsCount: 6,
    description: 'Detailed cards covering innovation, reliability, integrity, and client obsession.',
    dedicatedUrl: '/admin/about-page',
    dedicatedLabel: 'About Us Editor',
  },
  {
    id: 'about-clients',
    name: 'Trusted Clients & Partner Brands',
    pageId: 'about',
    pageTitle: 'About Us',
    pagePath: '/about/',
    fieldsCount: 3,
    description: 'Logos and client organizations that rely on Vision Giants software engineering.',
    dedicatedUrl: '/admin/clients',
    dedicatedLabel: 'Clients Manager',
  },

  // Services Page sections
  {
    id: 'services-hero',
    name: 'Services Hero & Lead',
    pageId: 'services',
    pageTitle: 'Services',
    pagePath: '/services/',
    fieldsCount: 3,
    description: 'End-to-end digital solutions for modern businesses headline and introduction.',
    dedicatedUrl: '/admin/services-page',
    dedicatedLabel: 'Services Page Editor',
  },
  {
    id: 'services-grid',
    name: 'Full Services Catalog Grid',
    pageId: 'services',
    pageTitle: 'Services',
    pagePath: '/services/',
    fieldsCount: 12,
    description: 'Detailed service cards with deliverables, technologies, and individual service pages.',
    dedicatedUrl: '/admin/services',
    dedicatedLabel: 'Services Cards Manager',
  },
  {
    id: 'services-process',
    name: '5-Step Delivery Process Timeline',
    pageId: 'services',
    pageTitle: 'Services',
    pagePath: '/services/',
    fieldsCount: 5,
    description: 'Discovery, UX/UI Design, Agile Development, Testing & QA, Launch & Scale.',
    dedicatedUrl: '/admin/faqs-process',
    dedicatedLabel: 'Process Manager',
  },
  {
    id: 'services-faq',
    name: 'Frequently Asked Questions (FAQ)',
    pageId: 'services',
    pageTitle: 'Services',
    pagePath: '/services/',
    fieldsCount: 6,
    description: 'Searchable accordions answering timelines, pricing, support, and stack options.',
    dedicatedUrl: '/admin/faqs-process',
    dedicatedLabel: 'FAQ Manager',
  },

  // Careers Page sections
  {
    id: 'careers-hero',
    name: 'Careers Hero & Values Ribbon',
    pageId: 'careers',
    pageTitle: 'Careers & Jobs',
    pagePath: '/careers/',
    fieldsCount: 3,
    description: 'Work with Vision Giants intro, company culture benefits, and perks.',
    dedicatedUrl: '/admin/careers',
    dedicatedLabel: 'Careers Manager',
  },
  {
    id: 'careers-positions',
    name: 'Active Job Openings Grid',
    pageId: 'careers',
    pageTitle: 'Careers & Jobs',
    pagePath: '/careers/',
    fieldsCount: 8,
    description: 'Listings for Frontend, Backend, UI/UX, and QA roles with dedicated application form.',
    dedicatedUrl: '/admin/careers',
    dedicatedLabel: 'Careers Manager',
  },

  // Courses / Academy Page sections
  {
    id: 'courses-hero',
    name: 'Vision Giants Academy Hero',
    pageId: 'courses',
    pageTitle: 'Academy & Courses',
    pagePath: '/courses/',
    fieldsCount: 3,
    description: 'Hands-on practical software development training by industry veterans.',
    dedicatedUrl: '/admin/courses',
    dedicatedLabel: 'Courses Manager',
  },
  {
    id: 'courses-catalog',
    name: 'Interactive Course Catalog',
    pageId: 'courses',
    pageTitle: 'Academy & Courses',
    pagePath: '/courses/',
    fieldsCount: 10,
    description: 'Programs covering Full-Stack, Flutter, Python AI, and Cloud DevOps.',
    dedicatedUrl: '/admin/courses',
    dedicatedLabel: 'Courses Manager',
  },

  // Global Header & Footer
  {
    id: 'global-nav',
    name: 'Site-Wide Fixed Navigation Bar',
    pageId: 'global',
    pageTitle: 'Global Header',
    pagePath: '/',
    fieldsCount: 7,
    description: 'Fixed header with logo, dynamic menu links, active pill highlighter, and CTA.',
    dedicatedUrl: '/admin/navigation',
    dedicatedLabel: 'Navigation Manager',
  },
  {
    id: 'global-footer',
    name: 'Site-Wide Global Footer',
    pageId: 'global',
    pageTitle: 'Global Footer',
    pagePath: '/',
    fieldsCount: 8,
    description: 'Multi-column links, contact details, social links, legal notices, and newsletter toggle.',
    dedicatedUrl: '/admin/footer',
    dedicatedLabel: 'Footer Manager',
  },
];

export function SectionsManager() {
  const [search, setSearch] = useState('');
  const [selectedPage, setSelectedPage] = useState('all');

  const filteredSections = useMemo(() => {
    return ALL_SECTIONS.filter((sec) => {
      const matchPage = selectedPage === 'all' || sec.pageId === selectedPage;
      const matchSearch =
        sec.name.toLowerCase().includes(search.toLowerCase()) ||
        sec.description.toLowerCase().includes(search.toLowerCase()) ||
        sec.pageTitle.toLowerCase().includes(search.toLowerCase());
      return matchPage && matchSearch;
    });
  }, [search, selectedPage]);

  const uniquePages = useMemo(() => {
    const map = new Map<string, string>();
    ALL_SECTIONS.forEach((s) => map.set(s.pageId, s.pageTitle));
    return Array.from(map.entries());
  }, []);

  return (
    <div className="admin-page" style={{ maxWidth: 1300, margin: '0 auto', gap: '1.75rem' }}>
      {/* Header */}
      <div className="admin-page__head">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', marginBottom: '0.5rem' }}>
            <Layers size={13} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c084fc', textTransform: 'uppercase' }}>
              Universal Sections Directory
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
            Website Sections & Blocks
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            View, inspect, and directly edit every section block across all pages of the website.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/visual-builder" className="btn btn--primary">
            <Sparkles size={16} />
            <span>Open in Visual Builder</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 280 }}>
          <div className="input-with-action" style={{ width: '100%', maxWidth: 360 }}>
            <Search size={16} style={{ color: 'var(--color-muted)' }} />
            <input
              type="text"
              placeholder="Search sections by name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '2rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--color-muted)' }} />
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="input"
              style={{ minWidth: 160 }}
            >
              <option value="all">All Pages ({ALL_SECTIONS.length})</option>
              {uniquePages.map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
          Showing <strong>{filteredSections.length}</strong> sections
        </span>
      </div>

      {/* Sections Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            className="card"
            style={{
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#2563eb',
                    background: 'rgba(37, 99, 235, 0.08)',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {sec.pageTitle}
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.75rem',
                    color: '#10b981',
                    fontWeight: 500,
                  }}
                >
                  <CheckCircle size={13} />
                  <span>Active & Live</span>
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.35rem', color: 'var(--color-foreground)' }}>
                {sec.name}
              </h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
                {sec.description}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              <a
                href={sec.pagePath}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--plain btn--sm"
                style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}
              >
                <ExternalLink size={13} style={{ marginRight: 4 }} />
                <span>View Live</span>
              </a>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {sec.dedicatedUrl ? (
                  <Link to={sec.dedicatedUrl} className="btn btn--primary btn--sm" style={{ fontSize: '0.78rem' }}>
                    <Edit3 size={13} style={{ marginRight: 4 }} />
                    <span>{sec.dedicatedLabel || 'Edit Section'}</span>
                  </Link>
                ) : (
                  <Link to={`/admin/pages/${sec.pageId}`} className="btn btn--outline btn--sm" style={{ fontSize: '0.78rem' }}>
                    <Edit3 size={13} style={{ marginRight: 4 }} />
                    <span>Edit in Page</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
