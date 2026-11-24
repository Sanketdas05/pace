// src/pages/SettingsPage.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Bell, Shield, User, ChevronDown, BookOpen, Info, X, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useGamification, getUserTitle } from '../context/GamificationContext';
import { useReview } from '../context/ReviewContext';
import { uploadAvatar } from '../lib/storage';
import ThemeSelector from '../components/settings/ThemeSelector';
import CustomThemeBuilder from '../components/settings/CustomThemeBuilder';
import { useNotifications } from '../context/NotificationContext';

export default function SettingsPage() {
  const { currentUser, signOut, signInWithGoogle, isDemoMode, updateUserName, updateUserPhoto } = useAuth();
  const { tasks } = useTasks();
  const { profile } = useGamification();
  const { toastPopupsEnabled, setToastPopupsEnabled } = useNotifications();
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
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef(null);

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
    <div className="pb-36 sm:pb-28 md:pb-16 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-charcoal)] tracking-tight">Settings</h1>
        <p className="text-[var(--color-smoke)] text-xs sm:text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* ── Profile Card ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface rounded-2xl shadow-card p-5 sm:p-6 mb-4"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="relative shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-[var(--color-mist)]"
              />
            ) : (
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl ring-2 ring-[var(--color-mist)]"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white"
              style={{ backgroundColor: 'var(--color-low-dot)' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 group max-w-[260px]">
              <input
                ref={nameInputRef}
                type="text"
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                onFocus={() => setIsEditingName(true)}
                onBlur={() => {
                  setIsEditingName(false);
                  handleNameBlur();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    nameInputRef.current?.blur();
                  }
                }}
                placeholder="Your Name"
                className="font-bold text-[var(--color-charcoal)] text-base sm:text-lg bg-transparent border-b border-transparent hover:border-[var(--color-mist)] focus:border-[var(--color-primary)] focus:outline-none transition-smooth px-0.5 -ml-0.5 min-w-0 flex-1 truncate cursor-pointer focus:cursor-text"
                title="Click to edit your display name"
              />
              <button
                type="button"
                onClick={() => nameInputRef.current?.focus()}
                className={`p-1.5 rounded-lg text-[var(--color-smoke)] hover:text-[var(--color-primary)] hover:bg-[var(--color-mist)]/50 transition-colors shrink-0 ${
                  isEditingName ? 'text-[var(--color-primary)] opacity-100 bg-[var(--color-mist)]/30' : 'opacity-60 group-hover:opacity-100'
                }`}
                title="Edit name"
                aria-label="Edit name"
              >
                <Pencil size={14} />
              </button>
            </div>
            {profile?.streak > 0 && (
              <p className="text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-wide mt-0.5 mb-1">
                {getUserTitle(profile.streak)}
              </p>
            )}
            <p className="text-[var(--color-smoke)] text-xs truncate">{currentUser?.email || 'Not signed in'}</p>
            <div className="mt-1">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: isDemoMode ? 'var(--color-medium-bg, rgba(245, 158, 11, 0.12))' : 'var(--color-low-bg, rgba(16, 185, 129, 0.12))',
                  color: isDemoMode ? 'var(--color-medium-dot, #d97706)' : 'var(--color-low-dot, #059669)'
                }}
              >
                {isDemoMode ? '⚡ Demo Mode' : '✓ Google Account'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-5 p-3 rounded-xl bg-[var(--color-bg)]/60 border border-[var(--color-mist)] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--color-charcoal)]">Profile Photo</p>
            <p className="text-[11px] text-[var(--color-smoke)] mt-0.5">
              {isDemoMode ? "Unavailable in Demo Mode" : "JPG, PNG or WebP · Max 5MB"}
            </p>
          </div>
          <div className="shrink-0">
            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              disabled={isDemoMode}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
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
              htmlFor={isDemoMode ? undefined : "avatar-upload"}
              className={`inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-smooth whitespace-nowrap select-none ${
                isDemoMode
                  ? "bg-[var(--color-mist)]/50 text-[var(--color-smoke)] cursor-not-allowed opacity-60"
                  : "cursor-pointer bg-[var(--color-mist)] hover:bg-[var(--color-mist)]/80 text-[var(--color-charcoal)] active:scale-95"
              }`}
            >
              Choose Image
            </label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'Total Tasks', value: total },
            { label: 'Completed', value: completed },
            { label: 'Completion', value: `${total > 0 ? Math.round((completed / total) * 100) : 0}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-bg)] rounded-xl py-2.5 px-2 sm:p-3 text-center border border-[var(--color-mist)]/60">
              <p className="font-bold text-base sm:text-lg text-[var(--color-charcoal)] leading-none">{value}</p>
              <p className="text-[10px] sm:text-xs text-[var(--color-smoke)] font-medium mt-1 truncate">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Gamification Section ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
        className="surface rounded-2xl shadow-card p-5 sm:p-6 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[var(--color-charcoal)] text-sm">Gamification Status</h3>
              <button
                onClick={() => setShowGamificationInfo(true)}
                className="text-[var(--color-smoke)] hover:text-[var(--color-primary)] p-0.5 rounded transition-smooth"
                title="Gamification Rules"
                aria-label="Gamification Rules"
              >
                <Info size={15} />
              </button>
            </div>
            <p className="text-xs text-[var(--color-smoke)] mt-0.5">Track your pace and consistency</p>
          </div>
          <Shield size={20} style={{ color: profile.shields > 0 ? 'var(--color-primary)' : 'var(--color-smoke)' }} />
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
          <div className="bg-[var(--color-bg)] rounded-xl py-2.5 px-1 sm:p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-base sm:text-lg text-[var(--color-primary)] leading-tight flex items-center justify-center gap-0.5">
              {profile.streak}<span className="text-sm">🔥</span>
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-[var(--color-smoke)] mt-1 tracking-tight uppercase truncate">
              Day Streak
            </p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl py-2.5 px-1 sm:p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-base sm:text-lg text-[var(--color-charcoal)] leading-tight">
              {profile.points}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-[var(--color-smoke)] mt-1 tracking-tight uppercase truncate">
              Points
            </p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl py-2.5 px-1 sm:p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-base sm:text-lg text-[var(--color-charcoal)] leading-tight">
              {profile.flawlessDays}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-[var(--color-smoke)] mt-1 tracking-tight uppercase truncate">
              Flawless
            </p>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl py-2.5 px-1 sm:p-3 text-center border border-[var(--color-mist)]">
            <p className="font-bold text-base sm:text-lg text-[var(--color-charcoal)] leading-tight">
              {profile.shields}/3
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-[var(--color-smoke)] mt-1 tracking-tight uppercase truncate">
              Shields
            </p>
          </div>
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
        {/* In-App Deadline Popups */}
        <div className="flex items-center justify-between p-4 sm:p-5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-medium-bg,rgba(245,158,11,0.12))] flex items-center justify-center shrink-0">
              <Bell size={16} style={{ color: 'var(--color-medium-dot)' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-charcoal)]">In-App Pop-up Banners</p>
              <p className="text-xs text-[var(--color-smoke)] line-clamp-2">
                {toastPopupsEnabled 
                  ? 'Showing brief alerts on deadlines' 
                  : 'Calm mode — quiet badges, zero intrusive pop-ups (Recommended)'}
              </p>
            </div>
          </div>
          <button
            id="notifications-toggle"
            onClick={() => setToastPopupsEnabled(!toastPopupsEnabled)}
            className="relative w-11 h-6 rounded-full transition-smooth shrink-0"
            style={{ backgroundColor: toastPopupsEnabled ? 'var(--color-primary)' : 'var(--color-mist)' }}
            aria-label="Toggle in-app banners"
          >
            <motion.div
              animate={{ x: toastPopupsEnabled ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            />
          </button>
        </div>

        {/* Daily Review */}
        <div className="flex items-center justify-between p-4 sm:p-5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
              <BookOpen size={16} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-charcoal)]">Evening Review Prompt</p>
              <p className="text-xs text-[var(--color-smoke)]">Auto-prompt at 8 PM daily</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-xs px-2.5 py-1.5 font-medium rounded-lg border border-[var(--color-mist)] text-[var(--color-smoke)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-smooth active:scale-95"
            >
              Open
            </button>
            <button
              id="review-popup-toggle"
              onClick={() => toggleAutoPopup(!autoPopupEnabled)}
              className="relative w-11 h-6 rounded-full transition-smooth shrink-0"
              style={{ backgroundColor: autoPopupEnabled ? 'var(--color-primary)' : 'var(--color-mist)' }}
              aria-label="Toggle daily review popup"
            >
              <motion.div
                animate={{ x: autoPopupEnabled ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              />
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-3 p-4 sm:p-5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-mist)]/60 flex items-center justify-center shrink-0">
            <Shield size={16} className="text-[var(--color-smoke)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-charcoal)]">Privacy & Security</p>
            <p className="text-xs text-[var(--color-smoke)]">Your data is stored securely in Firebase & local encrypted storage</p>
          </div>
        </div>
      </motion.div>

      {/* ── Auth ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="surface rounded-2xl shadow-card p-4 sm:p-5 mb-8"
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
