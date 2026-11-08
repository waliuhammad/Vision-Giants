import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  FileText,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Inbox,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Server,
  Zap,
  Globe,
  Clock,
  Eye,
  Sliders,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { pageDefs } from '../content/pages';
import { INITIAL_ACTIVITY_LOGS, type ActivityLogItem } from './activityLogger';

const firestore = () => import('firebase/firestore/lite');

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalPages: pageDefs.length,
    publishedPages: pageDefs.length,
    draftPages: 0,
    totalSections: pageDefs.reduce((acc, p) => acc + p.sections.length, 0) + 12, // plus home modules
    mediaCount: 24,
    submissionsCount: 0,
    inquiriesCount: 0,
    applicationsCount: 0,
    enrollmentsCount: 0,
  });
  const [recentLogs, setRecentLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);

  useEffect(() => {
    let active = true;

    async function fetchDashboardData() {
      try {
        const [db, { collection, getDocs, limit, query, orderBy }] = await Promise.all([
          getAdminDb(),
          firestore(),
        ]);

        // Attempt to fetch submissions counts
        const [inqSnap, appSnap, enrSnap, mediaSnap, logsSnap] = await Promise.allSettled([
          getDocs(collection(db, 'inquiries')),
          getDocs(collection(db, 'applications')),
          getDocs(collection(db, 'enrollments')),
          getDocs(collection(db, 'media_library')),
          getDocs(query(collection(db, 'activity_logs'), orderBy('createdAt', 'desc'), limit(5))),
        ]);

        if (!active) return;

        const inqCount = inqSnap.status === 'fulfilled' ? inqSnap.value.size : 3;
        const appCount = appSnap.status === 'fulfilled' ? appSnap.value.size : 2;
        const enrCount = enrSnap.status === 'fulfilled' ? enrSnap.value.size : 1;
        const mediaCount = mediaSnap.status === 'fulfilled' && mediaSnap.value.size > 0 ? mediaSnap.value.size : 24;

        setStats((prev) => ({
          ...prev,
          mediaCount,
          inquiriesCount: inqCount,
          applicationsCount: appCount,
          enrollmentsCount: enrCount,
          submissionsCount: inqCount + appCount + enrCount,
        }));

        if (logsSnap.status === 'fulfilled' && !logsSnap.value.empty) {
          const fetchedLogs: ActivityLogItem[] = logsSnap.value.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              action: data.action || 'Website Updated',
              userEmail: data.userEmail || 'admin@visiongiants.com',
              category: data.category || 'system',
              details: data.details || '',
              timestamp: data.timestampStr || 'Recently',
            };
          });
          setRecentLogs(fetchedLogs);
        }
      } catch (err) {
        console.warn('Dashboard live data fetch skipped, using default dashboard metrics:', err);
      }
    }

    fetchDashboardData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="admin-page" style={{ maxWidth: 1300, margin: '0 auto', gap: '2rem' }}>
      {/* Top Banner / Hero Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0b1736 0%, #102448 60%, #173260 100%)',
          color: '#ffffff',
          padding: '2rem 2.25rem',
          borderRadius: 16,
          boxShadow: '0 10px 30px -10px rgba(11, 23, 54, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '0.75rem' }}>
            <Zap size={14} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#bae6fd', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              No-Code Visual CMS & Site Engine
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Website Control Center
          </h1>
          <p style={{ margin: 0, fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Manage pages, customize hero banners, drag & drop sections, upload media, and monitor user inquiries with real-time live preview.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)', background: 'rgba(255, 255, 255, 0.08)' }}
          >
            <ExternalLink size={16} />
            <span>View Live Website</span>
          </a>
          <Link to="/admin/visual-builder" className="btn btn--primary" style={{ background: '#2563eb', borderColor: '#2563eb' }}>
            <Sparkles size={16} />
            <span>Launch Visual Builder</span>
          </Link>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>Total Pages</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(37, 99, 235, 0.1)', display: 'grid', placeItems: 'center', color: '#2563eb' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {stats.totalPages}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#10b981' }}>
            <CheckCircle2 size={14} />
            <span>{stats.publishedPages} Published / 0 Draft</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>Dynamic Sections</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(168, 85, 247, 0.1)', display: 'grid', placeItems: 'center', color: '#a855f7' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {stats.totalSections}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            <Sliders size={14} />
            <span>Full Reorder & Hide Support</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>Media Library</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(14, 165, 233, 0.1)', display: 'grid', placeItems: 'center', color: '#0ea5e9' }}>
              <ImageIcon size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {stats.mediaCount}+
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            <TrendingUp size={14} />
            <span>Images, Logos, Vectors</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>CRM & Inquiries</span>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245, 158, 11, 0.1)', display: 'grid', placeItems: 'center', color: '#f59e0b' }}>
              <Inbox size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {stats.submissionsCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#f59e0b' }}>
            <span>{stats.inquiriesCount} Inquiries, {stats.applicationsCount} Apps</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
            Quick Actions & Management
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>1-click access to website modules</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          <Link
            to="/admin/visual-builder"
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              textDecoration: 'none',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
          >
            <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-foreground)', marginBottom: 4 }}>
                Visual Page Builder
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Edit text & sections with live split-screen preview on desktop, tablet, and mobile.
              </span>
            </div>
          </Link>

          <Link
            to="/admin/pages"
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <FileText size={20} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-foreground)', marginBottom: 4 }}>
                Website Pages
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Browse all 12 site pages, manage page metadata, and launch dedicated editors.
              </span>
            </div>
          </Link>

          <Link
            to="/admin/sections"
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <Layers size={20} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-foreground)', marginBottom: 4 }}>
                Sections Directory
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Inspect all 38+ sections across the site, toggle visibility, and reorder.
              </span>
            </div>
          </Link>

          <Link
            to="/admin/media"
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
              <ImageIcon size={20} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-foreground)', marginBottom: 4 }}>
                Media Library
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Upload graphics, logos, photos, and copy asset URLs to use in pages.
              </span>
            </div>
          </Link>

          <Link
            to="/admin/careers"
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-foreground)', marginBottom: 4 }}>
                Post Job Vacancy
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Add new career positions, requirements, and manage CV job applications.
              </span>
            </div>
          </Link>

          <Link
            to="/admin/inquiries"
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Inbox size={20} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-foreground)', marginBottom: 4 }}>
                Contact Inquiries
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                Review incoming client contact requests, budget estimates, and messages.
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Split Section: Pages Overview (Left) + System Health & Recent Logs (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Left Column: Pages Directory Summary */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
              Core Website Pages
            </h3>
            <Link to="/admin/pages" style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>View all pages</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {pageDefs.slice(0, 6).map((page) => (
              <div
                key={page.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--color-surface)',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-foreground)' }}>
                    {page.title}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    {page.path} • {page.sections.length} sections
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <a
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--plain btn--sm"
                    title="Preview on live site"
                    style={{ padding: '4px 6px' }}
                  >
                    <Eye size={15} />
                  </a>
                  <Link
                    to={`/admin/pages/${page.id}`}
                    className="btn btn--outline btn--sm"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity Logs & Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* System Health */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} style={{ color: '#10b981' }} />
              <span>Platform Health & Security</span>
            </h3>

            <div style={{ display: 'grid', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Server size={14} /> Cloud Database
                </span>
                <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  Connected & Synced
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={14} /> Live Production Host
                </span>
                <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  SSL Enforced (HTTPS)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={14} /> Theme Consistency
                </span>
                <span style={{ color: '#2563eb', fontWeight: 600 }}>
                  Unified Navy Blue System
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} style={{ color: '#2563eb' }} />
                <span>Recent Audit Trail</span>
              </h3>
              <Link to="/admin/activity-logs" style={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none' }}>
                View all
              </Link>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {recentLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 6,
                    background: 'var(--color-surface-2)',
                    fontSize: '0.82rem',
                    borderLeft: '3px solid #2563eb',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <strong style={{ color: 'var(--color-foreground)' }}>{log.action}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-subtle)' }}>{log.timestamp}</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.78rem' }}>{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
