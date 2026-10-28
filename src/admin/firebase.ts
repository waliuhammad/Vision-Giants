import { useEffect, useState } from 'react';
import type { Auth, User } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import { getDb, getFirebaseApp, useEmulators } from '../config/firebase';

let authPromise: Promise<Auth> | undefined;
export function getAdminAuth(): Promise<Auth> {
  authPromise ??= Promise.all([getFirebaseApp(), import('firebase/auth')]).then(([app, { getAuth, connectAuthEmulator }]) => {
    const auth = getAuth(app);
    if (useEmulators) connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    return auth;
  });
  return authPromise;
}

let storagePromise: Promise<FirebaseStorage> | undefined;
export function getAdminStorage(): Promise<FirebaseStorage> {
  storagePromise ??= Promise.all([getFirebaseApp(), import('firebase/storage')]).then(([app, { getStorage, connectStorageEmulator }]) => {
    const storage = getStorage(app);
    if (useEmulators) connectStorageEmulator(storage, '127.0.0.1', 9199);
    return storage;
  });
  return storagePromise;
}

/** Firestore for the dashboard. Auth is initialised first so requests carry the admin's token. */
export async function getAdminDb() {
  await getAdminAuth();
  return getDb();
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  /** Signed in, but the UID has no document in the `admins` collection. */
  | { status: 'forbidden'; user: User }
  | { status: 'admin'; user: User }
  | { status: 'error'; message: string };

async function isAdmin(user: User): Promise<boolean> {
  const [db, { doc, getDoc }] = await Promise.all([getAdminDb(), import('firebase/firestore/lite')]);
  return (await getDoc(doc(db, 'admins', user.uid))).exists();
}

export function useAdminAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    Promise.all([getAdminAuth(), import('firebase/auth')])
      .then(([auth, { onAuthStateChanged }]) => {
        if (cancelled) return;
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) return setState({ status: 'signed-out' });
          setState({ status: 'loading' });
          isAdmin(user)
            .then((ok) => setState(ok ? { status: 'admin', user } : { status: 'forbidden', user }))
            .catch((err) => setState({ status: 'error', message: String(err?.message ?? err) }));
        });
      })
      .catch((err) => setState({ status: 'error', message: String(err?.message ?? err) }));
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return state;
}

export async function signIn(email: string, password: string, username?: string) {
  const [auth, { signInWithEmailAndPassword, updateProfile }] = await Promise.all([
    getAdminAuth(),
    import('firebase/auth'),
  ]);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (username && !userCredential.user.displayName) {
    try {
      await updateProfile(userCredential.user, { displayName: username });
    } catch {
      // Non-critical if displayName update fails
    }
  }
}

export async function sendPasswordReset(email: string) {
  const [auth, { sendPasswordResetEmail }] = await Promise.all([getAdminAuth(), import('firebase/auth')]);
  await sendPasswordResetEmail(auth, email);
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  const [auth, { EmailAuthProvider, reauthenticateWithCredential, updatePassword }] = await Promise.all([
    getAdminAuth(),
    import('firebase/auth'),
  ]);
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No authenticated administrator session found. Please sign in again.');
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export async function updateAdminProfile(displayName: string): Promise<void> {
  const [auth, { updateProfile }] = await Promise.all([getAdminAuth(), import('firebase/auth')]);
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName });
  }
}

export async function signOutAdmin() {
  const [auth, { signOut }] = await Promise.all([getAdminAuth(), import('firebase/auth')]);
  await signOut(auth);
}
