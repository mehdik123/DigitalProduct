# Firebase setup (Auth + thin profiles)

Hybrid Athlete uses Firebase only for **accounts**. Workout sets and progressive overload stay on the device (`localStorage`).

## 1. Create a project

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Add project (Spark / free plan is enough)
3. Add a **Web** app and copy the config object

## 2. Enable Email/Password auth

Authentication → Sign-in method → **Email/Password** → Enable

(Optional) Google sign-in if you want `signInWithGoogle`.

## 3. Create Firestore

Build → Firestore Database → Create database → start in **production** mode, then paste these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Do **not** store workout sets in Firestore.

## 4. Wire the app

Copy `.env.example` → `.env` and fill:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Restart `npm run dev`.

## 5. Authorized domains

Authentication → Settings → Authorized domains: add `localhost` and your production host (e.g. Netlify / Vercel).
