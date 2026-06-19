// src/pages/SettingsPage.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Bell, Shield, User, ChevronDown, BookOpen, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useGamification, getUserTitle } from '../context/GamificationContext';
import { useReview } from '../context/ReviewContext';
import { uploadAvatar } from '../lib/storage';
import ThemeSelector from '../components/settings/ThemeSelector';
import CustomThemeBuilder from '../components/settings/CustomThemeBuilder';

export default function SettingsPage() {
  const { currentUser, signOut, signInWithGoogle, isDemoMode, updateUserName } = useAuth();
  const { tasks } = useTasks();
  const { profile } = useGamification();
  const [notifications, setNotifications] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [themesExpanded, setThemesExpanded] = useState(false);
  const [showGamificationInfo, setShowGamificationInfo] = useState(false);
  const { autoPopupEnabled, toggleAutoPopup, setShowReviewModal } = useReview();

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;

  const [displayNameInput, setDisplayNameInput] = useState(currentUser?.displayName || '');
  const [photoUrlInput, setPhotoUrlInput] = useState(currentUser?.photoURL || '');

  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayNameInput(currentUser.displayName);
    }
    if (currentUser?.photoURL) {
      setPhotoUrlInput(currentUser.photoURL);
    }
  }, [currentUser?.displayName, currentUser?.photoURL]);

  const handleNameBlur = () => {
    if (displayNameInput.trim() !== currentUser?.displayName) {
      updateUserName(displayNameInput.trim());
    }
  };

  const handlePhotoBlur = () => {
    if (photoUrlInput.trim() !== currentUser?.photoURL) {
      updateUserPhoto(photoUrlInput.trim());
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Settings</h1>
        <p className="text-[var(--color-smoke)] text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* ── Profile Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface rounded-2xl shadow-card p-6 mb-4"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[var(--color-mist)]"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl ring-2 ring-[var(--color-mist)]"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
              style={{ backgroundColor: 'var(--color-low-dot)' }}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="Your Name"
              className="font-bold text-[var(--color-charcoal)] text-lg bg-transparent border-b border-transparent hover:border-[var(--color-mist)] focus:border-[var(--color-primary)] focus:outline-none transition-smooth px-1 -ml-1 w-full max-w-[200px]"
            />
            {profile?.streak > 0 && (
              <p className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-wide mt-0.5 mb-1">
                {getUserTitle(profile.streak)}
              </p>
            )}
            <p className="text-[var(--color-smoke)] text-sm">{currentUser?.email || 'Not signed in'}</p>
            <p
              className="text-xs font-medium mt-1"
              style={{ color: isDemoMode ? 'var(--color-medium-dot)' : 'var(--color-low-dot)' }}
            >
              {isDemoMode ? '⚡ Demo Mode' : 'Google Account'}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs font-bold text-[var(--color-smoke)] uppercase tracking-wider mb-2 block">Upload Profile Picture</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file || !currentUser || isDemoMode) return;
                
                try {
                  const url = await uploadAvatar(currentUser.uid, file);
                  await updateUserPhoto(url);
                } catch (err) {
                  console.error('Failed to upload avatar', err);
                  alert('Failed to upload image. Make sure Firebase Storage is enabled in your Firebase console!');
                }
              }}
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer px-4 py-2 bg-[var(--color-mist)] hover:bg-[var(--color-high-bg)] text-[var(--color-charcoal)] text-sm font-semibold rounded-lg transition-smooth border border-[var(--color-mist)]"
            >
              Choose Image
            </label>
            <span className="text-xs text-[var(--color-smoke)]">
              {isDemoMode ? "Unavailable in Demo Mode" : "Max size: 5MB"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Tasks', value: total },
            { label: 'Completed', value: completed },
            { label: 'Completion', value: `${total > 0 ? Math.round((completed / total) * 100) : 0}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-bg)] rounded-xl p-3 text-center">
              <p className="font-bold text-lg text-[var(--color-charcoal)]">{value}</p>
              <p className="text-[10px] text-[var(--color-smoke)] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Gamification Section ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
        className="surface rounded-2xl shadow-card p-6 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[var(--color-charcoal)] text-sm">Gamification Status</h3>
              <button
                onClick={() => setShowGamificationInfo(true)}
                className="text-[var(--color-smoke)] hover:text-[var(--color-primary)] transition-smooth"
                title="Gamification Rules"
              >
                <Info size={16} />
              </button>
            </div>
            <p className="text-xs text-[var(--color-smoke)] mt-0.5">Track your pace and consistency</p>
          </div>
          <Shield size={20} style={{ color: profile.shields > 0 ? 'var(--color-primary)' : 'var(--color-smoke)' }} />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-[var(--color-bg)] rounded-xl p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-lg text-[var(--color-primary)]">{profile.streak}🔥</p>
            <p className="text-[10px] font-semibold text-[var(--color-smoke)] mt-0.5">DAY STREAK</p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-lg text-[var(--color-charcoal)]">{profile.points}</p>
            <p className="text-[10px] font-semibold text-[var(--color-smoke)] mt-0.5">POINTS</p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-lg text-[var(--color-charcoal)]">{profile.flawlessDays}</p>
            <p className="text-[10px] font-semibold text-[var(--color-smoke)] mt-0.5">FLAWLESS</p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-lg text-[var(--color-charcoal)]">{profile.shields}/3</p>
            <p className="text-[10px] font-semibold text-[var(--color-smoke)] mt-0.5">SHIELDS</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayNameInput}
            onChange={(e) => setDisplayNameInput(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm placeholder:text-[var(--color-smoke)]/60 focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 transition-smooth"
            style={{
              borderColor: 'var(--color-mist)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          />
        </div>
      </motion.div>

      {/* ── Theme Section ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="surface rounded-2xl shadow-card mb-4 overflow-hidden"
      >
        <button
          onClick={() => setThemesExpanded(!themesExpanded)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-mist)]/30 transition-smooth"
        >
          <div>
            <h3 className="font-bold text-[var(--color-charcoal)] text-sm">Themes</h3>
            <p className="text-xs text-[var(--color-smoke)] mt-0.5">Pick a preset or build your own</p>
          </div>
          <motion.div animate={{ rotate: themesExpanded ? 180 : 0 }}>
            <ChevronDown size={18} className="text-[var(--color-smoke)]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {themesExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="px-5 pb-5 border-t border-[var(--color-mist)] pt-4">
                <ThemeSelector />
                <div className="mt-4">
                  <CustomThemeBuilder />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Preferences ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="surface rounded-2xl shadow-card divide-y divide-[var(--color-mist)] mb-4"
      >
        {/* Notifications */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Bell size={18} style={{ color: 'var(--color-medium-dot)' }} />
            <div>
              <p className="text-sm font-medium text-[var(--color-charcoal)]">Notifications</p>
              <p className="text-xs text-[var(--color-smoke)]">Due date reminders</p>
            </div>
          </div>
          <button
            id="notifications-toggle"
            onClick={() => setNotifications(!notifications)}
            className="relative w-12 h-6 rounded-full transition-smooth"
            style={{ backgroundColor: notifications ? 'var(--color-primary)' : 'var(--color-mist)' }}
          >
            <motion.div
              animate={{ x: notifications ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            />
          </button>
        </div>

        {/* Daily Review */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
            <div>
              <p className="text-sm font-medium text-[var(--color-charcoal)]">Evening Review Popup</p>
              <p className="text-xs text-[var(--color-smoke)]">Auto-prompt at 8 PM daily</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-mist)] text-[var(--color-smoke)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-smooth"
            >
              Open
            </button>
            <button
              id="review-popup-toggle"
              onClick={() => toggleAutoPopup(!autoPopupEnabled)}
              className="relative w-12 h-6 rounded-full transition-smooth"
              style={{ backgroundColor: autoPopupEnabled ? 'var(--color-primary)' : 'var(--color-mist)' }}
            >
              <motion.div
                animate={{ x: autoPopupEnabled ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              />
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-3 p-5">
          <Shield size={18} className="text-[var(--color-smoke)]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-charcoal)]">Privacy</p>
            <p className="text-xs text-[var(--color-smoke)]">Your data is stored securely</p>
          </div>
        </div>
      </motion.div>

      {/* ── Auth ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="surface rounded-2xl shadow-card p-5"
      >
        {currentUser ? (
          <motion.button
            id="signout-btn"
            onClick={handleSignOut}
            disabled={signingOut}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-smooth disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-high-bg)', color: 'var(--color-high)' }}
          >
            {signingOut ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-t-transparent rounded-full"
                style={{ borderColor: 'var(--color-high)' }}
              />
            ) : (
              <LogOut size={16} />
            )}
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </motion.button>
        ) : (
          <motion.button
            id="signin-btn"
            onClick={signInWithGoogle}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white text-sm font-semibold transition-smooth"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <User size={16} />
            Sign In with Google
          </motion.button>
        )}
      </motion.div>

      {/* Gamification Info Modal */}
      <AnimatePresence>
        {showGamificationInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGamificationInfo(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative surface p-6 rounded-2xl shadow-2xl max-w-md w-full border border-[var(--color-mist)] max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowGamificationInfo(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-smoke)] hover:bg-[var(--color-mist)] hover:text-[var(--color-charcoal)] transition-smooth"
              >
                <X size={18} />
              </button>
              
              <h2 className="text-xl font-bold text-[var(--color-charcoal)] mb-4 flex items-center gap-2">
                <Shield className="text-[var(--color-primary)]" size={24} /> Gamification Guide
              </h2>
              
              <div className="space-y-6 text-sm text-[var(--color-smoke)]">
                <div>
                  <h3 className="font-bold text-[var(--color-charcoal)] mb-2 uppercase text-xs tracking-wider">Metrics & Rules</h3>
                  <ul className="space-y-3">
                    <li><strong className="text-[var(--color-primary)]">Points:</strong> Earn 1 point for every task you complete. Earn 3 bonus points for a Flawless Day!</li>
                    <li><strong className="text-[var(--color-primary)]">Day Streak:</strong> Increases by 1 for every consecutive day you complete at least one task.</li>
                    <li><strong className="text-[var(--color-primary)]">Flawless Day:</strong> Awarded when you complete 100% of all tasks due on that day.</li>
                    <li><strong className="text-[var(--color-primary)]">Shields:</strong> You earn 1 shield for every 3 Flawless Days (max 3 shields). If you miss a day and break your streak, a shield will be consumed to protect your streak!</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[var(--color-charcoal)] mb-2 uppercase text-xs tracking-wider">Titles</h3>
                  <p className="mb-2">Your title automatically upgrades as your streak grows:</p>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-[var(--color-mist)] pb-1">
                      <span>The Catalyst</span> <span className="font-mono text-xs">0 - 2 Days</span>
                    </li>
                    <li className="flex justify-between border-b border-[var(--color-mist)] pb-1">
                      <span>Deep Worker</span> <span className="font-mono text-xs">3 - 6 Days</span>
                    </li>
                    <li className="flex justify-between border-b border-[var(--color-mist)] pb-1">
                      <span>Momentum Architect</span> <span className="font-mono text-xs">7 - 13 Days</span>
                    </li>
                    <li className="flex justify-between font-bold text-[var(--color-primary)]">
                      <span>Flawless Executor</span> <span className="font-mono text-xs">14+ Days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
