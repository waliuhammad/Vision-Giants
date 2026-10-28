import { Routes, Route } from 'react-router';
import HomePage from '../pages/HomePage';
import ServicesPage from '../pages/ServicesPage';
import ServiceDetailPage from '../pages/ServiceDetailPage';
import PortfolioPage from '../pages/PortfolioPage';
import AboutPage from '../pages/AboutPage';
import TechnologiesPage from '../pages/TechnologiesPage';
import TeamPage from '../pages/TeamPage';
import BlogPage from '../pages/BlogPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import ContactPage from '../pages/ContactPage';
import CareersPage from '../pages/CareersPage';
import ApplyPage from '../pages/ApplyPage';
import NotFoundPage from '../pages/NotFoundPage';

/** Keep in sync with `pages` in src/config/seo.ts (used for prerendering and the sitemap). */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/technologies" element={<TechnologiesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/careers/apply" element={<ApplyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}