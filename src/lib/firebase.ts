import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

if (!firebaseConfigured) {
  console.error(
    '[firebase] Missing VITE_FIREBASE_* env vars. ' +
      'Copy .env.example → .env, paste your Firebase web app config, restart npm run dev. ' +
      'See firebase/SETUP.md'
  );
}

const app: FirebaseApp = getApps().length
  ? getApps()[0]!
  : initializeApp(
      firebaseConfigured
        ? firebaseConfig
        : {
            apiKey: 'demo',
            authDomain: 'demo.firebaseapp.com',
            projectId: 'demo',
            appId: 'demo',
          }
    );

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export { app };

/** Shared timeout helper (kept for signup UX). */
export class RequestTimeoutError extends Error {
  readonly name = 'RequestTimeoutError';
  constructor() {
    super('Request timed out. Check your connection and try again.');
  }
}

export function isTimeoutError(error: unknown): boolean {
  if (!error) return false;
  const e = error as { name?: string; message?: string; code?: string };
  return (
    e.name === 'RequestTimeoutError' ||
    e.name === 'AbortError' ||
    e.name === 'TimeoutError' ||
    e.code === 'auth/network-request-failed' ||
    /aborted|timed? ?out/i.test(e.message ?? '')
  );
}
