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
      className="fixed bottom-[14.5rem] right-5 lg:hidden z-30 w-14 h-14 text-white rounded-2xl shadow-fab flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <Plus size={24} strokeWidth={2.5} />
      {/* Optional ping effect */}
      <span className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ backgroundColor: 'var(--color-primary)' }} />
    </motion.button>
  );
}
