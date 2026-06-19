// src/components/review/DailyReviewModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, AlertCircle, Target, Check } from 'lucide-react';
import { useReview } from '../../context/ReviewContext';

const questions = [
  {
    key: 'wentWell',
    icon: Star,
    label: 'What went well today?',
    placeholder: 'A win, big or small, counts...',
    color: 'var(--color-low-dot)',
    bg: 'var(--color-bg)',
  },
  {
    key: 'didntGo',
    icon: AlertCircle,
    label: "What didn't go well?",
    placeholder: 'Be honest — it helps you grow...',
    color: 'var(--color-medium-dot)',
    bg: 'var(--color-bg)',
  },
  {
    key: 'topPriority',
    icon: Target,
    label: 'Top priority for tomorrow?',
    placeholder: 'One clear focus for the day ahead...',
    color: 'var(--color-primary)',
    bg: 'var(--color-bg)',
  },
];

export default function DailyReviewModal() {
  const { showReviewModal, setShowReviewModal, saveReview, todayReview } = useReview();
  const [answers, setAnswers] = useState({ wentWell: '', didntGo: '', topPriority: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!answers.wentWell.trim() && !answers.didntGo.trim() && !answers.topPriority.trim()) return;
    setSaving(true);
    await saveReview(answers);
    setSaving(false);
  };

  const filled = Object.values(answers).some(v => v.trim());

  return (
    <AnimatePresence>
      {showReviewModal && (
        <motion.div
          key="review-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowReviewModal(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="relative surface rounded-3xl shadow-2xl max-w-md w-full border border-[var(--color-mist)] overflow-hidden"
          >
            {/* Header gradient bar */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-low-dot))' }} />

            <div className="p-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-[var(--color-smoke)] hover:bg-[var(--color-mist)] transition-smooth"
              >
                <X size={18} />
              </button>

              <div className="mb-5">
                <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-1">
                  Daily Review ✦ {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <h2 className="text-xl font-bold text-[var(--color-charcoal)]">
                  {todayReview ? "Today's Review" : "Reflect on your day"}
                </h2>
                <p className="text-sm text-[var(--color-smoke)] mt-1">
                  {todayReview ? "You've already completed today's review!" : "A few minutes of reflection builds lasting momentum."}
                </p>
              </div>

              {todayReview ? (
                // Read-only view if already filled
                <div className="space-y-3">
                  {questions.map(({ key, icon: Icon, label, color, bg }) => (
                    <div key={key} className="rounded-2xl p-4 border border-[var(--color-mist)]" style={{ backgroundColor: bg }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon size={14} style={{ color }} />
                        <p className="text-xs font-semibold" style={{ color }}>{label}</p>
                      </div>
                      <p className="text-sm text-[var(--color-charcoal)]">
                        {todayReview[key] || <span className="text-[var(--color-smoke)] italic">Not answered</span>}
                      </p>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="w-full py-3 rounded-xl text-sm font-semibold mt-2 transition-smooth"
                    style={{ backgroundColor: 'var(--color-mist)', color: 'var(--color-charcoal)' }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                // Input form
                <div className="space-y-3">
                  {questions.map(({ key, icon: Icon, label, placeholder, color, bg }) => (
                    <div key={key} className="rounded-2xl p-4 border border-[var(--color-mist)]" style={{ backgroundColor: bg }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={14} style={{ color }} />
                        <label className="text-xs font-semibold" style={{ color }}>{label}</label>
                      </div>
                      <textarea
                        value={answers[key]}
                        onChange={e => setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        rows={2}
                        className="w-full bg-transparent text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-smoke)]/60 resize-none focus:outline-none"
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleSave}
                    disabled={!filled || saving}
                    className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2 transition-smooth disabled:opacity-40"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
                  >
                    {saving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-t-transparent rounded-full border-white"
                      />
                    ) : (
                      <Check size={16} />
                    )}
                    {saving ? 'Saving...' : 'Save Review'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
