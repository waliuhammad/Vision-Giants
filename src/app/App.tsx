import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router';
import { LazyMotion, MotionConfig } from 'motion/react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PageTransition } from '../components/animations/PageTransition';
import { ContentProvider } from '../content/ContentContext';
import type { SiteContent } from '../content/schema';
import { AppRoutes } from './routes';

const loadFeatures = () => import('./motionFeatures').then((mod) => mod.default);

/** The admin dashboard is client-only and loaded on demand, so it adds nothing to public pages. */
const AdminApp = lazy(() => import('../admin/AdminApp'));

export function App({ content }: { content: SiteContent }) {
  const { pathname } = useLocation();

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<div className="admin-boot">Loading…</div>}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <ContentProvider initial={content}>
      <LazyMotion features={loadFeatures} strict>
        {/* Animations always play, even when the OS asks for reduced motion (site owner preference). */}
        <MotionConfig reducedMotion="never">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Navbar />
          <PageTransition>
            <AppRoutes />
          </PageTransition>
          <Footer />
        </MotionConfig>
      </LazyMotion>
    </ContentProvider>
  );
}
