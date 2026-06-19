// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, Trash2 } from 'lucide-react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { updateUserProfile, addTask, getUserProfile } from '../lib/firestore';

const AuthContext = createContext(null);

// Demo user used when Firebase isn't configured
const DEMO_USER = {
  uid: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@taskflow.app',
  photoURL: null,
  isDemo: true,
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [pendingMigration, setPendingMigration] = useState(false);
  const [migrationUser, setMigrationUser] = useState(null);

  useEffect(() => {
    // Check if demo mode was previously activated
    const demo = localStorage.getItem('taskflow-demo') === 'true';
    if (demo) {
      setCurrentUser(DEMO_USER);
      setIsDemoMode(true);
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If user exists but is not verified, and it's a password account, don't log them in fully
      if (user && user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
        setCurrentUser(null);
      } else {
        // Check for demo data migration
        if (user && !isDemoMode) {
          const demoTasksStr = localStorage.getItem('taskflow-tasks');
          if (demoTasksStr) {
            try {
              const demoTasks = JSON.parse(demoTasksStr);
              if (demoTasks && demoTasks.length > 0) {
                setMigrationUser(user);
                setPendingMigration(true);
              }
            } catch (e) { console.error(e); }
          }
        }
        
        setCurrentUser(user);
        // Sync basic auth data to Firestore so other members can see their name/photo
        if (user && !isDemoMode) {
          updateUserProfile(user.uid, {
            displayName: user.displayName,
            photoURL: user.photoURL
          }).catch(console.error);
        }
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [isDemoMode]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  };

  const registerWithEmail = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      // We log them out immediately from Firebase so they must verify and log back in
      await firebaseSignOut(auth);
      return userCredential.user;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error('Please verify your email before logging in.');
      }
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const updateUserName = async (name) => {
    if (!currentUser) return;
    try {
      await updateProfile(currentUser, { displayName: name });
      setCurrentUser({ ...currentUser, displayName: name });
      if (!isDemoMode) {
        await updateUserProfile(currentUser.uid, { displayName: name });
      }
    } catch (err) {
      console.error('Update name error:', err);
      throw err;
    }
  };

  const updateUserPhoto = async (photoUrl) => {
    if (!currentUser) return;
    try {
      await updateProfile(currentUser, { photoURL: photoUrl });
      setCurrentUser({ ...currentUser, photoURL: photoUrl });
      if (!isDemoMode) {
        await updateUserProfile(currentUser.uid, { photoURL: photoUrl });
      }
    } catch (err) {
      console.error('Update photo error:', err);
      throw err;
    }
  };


  const enterDemoMode = () => {
    localStorage.setItem('taskflow-demo', 'true');
    setCurrentUser(DEMO_USER);
    setIsDemoMode(true);
  };

  const signOut = async () => {
    try {
      // Clear demo mode
      localStorage.removeItem('taskflow-demo');
      setIsDemoMode(false);
      setCurrentUser(null);
      // Also sign out of Firebase if applicable
      await firebaseSignOut(auth);
    } catch {
      // Firebase sign out may fail if not signed in — that's fine
      localStorage.removeItem('taskflow-demo');
      setIsDemoMode(false);
      setCurrentUser(null);
    }
  };

  const handleMigrateDemoData = async () => {
    if (!migrationUser) return;
    try {
      const demoTasksStr = localStorage.getItem('taskflow-tasks');
      const demoStatsStr = localStorage.getItem('taskflow-gamification');
      
      if (demoTasksStr) {
        const demoTasks = JSON.parse(demoTasksStr);
        for (const task of demoTasks) {
          const { id, ...taskData } = task; // Strip local ID
          await addTask(migrationUser.uid, taskData);
        }
      }

      if (demoStatsStr) {
        const demoStats = JSON.parse(demoStatsStr);
        const existingProfile = await getUserProfile(migrationUser.uid);
        
        await updateUserProfile(migrationUser.uid, {
          points: Math.max(existingProfile?.points || 0, demoStats.points || 0),
          streak: Math.max(existingProfile?.streak || 0, demoStats.streak || 0),
          flawlessDays: Math.max(existingProfile?.flawlessDays || 0, demoStats.flawlessDays || 0),
          shields: Math.max(existingProfile?.shields || 0, demoStats.shields || 0)
        });
      }

      localStorage.removeItem('taskflow-tasks');
      localStorage.removeItem('taskflow-gamification');
      localStorage.removeItem('taskflow-demo');
    } catch (err) {
      console.error('Migration failed:', err);
    } finally {
      setPendingMigration(false);
      setMigrationUser(null);
      window.location.reload(); // Reload to fetch fresh data via TaskContext
    }
  };

  const handleDiscardDemoData = () => {
    localStorage.removeItem('taskflow-tasks');
    localStorage.removeItem('taskflow-gamification');
    localStorage.removeItem('taskflow-demo');
    setPendingMigration(false);
    setMigrationUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        isDemoMode,
        signInWithGoogle,
        registerWithEmail,
        loginWithEmail,
        updateUserName,
        updateUserPhoto,
        enterDemoMode,
        signOut,
      }}
    >
      {children}
      
      <AnimatePresence>
        {pendingMigration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[var(--color-surface)] p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-[var(--color-mist)] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-high-bg)] text-[var(--color-high-dot)] flex items-center justify-center mb-4 mx-auto">
                <DownloadCloud size={24} />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-charcoal)] mb-2">Migrate Demo Data?</h2>
              <p className="text-sm text-[var(--color-smoke)] mb-8">
                We found tasks created during your offline demo session. Do you want to move them to your new cloud account?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleMigrateDemoData}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-smooth shadow-sm"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Yes, move my tasks
                </button>
                <button
                  onClick={handleDiscardDemoData}
                  className="w-full py-3 rounded-xl font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-smooth"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Trash2 size={16} /> No, discard them
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
