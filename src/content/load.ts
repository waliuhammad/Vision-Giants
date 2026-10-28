import { getDb, isFirebaseConfigured } from '../config/firebase';
import { defaultContent, fromDoc, profileFromDoc, type ContentCollection, type SiteContent } from './schema';

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

  // The profile is saved independently of the collections, so it's loaded either way. A failed
  // read (e.g. rules not deployed yet) keeps the built-in profile rather than breaking the build.
  const [config, profile] = await Promise.all([
    getDoc(doc(db, 'config', 'public')),
    getDoc(doc(db, 'pages', 'portfolio'))
      .then((snap) => (snap.exists() ? profileFromDoc(snap.data()) : defaultContent.profile))
      .catch(() => defaultContent.profile),
  ]);
  if (config.get('contentManaged') !== true) return { ...defaultContent, profile };

  const load = async <K extends ContentCollection>(name: K): Promise<SiteContent[K]> => {
    const snap = await getDocs(query(collection(db, name), where('published', '==', true)));
    return snap.docs
      .map((d) => ({ order: Number(d.get('order')) || 0, item: fromDoc[name](d.id, d.data()) }))
      .sort((a, b) => a.order - b.order)
      .map((x) => x.item) as SiteContent[K];
  };
  const [services, projects, positions] = await Promise.all([load('services'), load('projects'), load('positions')]);
  return { services, projects, positions, profile };
}
