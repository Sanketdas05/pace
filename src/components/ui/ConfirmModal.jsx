import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmColor = 'var(--color-high-dot)' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="surface w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-500">
                <AlertTriangle size={20} />
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full text-[var(--color-smoke)] hover:bg-[var(--color-mist)] transition-smooth">
                <X size={16} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-[var(--color-charcoal)] mb-1.5">{title}</h3>
            <p className="text-sm text-[var(--color-smoke)] leading-relaxed mb-6">
              {message}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-smooth border border-[var(--color-mist)] text-[var(--color-charcoal)] hover:bg-[var(--color-mist)]/50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-smooth text-white shadow-sm hover:opacity-90"
                style={{ backgroundColor: confirmColor }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
