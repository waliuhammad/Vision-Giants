/**
 * Firebase integration boundary.
 *
 * Firebase is loaded lazily (dynamic import) and only when every required VITE_FIREBASE_* variable
 * is present, so marketing pages stay static and unaffected. Public submissions go through Cloud
 * Functions (functions/src); see README > Backend for setup and firestore.rules / storage.rules.
 */
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore/lite';

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

/** Connects to the local Firebase emulators (`npm run emulators`) instead of the real project. */
export const useEmulators = env.VITE_FIREBASE_USE_EMULATORS === 'true';

/** Must match REGION in functions/src/options.ts. */
export const FUNCTIONS_REGION = 'us-central1';

let appPromise: Promise<FirebaseApp> | undefined;
export function getFirebaseApp(): Promise<FirebaseApp> {
  if (!isFirebaseConfigured) return Promise.reject(new Error('Firebase is not configured'));
  appPromise ??= import('firebase/app').then(({ initializeApp, getApps }) => getApps()[0] ?? initializeApp(firebaseConfig));
  return appPromise;
}

let dbPromise: Promise<Firestore> | undefined;
/** Firestore Lite (REST, no realtime listeners): small, and works in Node for prerendering. */
export function getDb(): Promise<Firestore> {
  dbPromise ??= Promise.all([getFirebaseApp(), import('firebase/firestore/lite')]).then(([app, fs]) => {
    const db = fs.getFirestore(app);
    if (useEmulators) fs.connectFirestoreEmulator(db, '127.0.0.1', 8080);
    return db;
  });
  return dbPromise;
}

/**
 * Saves a form submission straight to Firestore. The project is on the free Spark plan, where Cloud
 * Functions can't be deployed, so firestore.rules validates every field instead and lets visitors
 * only create new records (never read or change them).
 */
async function addSubmission(collectionName: 'inquiries' | 'applications' | 'enrollments', data: Record<string, unknown>): Promise<void> {
  const [db, { addDoc, collection, serverTimestamp }] = await Promise.all([getDb(), import('firebase/firestore/lite')]);
  await addDoc(collection(db, collectionName), {
    ...data,
    consent: true,
    status: 'new',
    notes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Error code from a failed callable (e.g. 'functions/resource-exhausted'), if any. */
export const errorCode = (err: unknown): string | undefined =>
  err && typeof err === 'object' && 'code' in err ? String(err.code) : undefined;

export interface InquiryPayload {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  consent: boolean;
}

/** Saves a contact inquiry; it appears under Admin → Inquiries. */
export function submitInquiry({ name, email, company, projectType, budget, message }: InquiryPayload): Promise<void> {
  return addSubmission('inquiries', { name, email, company, projectType, budget, message });
}

export interface ApplicationPayload {
  positionId: string;
  /** "General application" when no position is chosen. */
  positionTitle: string;
  name: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  linkedinUrl: string;
  message: string;
  consent: boolean;
  /** Shareable link to the CV or storage link. */
  cvUrl: string;
  department?: string;
  experience?: string;
  education?: string;
}

/** Saves a job application; it appears under Admin → Applications. */
export function submitApplication({ consent: _consent, ...application }: ApplicationPayload): Promise<void> {
  return addSubmission('applications', application);
}

export interface EnrollmentPayload {
  courseId: string;
  courseTitle: string;
  fullName: string;
  email: string;
  phone: string;
  learningMode: string;
  preferredBatch: string;
  city: string;
  education: string;
  message?: string;
  classTiming?: string;
  timeZone?: string;
  preferredCampus?: string;
  hybridPreference?: string;
  consent: boolean;
}

/** Saves a course enrollment application; it appears under Admin → Course Enrollments. */
export function submitEnrollment({ consent: _consent, ...enrollment }: EnrollmentPayload): Promise<void> {
  return addSubmission('enrollments', enrollment);
}
