import { LazyMotion, MotionConfig } from 'motion/react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PageTransition } from '../components/animations/PageTransition';
import { AppRoutes } from './routes';

const loadFeatures = () => import('./motionFeatures').then((mod) => mod.default);

export function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
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
  );
}
