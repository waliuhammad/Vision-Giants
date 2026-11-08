import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { getAdminDb } from './firebase';
import { INITIAL_ACTIVITY_LOGS, type ActivityLogItem } from './activityLogger';

const firestore = () => import('firebase/firestore/lite');

export function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const [db, { collection, getDocs, orderBy, query, limit }] = await Promise.all([
        getAdminDb(),
        firestore(),
      ]);
      const snap = await getDocs(query(collection(db, 'activity_logs'), orderBy('createdAt', 'desc'), limit(50)));
      if (!snap.empty) {
        const fetched: ActivityLogItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            action: data.action || 'Activity',
            userEmail: data.userEmail || 'admin@visiongiants.com',
            category: data.category || 'system',
            details: data.details || '',
            timestamp: data.timestampStr || new Date().toLocaleString(),
          };
        });
        setLogs([...fetched, ...INITIAL_ACTIVITY_LOGS]);
      }
    } catch (err) {
      console.warn('Could not query Firestore activity_logs, showing default seed trail:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchQuery =
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        item.details.toLowerCase().includes(search.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [logs, categoryFilter, search]);

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vision-giants-activity-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'pages':
        return { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' };
      case 'sections':
        return { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' };
      case 'media':
        return { bg: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' };
      case 'careers':
        return { bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' };
      case 'settings':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      default:
        return { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b' };
    }
  };

  return (
    <div className="admin-page" style={{ maxWidth: 1250, margin: '0 auto', gap: '1.75rem' }}>
      {/* Header */}
      <div className="admin-page__head">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: '0.5rem' }}>
            <Clock size={13} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase' }}>
              Security & Audit Trail
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-foreground)' }}>
            Activity & Change Logs
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Comprehensive chronological history of edits, publishing events, media uploads, and settings updates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" onClick={loadLogs} className="btn btn--outline" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button type="button" onClick={exportLogsAsJson} className="btn btn--primary">
            <Download size={15} />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
              placeholder="Filter logs by keyword or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '2rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: 'var(--color-muted)' }} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
              style={{ minWidth: 150 }}
            >
              <option value="all">All Categories</option>
              <option value="pages">Pages</option>
              <option value="sections">Sections</option>
              <option value="media">Media</option>
              <option value="careers">Careers</option>
              <option value="settings">Settings</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
          Showing <strong>{filteredLogs.length}</strong> activity records
        </span>
      </div>

      {/* Logs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--color-foreground)' }}>Event / Action</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-foreground)' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-foreground)' }}>Administrator</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-foreground)' }}>Details & Changes</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--color-foreground)', textAlign: 'right' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const badge = getCategoryBadgeColor(log.category);
                return (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: badge.bg,
                          color: badge.color,
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--color-muted)', fontSize: '0.82rem' }}>
                      {log.userEmail}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--color-text)', maxWidth: 420 }}>
                      {log.details}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--color-subtle)', fontSize: '0.8rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
