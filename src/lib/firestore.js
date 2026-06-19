// src/lib/firestore.js
// Firestore CRUD helpers for tasks and notes

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  or,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const getTasks = async (userId) => {
  try {
    const q = query(
      collection(db, 'tasks'),
      or(
        where('userId', '==', userId),
        where('members', 'array-contains', userId)
      ),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return [];
  }
};

export const addTask = async (userId, taskData) => {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...taskData,
    userId,
    members: [userId],
    type: taskData.type || 'individual',
    createdAt: serverTimestamp(),
    completed: false,
  });
  return docRef.id;
};

export const joinTask = async (taskId, userId) => {
  const ref = doc(db, 'tasks', taskId);
  // We do a blind update because security rules prevent reading unjoined tasks
  await updateDoc(ref, {
    members: arrayUnion(userId)
  });
};

export const leaveTask = async (taskId, userId) => {
  const ref = doc(db, 'tasks', taskId);
  await updateDoc(ref, {
    members: arrayRemove(userId)
  });
};

export const updateTask = async (taskId, updates) => {
  const ref = doc(db, 'tasks', taskId);
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
};

export const deleteTask = async (taskId) => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

// ─── Notes (Scratchpad) ───────────────────────────────────────────────────────

export const getNotes = async (userId) => {
  try {
    const ref = doc(db, 'notes', userId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().content || '' : '';
  } catch (err) {
    console.error('Error fetching notes:', err);
    return '';
  }
};

export const saveNotes = async (userId, content) => {
  const ref = doc(db, 'notes', userId);
  await setDoc(ref, { content, updatedAt: serverTimestamp() }, { merge: true });
};

// ─── Real-time Chat (Task Inbox) ───────────────────────────────────────────────

export const sendMessage = async (taskId, user, text) => {
  await addDoc(collection(db, 'tasks', taskId, 'messages'), {
    text,
    senderId: user.uid,
    senderName: user.displayName || 'User',
    senderPhoto: user.photoURL || '',
    timestamp: serverTimestamp(),
  });
};

export const subscribeToMessages = (taskId, callback) => {
  const q = query(
    collection(db, 'tasks', taskId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(msgs);
  });
};

// ─── User Profiles (Gamification & Settings) ──────────────────────────────────

export const getUserProfile = async (userId) => {
  try {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    
    const defaultProfile = {
      alias: '',
      points: 0,
      streak: 0,
      shields: 0,
      flawlessDays: 0,
      lastCheckDate: null,
    };

    if (snap.exists()) {
      const data = snap.data();
      // If the document was created by Auth sync, it might not have gamification stats yet
      if (data.points === undefined) {
        const mergedProfile = { ...defaultProfile, ...data };
        await setDoc(ref, mergedProfile, { merge: true });
        return mergedProfile;
      }
      return data;
    }
    
    // Create new profile if it doesn't exist
    await setDoc(ref, defaultProfile);
    return defaultProfile;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
};

export const updateUserProfile = async (userId, data) => {
  const ref = doc(db, 'users', userId);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};
