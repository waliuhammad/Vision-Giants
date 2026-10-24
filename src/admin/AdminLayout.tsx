import { NavLink, Outlet } from 'react-router';
import type { User } from 'firebase/auth';
import { Inbox, FileUser, FolderKanban, Layers, Briefcase, LogOut, ExternalLink } from 'lucide-react';
import { company } from '../data/company';
import { signOutAdmin } from './firebase';

const nav = [
  { group: 'Submissions', items: [
    { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
    { to: '/admin/applications', label: 'Applications', icon: FileUser },
  ] },
  { group: 'Website content', items: [
    { to: '/admin/projects', label: 'Portfolio', icon: FolderKanban },
    { to: '/admin/services', label: 'Services', icon: Layers },
    { to: '/admin/positions', label: 'Open positions', icon: Briefcase },
  ] },
];

export function AdminLayout({ user }: { user: User }) {
  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <strong>{company.name}</strong>
          <span className="muted">Admin</span>
        </div>
        <nav aria-label="Admin">
          {nav.map((section) => (
            <div key={section.group} className="admin__nav-group">
              <p className="admin__nav-title">{section.group}</p>
              {section.items.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className="admin__nav-link">
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin__account">
          <a href="/" className="admin__nav-link" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={17} aria-hidden="true" />
            View website
          </a>
          <button type="button" className="admin__nav-link" onClick={() => signOutAdmin()}>
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
          <p className="admin__email" title={user.email ?? ''}>
            {user.email}
          </p>
        </div>
      </aside>
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}
