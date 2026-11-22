import { Routes, Route, Navigate } from 'react-router';
import HomePage from '../pages/HomePage';
import ServicesPage from '../pages/ServicesPage';
import ServiceDetailPage from '../pages/ServiceDetailPage';
import AboutPage from '../pages/AboutPage';
import TechnologiesPage from '../pages/TechnologiesPage';
import TeamPage from '../pages/TeamPage';
import BlogPage from '../pages/BlogPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import ContactPage from '../pages/ContactPage';
import CareersPage from '../pages/CareersPage';
import ApplyPage from '../pages/ApplyPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import PortfolioPage from '../pages/PortfolioPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';

/** Keep in sync with `pages` in src/config/seo.ts (used for prerendering and the sitemap). */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/" element={<ServicesPage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      {/* Redirect legacy wrong slugs to correct ones */}
      <Route path="/services/web-development" element={<Navigate to="/services/website-development/" replace />} />
      <Route path="/services/web-development/" element={<Navigate to="/services/website-development/" replace />} />
      <Route path="/services/e-commerce" element={<Navigate to="/services/ecommerce/" replace />} />
      <Route path="/services/e-commerce/" element={<Navigate to="/services/ecommerce/" replace />} />
      {/* Portfolio page */}
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/portfolio/" element={<PortfolioPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/technologies" element={<TechnologiesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/careers/apply" element={<ApplyPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:slug" element={<CourseDetailPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/privacy/" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/terms/" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
