/**
 * Firebase integration boundary.
 *
 * Firebase is loaded lazily (dynamic import) and only when every required VITE_FIREBASE_* variable
 * is present, so marketing pages stay static and unaffected. See README > Firebase setup and
 * firestore.rules for the required, write-only security rules.
 */
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

export interface InquiryPayload {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  consent: boolean;
}

/** Stores a contact inquiry in the Firestore `inquiries` collection. Throws if not configured. */
export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured');
  const [{ initializeApp, getApps }, { getFirestore, collection, addDoc, serverTimestamp }] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);
  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  await addDoc(collection(getFirestore(app), 'inquiries'), { ...payload, createdAt: serverTimestamp() });
}
