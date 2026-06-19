import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile, updateUserProfile } from '../lib/firestore';
import RewardModal from '../components/gamification/RewardModal';

const GamificationContext = createContext(null);

const DEFAULT_PROFILE = {
  points: 0,
  streak: 0,
  shields: 0,
  flawlessDays: 0,
  lastCheckDate: null,
};

export const getUserTitle = (streak) => {
  if (streak >= 14) return 'Flawless Executor';
  if (streak >= 7) return 'Momentum Architect';
  if (streak >= 3) return 'Deep Worker';
  return 'The Catalyst';
};

export function GamificationProvider({ children }) {
  const { currentUser, isDemoMode } = useAuth();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [showReward, setShowReward] = useState(false);
  const [rewardStreak, setRewardStreak] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) {
        setProfile(DEFAULT_PROFILE);
        return;
      }

      if (isDemoMode) {
        const saved = localStorage.getItem('taskflow-gamification');
        if (saved) setProfile(JSON.parse(saved));
        else setProfile(DEFAULT_PROFILE);
        return;
      }

      const userProfile = await getUserProfile(currentUser.uid);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setProfile(DEFAULT_PROFILE);
      }
    };
    loadProfile();
  }, [currentUser, isDemoMode]);

  const updateAndSave = (updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      if (isDemoMode) {
        localStorage.setItem('taskflow-gamification', JSON.stringify(next));
      } else if (currentUser) {
        updateUserProfile(currentUser.uid, updates).catch(console.error);
      }
      return next;
    });
  };

  const awardPoints = (pts) => {
    updateAndSave({ points: profile.points + pts });
  };

  const incrementStreak = () => {
    setProfile((prev) => {
      const newStreak = prev.streak + 1;
      if ([7, 14, 30].includes(newStreak)) {
        setRewardStreak(newStreak);
        setShowReward(true);
      }
      
      const next = { ...prev, streak: newStreak };
      if (isDemoMode) {
        localStorage.setItem('taskflow-gamification', JSON.stringify(next));
      } else if (currentUser) {
        updateUserProfile(currentUser.uid, { streak: newStreak }).catch(console.error);
      }
      return next;
    });
  };

  const awardFlawlessDay = () => {
    const newFlawless = profile.flawlessDays + 1;
    const updates = {
      points: profile.points + 3,
      flawlessDays: newFlawless,
    };
    if (newFlawless % 3 === 0) {
      updates.shields = Math.min(3, profile.shields + 1);
    }
    updateAndSave(updates);
  };

  const shatterShield = () => {
    if (profile.shields > 0) {
      updateAndSave({ shields: profile.shields - 1 });
      return true;
    }
    return false;
  };

  const resetStreak = () => {
    updateAndSave({ streak: 0 });
  };

  const updateAlias = (alias) => {
    updateAndSave({ alias });
  };

  const setLastCheckDate = (dateString) => {
    updateAndSave({ lastCheckDate: dateString });
  };

  return (
    <GamificationContext.Provider
      value={{
        profile,
        awardPoints,
        incrementStreak,
        awardFlawlessDay,
        shatterShield,
        resetStreak,
        updateAlias,
        setLastCheckDate,
      }}
    >
      {children}
      <RewardModal
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        streak={rewardStreak}
        alias={profile.alias}
      />
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
}
