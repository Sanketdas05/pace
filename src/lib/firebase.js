// src/lib/firebase.js
// Replace the firebaseConfig values below with your own Firebase project config.
// Get these from: Firebase Console → Project Settings → Your Apps → SDK setup

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD38bS8yTU8IQN2FbtMBryjwoXnQ6yr1A8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pace-manager.web.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "premium-task-manager-617ea",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "premium-task-manager-617ea.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "650631837971",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:650631837971:web:2b9d949e43881dbacc02e6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4L9V1GBKX2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Initialize Firestore with offline persistence enabled
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
export const storage = getStorage(app);

//For Analytics
export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((err) => console.error("Analytics failed to load:", err));

// Helper function for Google Login
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; // Returns user profile info
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Helper function for Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
export default app;
