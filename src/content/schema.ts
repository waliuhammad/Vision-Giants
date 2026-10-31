import { services, serviceIcons, type Service, type ServiceIconName } from '../data/services';
import { projects, categoryLabels, previewKinds, type Project, type ProjectCategory, type PreviewKind } from '../data/portfolio';
import { openPositions, type Position } from '../data/careers';
import { defaultClients, type ClientItem } from '../data/clients';
import {
  defaultCourses,
  defaultCourseCategories,
  defaultInstructors,
  type Course,
  type CourseCategory,
  type Instructor,
  type CourseModule,
  type CourseFaq,
} from '../data/courses';
import type { PageTexts } from './pages';
import { defaultAboutData, type AboutPageData } from './about';

/** Content that can be managed from the admin dashboard. */
export interface SiteContent {
  services: Service[];
  projects: Project[];
  positions: Position[];
  clients: ClientItem[];
  courses: Course[];
  categories: CourseCategory[];
  instructors: Instructor[];
  /** Dedicated About Us page data model with full section management & team CRUD. */
  about: AboutPageData;
  /** Edited page text from Admin → Site pages; missing fields use the defaults in ./pages.ts. */
  pages: PageTexts;
}

/** Built-in content from src/data, used until content is imported into Firestore. */
export const defaultContent: SiteContent = {
  services,
  projects,
  positions: openPositions,
  clients: defaultClients,
  courses: defaultCourses,
  categories: defaultCourseCategories,
  instructors: defaultInstructors,
  about: defaultAboutData,
  pages: {},
};

export type ContentCollection = 'services' | 'projects' | 'positions' | 'clients' | 'courses' | 'course_categories' | 'instructors';

type Data = Record<string, unknown>;

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown, fallback = 0) => (typeof v === 'number' ? v : Number(v) || fallback);
const bool = (v: unknown, fallback = false) => (typeof v === 'boolean' ? v : fallback);
const strList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

/**
 * Convert Firestore documents to typed content. Only known fields are copied, so the result is
 * plain JSON (safe to embed in prerendered pages) and unexpected data can't break rendering.
 */
export const fromDoc = {
  services: (id: string, d: Data): Service => ({
    id,
    title: str(d.title),
    short: str(d.short),
    description: str(d.description),
    deliverables: strList(d.deliverables),
    icon: oneOf(d.icon, Object.keys(serviceIcons) as ServiceIconName[], 'code'),
  }),
  projects: (id: string, d: Data): Project => ({
    id,
    title: str(d.title),
    category: oneOf(d.category, Object.keys(categoryLabels) as ProjectCategory[], 'web'),
    ...(str(d.industry) ? { industry: str(d.industry) } : {}),
    summary: str(d.summary),
    details: str(d.details),
    features: strList(d.features),
    tech: strList(d.tech),
    ...(str(d.url) ? { url: str(d.url) } : {}),
    ...(strList(d.images).length ? { images: strList(d.images) } : {}),
    preview: oneOf<PreviewKind>(d.preview, previewKinds, 'dashboard'),
    ...(str(d.imageUrl) ? { imageUrl: str(d.imageUrl) } : {}),
    isDemo: d.isDemo === true,
  }),
  positions: (id: string, d: Data): Position => ({
    id,
    title: str(d.title),
    department: str(d.department) || 'Engineering',
    type: str(d.type) || 'Full-Time',
    location: str(d.location) || 'Lahore, Pakistan',
    workArrangement: str(d.workArrangement) || 'Hybrid',
    experience: str(d.experience) || 'Mid-Level',
    summary: str(d.summary),
    description: str(d.description),
    responsibilities: strList(d.responsibilities),
    skills: strList(d.skills),
    qualifications: strList(d.qualifications),
    deadline: str(d.deadline),
    salaryRange: str(d.salaryRange),
    applicationInstructions: str(d.applicationInstructions),
    published: d.published !== false,
    order: num(d.order, 0),
    isInternship: bool(d.isInternship, false),
  }),
  clients: (id: string, d: Data): ClientItem => ({
    id,
    name: str(d.name),
    logo: str(d.logo),
    industry: str(d.industry) || 'Technology',
    description: str(d.description),
    websiteUrl: str(d.websiteUrl),
    order: num(d.order, 0),
    active: d.active !== false,
  }),
  courses: (id: string, d: Data): Course => {
    const rawModes = (d.modes && typeof d.modes === 'object' ? d.modes : {}) as Record<string, unknown>;
    const online = (rawModes.online && typeof rawModes.online === 'object' ? rawModes.online : {}) as Record<string, unknown>;
    const onsite = (rawModes.onsite && typeof rawModes.onsite === 'object' ? rawModes.onsite : {}) as Record<string, unknown>;
    const hybrid = (rawModes.hybrid && typeof rawModes.hybrid === 'object' ? rawModes.hybrid : {}) as Record<string, unknown>;
    const selfPaced = (rawModes.selfPaced && typeof rawModes.selfPaced === 'object' ? rawModes.selfPaced : {}) as Record<string, unknown>;

    const modules: CourseModule[] = Array.isArray(d.modules)
      ? d.modules.map((m, i) => {
          const mod = (m && typeof m === 'object' ? m : {}) as Record<string, unknown>;
          return {
            id: str(mod.id) || `m-${i}`,
            title: str(mod.title),
            description: str(mod.description),
            lessons: strList(mod.lessons),
          };
        })
      : [];

    const faqs: CourseFaq[] = Array.isArray(d.faqs)
      ? d.faqs.map((f) => {
          const faq = (f && typeof f === 'object' ? f : {}) as Record<string, unknown>;
          return {
            question: str(faq.question),
            answer: str(faq.answer),
          };
        })
      : [];

    return {
      id,
      slug: str(d.slug) || id,
      title: str(d.title),
      introduction: str(d.introduction),
      description: str(d.description),
      thumbnail: str(d.thumbnail),
      category: str(d.category) || 'Development',
      skillLevel: oneOf(str(d.skillLevel), ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const, 'Beginner'),
      duration: str(d.duration) || '12 Weeks',
      prerequisites: strList(d.prerequisites),
      learningOutcomes: strList(d.learningOutcomes),
      modules,
      instructorId: str(d.instructorId),
      practicalProjects: strList(d.practicalProjects),
      certificateOffered: d.certificateOffered !== false,
      certificateDetails: str(d.certificateDetails),
      faqs,
      displayOrder: num(d.displayOrder, 0),
      published: d.published !== false,
      modes: {
        online: {
          enabled: bool(online.enabled, true),
          fee: str(online.fee),
          schedule: str(online.schedule),
          timings: str(online.timings),
          timeZone: str(online.timeZone),
          platform: str(online.platform),
          format: oneOf(str(online.format), ['live', 'recorded', 'both'] as const, 'live'),
        },
        onsite: {
          enabled: bool(onsite.enabled, false),
          fee: str(onsite.fee),
          schedule: str(onsite.schedule),
          timings: str(onsite.timings),
          campusName: str(onsite.campusName),
          campusAddress: str(onsite.campusAddress),
          city: str(onsite.city),
          availableSeats: num(onsite.availableSeats, 20),
        },
        hybrid: {
          enabled: bool(hybrid.enabled, false),
          fee: str(hybrid.fee),
          schedule: str(hybrid.schedule),
          onlineSchedule: str(hybrid.onlineSchedule),
          onsiteSchedule: str(hybrid.onsiteSchedule),
          campusLocation: str(hybrid.campusLocation),
          sessionBreakdown: str(hybrid.sessionBreakdown),
        },
        selfPaced: {
          enabled: bool(selfPaced.enabled, false),
          fee: str(selfPaced.fee),
          accessDuration: str(selfPaced.accessDuration),
          recordedLessonsCount: num(selfPaced.recordedLessonsCount, 0),
          learningResources: str(selfPaced.learningResources),
          assessmentDetails: str(selfPaced.assessmentDetails),
        },
      },
    };
  },
  course_categories: (id: string, d: Data): CourseCategory => ({
    id,
    name: str(d.name),
    slug: str(d.slug) || id,
    description: str(d.description),
    icon: str(d.icon),
    imageUrl: str(d.imageUrl),
    order: num(d.order, 0),
    active: d.active !== false,
  }),
  instructors: (id: string, d: Data): Instructor => ({
    id,
    name: str(d.name),
    photo: str(d.photo),
    designation: str(d.designation),
    experience: str(d.experience),
    skills: strList(d.skills),
    bio: str(d.bio),
    linkedinUrl: str(d.linkedinUrl),
    email: str(d.email),
  }),
} satisfies { [K in ContentCollection]: (id: string, d: Data) => unknown };
