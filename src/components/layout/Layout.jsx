// src/components/layout/Layout.jsx
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import DailyReviewModal from '../review/DailyReviewModal';
import AIAssistant from '../ai/AIAssistant';
import { useReview } from '../../context/ReviewContext';
import { useAI } from '../../context/AIContext';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import GlobalNotificationListener from '../notifications/GlobalNotificationListener';

export default function Layout({ children }) {
  const { setShowReviewModal, todayReview } = useReview();
  const { open: aiOpen, setOpen: setAiOpen } = useAI();
  const location = useLocation();
  const isTasksPage = location.pathname === '/tasks';

  return (
    <div className="flex min-h-screen app-bg">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <GlobalNotificationListener />
      
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content — shifts left on desktop when AI panel is open */}
      <motion.main
        animate={{ marginRight: aiOpen ? '24rem' : '0rem' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 lg:ml-64 pb-20 lg:pb-0 overflow-y-auto min-h-screen"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </motion.main>

      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* ── Floating Action Buttons (Home page only) ─────────────── */}
      <AnimatePresence>
        {isTasksPage && (
          <>
            {/* DESKTOP: vertical pill toolbar on the right side */}
            <motion.div
              key="desktop-fab-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:flex flex-col gap-3 fixed right-6 top-1/2 -translate-y-1/2 z-40"
            >
              {/* Daily Review */}
              <motion.button
                onClick={() => setShowReviewModal(true)}
                whileHover={{ scale: 1.08, x: -4 }}
                whileTap={{ scale: 0.94 }}
                title="Daily Review"
                className="w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center border border-[var(--color-mist)] transition-smooth"
                style={{
                  backgroundColor: todayReview ? 'var(--color-low-bg)' : 'var(--color-bg)',
                  color: todayReview ? 'var(--color-low-dot)' : 'var(--color-primary)',
                }}
                aria-label="Open Daily Review"
              >
                <BookOpen size={20} />
              </motion.button>

              {/* AI Assistant — hidden when panel is open */}
              {!aiOpen && (
                <motion.button
                  onClick={() => setAiOpen(true)}
                  whileHover={{ scale: 1.08, x: -4 }}
                  whileTap={{ scale: 0.94 }}
                  title="Pace AI"
                  className="w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center transition-smooth"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-low-dot))' }}
                  aria-label="Open AI Assistant"
                >
                  <Sparkles size={20} className="text-white" />
                </motion.button>
              )}
            </motion.div>

            {/* MOBILE: stacked above bottom nav */}
            <motion.div
              key="mobile-fab-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="lg:hidden fixed right-5 bottom-24 z-40 flex flex-col gap-3 items-center"
            >
              {/* AI Assistant */}
              {!aiOpen && (
                <motion.button
                  onClick={() => setAiOpen(true)}
                  whileTap={{ scale: 0.94 }}
                  className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-low-dot))' }}
                  aria-label="Open AI Assistant"
                >
                  <Sparkles size={22} className="text-white" />
                </motion.button>
              )}

              {/* Daily Review */}
              <motion.button
                onClick={() => setShowReviewModal(true)}
                whileTap={{ scale: 0.94 }}
                className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center border border-[var(--color-mist)]"
                style={{
                  backgroundColor: todayReview ? 'var(--color-low-bg)' : 'var(--color-bg)',
                  color: todayReview ? 'var(--color-low-dot)' : 'var(--color-primary)',
                }}
                aria-label="Open Daily Review"
              >
                <BookOpen size={22} />
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals (always mounted so state persists) */}
      <DailyReviewModal />
      <AIAssistant />
    </div>
  );
}
