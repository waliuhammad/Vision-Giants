import { getDb, isFirebaseConfigured } from '../config/firebase';
import { defaultContent, fromDoc, type ContentCollection, type SiteContent } from './schema';
import { pageTextsFromDoc, type PageTexts } from './pages';
import { aboutDataFromDoc } from './about';

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

  const load = async <K extends ContentCollection>(name: K): Promise<SiteContent[K]> => {
    const snap = await getDocs(query(collection(db, name), where('published', '==', true)));
    return snap.docs
      .map((d) => ({ order: Number(d.get('order')) || 0, item: fromDoc[name](d.id, d.data()) }))
      .sort((a, b) => a.order - b.order)
      .map((x) => x.item) as SiteContent[K];
  };
  const [services, projects, positions] = await Promise.all([load('services'), load('projects'), load('positions')]);
  return { services, projects, positions, about, pages };
}
