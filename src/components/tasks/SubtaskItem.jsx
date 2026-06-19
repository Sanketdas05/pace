// src/components/tasks/SubtaskItem.jsx
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function SubtaskItem({ subtask, onToggle }) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 py-1.5"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggle?.(subtask.id); }}
        className="relative w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-smooth"
        style={{
          backgroundColor: subtask.done ? 'var(--color-primary)' : 'var(--color-bg)',
          borderColor: subtask.done ? 'var(--color-primary)' : 'var(--color-mist)',
          borderWidth: '2px',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: subtask.done ? 1 : 0 }}
          className="text-white"
        >
          <Check size={12} strokeWidth={3} />
        </motion.div>
      </button>
      <span
        className={`text-sm transition-smooth ${
          subtask.done
            ? 'line-through text-[var(--color-smoke)]'
            : 'text-[var(--color-charcoal)]'
        }`}
      >
        {subtask.title}
      </span>
    </motion.div>
  );
}
