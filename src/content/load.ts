import { getDb, isFirebaseConfigured } from '../config/firebase';
import { defaultContent, fromDoc, type SiteContent } from './schema';
import { pageTextsFromDoc, type PageTexts } from './pages';
import { aboutDataFromDoc } from './about';
import { servicesPageDataFromDoc } from './servicesPageData';
import type { Service } from '../data/services';
import type { Project } from '../data/portfolio';
import type { Position } from '../data/careers';
import type { ClientItem } from '../data/clients';
import type { Course, CourseCategory, Instructor } from '../data/courses';
import type { BlogPost } from '../data/blog';
import type { TeamMember } from '../data/team';
import type {
  GlobalSettings,
  NavigationSettings,
  HeaderFooterSettings,
  FaqItem,
  ProcessStepItem,
  TechnologiesContent,
  SeoSettings,
} from './cmsTypes';

/**
 * Loads published content from Firestore. Returns the built-in defaults when Firebase isn't
 * configured or content hasn't been imported yet.
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

  // Page text (the `pages` collection) and site_content are loaded independently of collections.
  const [pageDocs, globalSettingsSnap, navSnap, headerFooterSnap, techSnap, teamSnap, faqsProcessSnap, seoSnap] = await Promise.all([
    getDocs(collection(db, 'pages'))
      .then((snap) => snap.docs)
      .catch(() => []),
    getDoc(doc(db, 'site_content', 'global_settings')).catch(() => null),
    getDoc(doc(db, 'site_content', 'navigation')).catch(() => null),
    getDoc(doc(db, 'site_content', 'header_footer')).catch(() => null),
    getDoc(doc(db, 'site_content', 'technologies')).catch(() => null),
    getDoc(doc(db, 'site_content', 'team_members')).catch(() => null),
    getDoc(doc(db, 'site_content', 'faqs_process')).catch(() => null),
    getDoc(doc(db, 'site_content', 'seo_settings')).catch(() => null),
  ]);

  const aboutDoc = pageDocs.find((d) => d.id === 'about');
  const about = aboutDoc ? aboutDataFromDoc(aboutDoc.data()) : defaultContent.about;

  const servicesPageDoc = pageDocs.find((d) => d.id === 'services-page' || d.id === 'services');
  const servicesPage = servicesPageDoc ? servicesPageDataFromDoc(servicesPageDoc.data()) : defaultContent.servicesPage;

  const pages: PageTexts = Object.fromEntries(
    pageDocs
      .filter((d) => d.id !== 'portfolio')
      .map((d) => [d.id, pageTextsFromDoc(d.id, d.data())]),
  );

  const globalSettings: GlobalSettings = globalSettingsSnap && globalSettingsSnap.exists()
    ? (globalSettingsSnap.data() as GlobalSettings)
    : defaultContent.globalSettings;

  const navigation: NavigationSettings = navSnap && navSnap.exists()
    ? (navSnap.data() as NavigationSettings)
    : defaultContent.navigation;

  const headerFooter: HeaderFooterSettings = headerFooterSnap && headerFooterSnap.exists()
    ? (headerFooterSnap.data() as HeaderFooterSettings)
    : defaultContent.headerFooter;

  const technologiesContent: TechnologiesContent = techSnap && techSnap.exists()
    ? (techSnap.data() as TechnologiesContent)
    : defaultContent.technologiesContent;

  const rawTeamList: TeamMember[] = teamSnap && teamSnap.exists() && Array.isArray((teamSnap.data() as { list?: TeamMember[] }).list)
    ? (teamSnap.data() as { list: TeamMember[] }).list
    : (about.teamMembers && about.teamMembers.length > 0 ? about.teamMembers : defaultContent.teamMembers);

  const teamMembers: TeamMember[] = rawTeamList.map((m) => {
    const match = defaultContent.teamMembers.find(
      (dm) => dm.id === m.id || dm.name.toLowerCase().trim() === m.name.toLowerCase().trim()
    );
    return {
      ...m,
      image: m.image && !m.image.startsWith('data:') ? m.image : match?.image || m.image,
    };
  });

  const faqsProcessData = faqsProcessSnap && faqsProcessSnap.exists()
    ? (faqsProcessSnap.data() as { faqs?: FaqItem[]; processSteps?: ProcessStepItem[] })
    : null;

  const faqs: FaqItem[] = faqsProcessData?.faqs && faqsProcessData.faqs.length > 0
    ? faqsProcessData.faqs
    : defaultContent.faqs;

  const processSteps: ProcessStepItem[] = faqsProcessData?.processSteps && faqsProcessData.processSteps.length > 0
    ? faqsProcessData.processSteps
    : defaultContent.processSteps;

  const seo: SeoSettings = seoSnap && seoSnap.exists()
    ? (seoSnap.data() as SeoSettings)
    : defaultContent.seo;

  const loadPublished = async <T extends { id: string },>(name: 'services' | 'projects' | 'positions' | 'courses', fallback: T[]): Promise<T[]> => {
    try {
      const snap = await getDocs(query(collection(db, name), where('published', '==', true)));
      if (snap.empty) return fallback;
      const remote = snap.docs
        .map((d) => ({ order: Number(d.get('order') ?? d.get('displayOrder')) || 0, item: (fromDoc[name](d.id, d.data()) as unknown) as T }))
        .sort((a, b) => a.order - b.order)
        .map((x) => x.item);

      // Merge: Keep remote modifications, but preserve codebase defaults that haven't been saved to Firestore yet
      const remoteIds = new Set(remote.map((r) => r.id));
      const missingFromRemote = fallback.filter((f) => !remoteIds.has(f.id));
      if (name === 'projects' || name === 'courses') {
        // Default list items preserve their intended position (e.g. new projects & courses prioritized first)
        const combined = [...remote, ...missingFromRemote];
        const fallbackOrderMap = new Map(fallback.map((item, index) => [item.id, index]));
        combined.sort((a, b) => {
          const indexA = fallbackOrderMap.has(a.id) ? fallbackOrderMap.get(a.id)! : 9999;
          const indexB = fallbackOrderMap.has(b.id) ? fallbackOrderMap.get(b.id)! : 9999;
          return indexA - indexB;
        });
        return combined;
      }
      return [...remote, ...missingFromRemote];
    } catch {
      return fallback;
    }
  };

  const loadBlogPosts = async (): Promise<BlogPost[]> => {
    try {
      const snap = await getDocs(query(collection(db, 'blog_posts'), where('published', '==', true)));
      if (snap.empty) return defaultContent.blogPosts;
      return snap.docs
        .map((d) => {
          const data = d.data();
          const p: BlogPost = {
            id: d.id,
            slug: (data.slug as string) || d.id,
            title: (data.title as string) || '',
            excerpt: (data.excerpt as string) || '',
            category: (data.category as BlogPost['category']) || 'Web Development',
            date: (data.date as string) || '',
            readTime: (data.readTime as string) || '5 min read',
            imageUrl: (data.imageUrl as string) || '',
            featured: Boolean(data.featured),
            tags: Array.isArray(data.tags)
              ? data.tags
              : typeof data.tags === 'string'
                ? (data.tags as string).split(',').map((s) => s.trim()).filter(Boolean)
                : [],
            author: {
              name: (data.authorName as string) || 'Vision Giants Team',
              role: (data.authorRole as string) || 'Engineering',
              avatar: (data.authorAvatar as string) || '',
            },
            content: {
              lead: (data.contentLead as string) || '',
              sections: Array.isArray(data.sections) ? (data.sections as BlogPost['content']['sections']) : [],
              takeaways: Array.isArray(data.takeaways)
                ? (data.takeaways as string[])
                : typeof data.takeaways === 'string'
                  ? (data.takeaways as string).split('\n').map((s) => s.trim()).filter(Boolean)
                  : [],
            },
          };
          return { order: Number(data.order ?? 0), post: p };
        })
        .sort((a, b) => a.order - b.order)
        .map((x) => x.post);
    } catch {
      return defaultContent.blogPosts;
    }
  };

  const loadActive = async <T extends { id: string },>(name: 'clients' | 'course_categories', fallback: T[]): Promise<T[]> => {
    try {
      const snap = await getDocs(query(collection(db, name), where('active', '==', true)));
      if (snap.empty) return fallback;
      const remote = snap.docs
        .map((d) => ({ order: Number(d.get('order')) || 0, item: (fromDoc[name](d.id, d.data()) as unknown) as T }))
        .sort((a, b) => a.order - b.order)
        .map((x) => x.item);

      const remoteIds = new Set(remote.map((r) => r.id));
      const missingFromRemote = fallback.filter((f) => !remoteIds.has(f.id));
      return [...remote, ...missingFromRemote];
    } catch {
      return fallback;
    }
  };

  const loadInstructors = async (): Promise<Instructor[]> => {
    try {
      const snap = await getDocs(collection(db, 'instructors'));
      if (snap.empty) return defaultContent.instructors;
      return snap.docs.map((d) => fromDoc.instructors(d.id, d.data()));
    } catch {
      return defaultContent.instructors;
    }
  };

  const [services, projects, positions, courses, clients, categories, instructors, blogPostsList] = await Promise.all([
    loadPublished<Service>('services', defaultContent.services),
    loadPublished<Project>('projects', defaultContent.projects),
    loadPublished<Position>('positions', defaultContent.positions),
    loadPublished<Course>('courses', defaultContent.courses),
    loadActive<ClientItem>('clients', defaultContent.clients),
    loadActive<CourseCategory>('course_categories', defaultContent.categories),
    loadInstructors(),
    loadBlogPosts(),
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
    servicesPage,
    pages,
    globalSettings,
    navigation,
    headerFooter,
    technologiesContent,
    teamMembers,
    faqs,
    processSteps,
    blogPosts: blogPostsList.length > 0 ? blogPostsList : defaultContent.blogPosts,
    seo,
  };
}
