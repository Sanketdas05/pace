// src/components/ui/FAB.jsx
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAB({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-20 right-4 lg:hidden z-30 w-12 h-12 text-white rounded-2xl shadow-lg border border-white/20 flex items-center justify-center transition-transform"
      style={{ 
        backgroundColor: 'var(--color-btn-new-bg, var(--color-primary))',
        color: 'var(--color-btn-new-text, #ffffff)'
      }}
      aria-label="Create new task"
      title="Create new task"
    >
      <Plus size={22} strokeWidth={2.5} />
    </motion.button>
  );
}
