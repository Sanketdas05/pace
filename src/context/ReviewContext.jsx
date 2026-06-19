// src/context/ReviewContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ReviewContext = createContext(null);

const getTodayKey = () => new Date().toISOString().split('T')[0];

export function ReviewProvider({ children }) {
  const { currentUser, isDemoMode } = useAuth();
  const [todayReview, setTodayReview] = useState(null); // null = not loaded yet
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [autoPopupEnabled, setAutoPopupEnabled] = useState(true);
  const [pastReviews, setPastReviews] = useState([]);

  // Load settings & today's review
  useEffect(() => {
    const savedPref = localStorage.getItem('pace-review-autopopup');
    if (savedPref !== null) setAutoPopupEnabled(JSON.parse(savedPref));
  }, []);

  useEffect(() => {
    const loadTodayReview = async () => {
      const key = getTodayKey();
      if (isDemoMode || !currentUser) {
        const saved = localStorage.getItem(`pace-review-${key}`);
        setTodayReview(saved ? JSON.parse(saved) : null);
        // load past reviews from localStorage
        const past = [];
        for (let i = 1; i <= 14; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const k = d.toISOString().split('T')[0];
          const r = localStorage.getItem(`pace-review-${k}`);
          if (r) past.push({ date: k, ...JSON.parse(r) });
        }
        setPastReviews(past);
        return;
      }
      try {
        const ref = doc(db, 'users', currentUser.uid, 'reviews', key);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setTodayReview(snap.data());
        } else {
          setTodayReview(null);
        }
        // Load past reviews
        const past = [];
        for (let i = 1; i <= 14; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const k = d.toISOString().split('T')[0];
          const rRef = doc(db, 'users', currentUser.uid, 'reviews', k);
          const rSnap = await getDoc(rRef);
          if (rSnap.exists()) past.push({ date: k, ...rSnap.data() });
        }
        setPastReviews(past);
      } catch {
        setTodayReview(null);
      }
    };
    loadTodayReview();
  }, [currentUser, isDemoMode]);

  // Auto-popup at 8 PM
  useEffect(() => {
    if (!autoPopupEnabled) return;

    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const todayKey = getTodayKey();
      const shownKey = `pace-review-shown-${todayKey}`;
      const alreadyShown = sessionStorage.getItem(shownKey);

      if (hour >= 20 && !alreadyShown && !todayReview) {
        setShowReviewModal(true);
        sessionStorage.setItem(shownKey, 'true');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, [autoPopupEnabled, todayReview]);

  const saveReview = useCallback(async (reviewData) => {
    const key = getTodayKey();
    const data = { ...reviewData, createdAt: new Date().toISOString() };

    if (isDemoMode || !currentUser) {
      localStorage.setItem(`pace-review-${key}`, JSON.stringify(data));
    } else {
      try {
        const ref = doc(db, 'users', currentUser.uid, 'reviews', key);
        await setDoc(ref, data);
      } catch (e) {
        console.error('Failed to save review', e);
      }
    }
    setTodayReview(data);
    setShowReviewModal(false);
  }, [currentUser, isDemoMode]);

  const toggleAutoPopup = (val) => {
    setAutoPopupEnabled(val);
    localStorage.setItem('pace-review-autopopup', JSON.stringify(val));
  };

  return (
    <ReviewContext.Provider value={{
      todayReview,
      showReviewModal,
      setShowReviewModal,
      saveReview,
      autoPopupEnabled,
      toggleAutoPopup,
      pastReviews,
    }}>
      {children}
    </ReviewContext.Provider>
  );
}

export const useReview = () => useContext(ReviewContext);
