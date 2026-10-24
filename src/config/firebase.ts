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

async function callFunction(name: string, data: unknown): Promise<void> {
  const [app, { getFunctions, httpsCallable, connectFunctionsEmulator }] = await Promise.all([
    getFirebaseApp(),
    import('firebase/functions'),
  ]);
  const functions = getFunctions(app, FUNCTIONS_REGION);
  if (useEmulators) connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  await httpsCallable(functions, name)(data);
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

/** Sends a contact inquiry to the `submitInquiry` Cloud Function. */
export function submitInquiry(payload: InquiryPayload): Promise<void> {
  return callFunction('submitInquiry', payload);
}

export interface ApplicationPayload {
  positionId: string;
  name: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  linkedinUrl: string;
  message: string;
  consent: boolean;
  /** CV file name and base64-encoded contents. */
  cv: { name: string; data: string };
}

/** Sends a job application (including the CV) to the `submitApplication` Cloud Function. */
export function submitApplication(payload: ApplicationPayload): Promise<void> {
  return callFunction('submitApplication', payload);
}
