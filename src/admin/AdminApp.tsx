import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { isFirebaseConfigured } from '../config/firebase';
import { useAdminAuth, signOutAdmin } from './firebase';
import { LoginPage } from './LoginPage';
import { AdminLayout } from './AdminLayout';
import { SubmissionsPage } from './SubmissionsPage';
import { ContentPage } from './ContentPage';
import { inquiriesConfig, applicationsConfig } from './submissionsConfig';
import { projectsConfig, servicesConfig, positionsConfig } from './contentConfig';
import './admin.css';

export default function AdminApp() {
  useEffect(() => {
    document.title = 'Admin';
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <AdminMessage title="Firebase is not configured">
        Add the <code>VITE_FIREBASE_*</code> values to <code>.env.local</code> and rebuild. See README → Backend.
      </AdminMessage>
    );
  }
  return <AuthGate />;
}

function AuthGate() {
  const auth = useAdminAuth();

  if (auth.status === 'loading') return <div className="admin-boot">Loading…</div>;
  if (auth.status === 'error') return <AdminMessage title="Something went wrong">{auth.message}</AdminMessage>;
  if (auth.status === 'signed-out') return <LoginPage />;
  if (auth.status === 'forbidden') {
    return (
      <AdminMessage title="No admin access">
        <p>
          You’re signed in as <strong>{auth.user.email}</strong>, but this account isn’t an admin yet.
        </p>
        <p>
          To grant access, open Firebase console → Firestore and create a document in the <code>admins</code> collection
          with this document ID:
        </p>
        <p>
          <code className="admin-uid">{auth.user.uid}</code>
        </p>
        <p>Then reload this page.</p>
        <button type="button" className="btn btn--outline btn--sm" onClick={() => signOutAdmin()}>
          Sign out
        </button>
      </AdminMessage>
    );
  }

  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout user={auth.user} />}>
        <Route index element={<Navigate to="inquiries" replace />} />
        <Route path="inquiries" element={<SubmissionsPage key="inquiries" config={inquiriesConfig} />} />
        <Route path="applications" element={<SubmissionsPage key="applications" config={applicationsConfig} />} />
        <Route path="projects" element={<ContentPage key="projects" config={projectsConfig} />} />
        <Route path="services" element={<ContentPage key="services" config={servicesConfig} />} />
        <Route path="positions" element={<ContentPage key="positions" config={positionsConfig} />} />
        <Route path="*" element={<Navigate to="/admin/inquiries" replace />} />
      </Route>
    </Routes>
  );
}

function AdminMessage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="admin-center">
      <div className="card admin-message">
        <h1>{title}</h1>
        <div className="admin-message__body">{children}</div>
      </div>
    </div>
  );
}
