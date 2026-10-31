import { getDb, isFirebaseConfigured } from '../config/firebase';
import { defaultContent, fromDoc, type SiteContent } from './schema';
import { pageTextsFromDoc, type PageTexts } from './pages';
import { aboutDataFromDoc } from './about';
import type { ClientItem } from '../data/clients';
import type { Course, CourseCategory, Instructor } from '../data/courses';
import type { Service } from '../data/services';
import type { Project } from '../data/portfolio';
import type { Position } from '../data/careers';

/**
 * Loads published content from Firestore. Returns the built-in defaults when Firebase isn't
 * configured or content hasn't been imported yet (`config/public.contentManaged` is not true).
 *
 * Runs at build time (scripts/prerender.mjs, so pages are indexed with current content) and again
 * in the browser (so edits made in the dashboard appear without a rebuild).
 */
export async function loadContent(): Promise<SiteContent> {
  if (!isFirebaseConfigured) return defaultContent;
  const [db, { doc, getDoc, getDocs, collection, query, where }] = await Promise.all([
    getDb(),
    import('firebase/firestore/lite'),
  ]);

  // Page text (the `pages` collection) is loaded independently of the collections.
  const [config, pageDocs] = await Promise.all([
    getDoc(doc(db, 'config', 'public')),
    getDocs(collection(db, 'pages'))
      .then((snap) => snap.docs)
      .catch(() => []),
  ]);

  const aboutDoc = pageDocs.find((d) => d.id === 'about');
  const about = aboutDoc ? aboutDataFromDoc(aboutDoc.data()) : defaultContent.about;

  const pages: PageTexts = Object.fromEntries(
    pageDocs
      .filter((d) => d.id !== 'portfolio')
      .map((d) => [d.id, pageTextsFromDoc(d.id, d.data())]),
  );

  if (config.get('contentManaged') !== true) return { ...defaultContent, about, pages };

  const loadPublished = async (name: 'services' | 'projects' | 'positions' | 'courses') => {
    try {
      const snap = await getDocs(query(collection(db, name), where('published', '==', true)));
      if (snap.empty) return defaultContent[name];
      return snap.docs
        .map((d) => ({ order: Number(d.get('order') ?? d.get('displayOrder')) || 0, item: fromDoc[name](d.id, d.data()) }))
        .sort((a, b) => a.order - b.order)
        .map((x) => x.item);
    } catch {
      return defaultContent[name];
    }
  };

  const loadActive = async (name: 'clients' | 'course_categories') => {
    try {
      const snap = await getDocs(query(collection(db, name), where('active', '==', true)));
      if (snap.empty) return name === 'clients' ? defaultContent.clients : defaultContent.categories;
      return snap.docs
        .map((d) => ({ order: Number(d.get('order')) || 0, item: fromDoc[name](d.id, d.data()) }))
        .sort((a, b) => a.order - b.order)
        .map((x) => x.item);
    } catch {
      return name === 'clients' ? defaultContent.clients : defaultContent.categories;
    }
  };

  const loadInstructors = async () => {
    try {
      const snap = await getDocs(collection(db, 'instructors'));
      if (snap.empty) return defaultContent.instructors;
      return snap.docs.map((d) => fromDoc.instructors(d.id, d.data()));
    } catch {
      return defaultContent.instructors;
    }
  };

  const [services, projects, positions, courses, clients, categories, instructors] = await Promise.all([
    loadPublished('services') as Promise<Service[]>,
    loadPublished('projects') as Promise<Project[]>,
    loadPublished('positions') as Promise<Position[]>,
    loadPublished('courses') as Promise<Course[]>,
    loadActive('clients') as Promise<ClientItem[]>,
    loadActive('course_categories') as Promise<CourseCategory[]>,
    loadInstructors() as Promise<Instructor[]>,
  ]);

  return {
    services,
    projects,
    positions,
    courses: courses.length > 0 ? courses : defaultContent.courses,
    clients: clients.length > 0 ? clients : defaultContent.clients,
    categories: categories.length > 0 ? categories : defaultContent.categories,
    instructors: instructors.length > 0 ? instructors : defaultContent.instructors,
    about,
    pages,
  };
}
