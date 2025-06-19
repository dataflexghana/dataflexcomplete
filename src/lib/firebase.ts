// This file is no longer the primary configuration for database and auth.
// It might be used if you still intend to use some Firebase services like Storage,
// but for Auth and Firestore database, we are moving to custom auth and Supabase.

// If you are COMPLETELY removing Firebase, you can delete this file.
// If you might use other Firebase services, keep it and initialize them here.

// For Supabase client initialization, see src/lib/supabase-client.ts (for frontend)
// and src/lib/supabase-server.ts (for backend API routes).

import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth'; // No longer for primary auth
// import { getFirestore } from 'firebase/firestore'; // No longer for primary DB
// import { getStorage } from 'firebase/storage'; // If you need Firebase Storage

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // Keep if using other Firebase services
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase IF you still need it for other services
let app;
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) { // Only initialize if config is present
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

// Export specific services if needed, e.g., const storage = getStorage(app);
// export { app, storage };
export { app }; // Export app if initialized, or undefined

// For Auth and Firestore, your app will now use custom logic + Supabase.
// The mock data in AuthProvider has been replaced by calls to API routes.
