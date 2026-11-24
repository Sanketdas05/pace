import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, BookOpen, Plus, MoreHorizontal, Trash2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PriorityBadge from '../ui/PriorityBadge';
import { useTasks } from '../../context/TaskContext';
import { formatDateTime, getTimeRemaining, isOverdue } from '../../lib/dateUtils';

export default function StudyCard({ task }) {
  const navigate = useNavigate();
  const { updateTask, deleteTask, restoreTask, permanentDeleteTask } = useTasks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const overdue = isOverdue(task.dueDate, task.dueTime) && !task.completed;
  const remaining = !task.completed ? getTimeRemaining(task.dueDate, task.dueTime) : null;
  const progress = Math.min((task.currentPage / task.totalPages) * 100, 100);

  const incrementPage = (amount) => {
    const newPage = Math.min(task.currentPage + amount, task.totalPages);
    updateTask(task.id, { currentPage: newPage, completed: newPage >= task.totalPages });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`group bg-[var(--color-bg)] rounded-2xl border border-[var(--color-mist)] overflow-hidden hover:shadow-card-hover transition-all duration-300 relative ${task.deleted ? 'opacity-70 grayscale-[30%]' : 'cursor-pointer'}`}
      onClick={() => {
        if (!task.deleted) navigate(`/task/${task.id}`);
      }}
    >
      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-[15px] leading-snug mb-1.5 truncate ${task.completed ? 'line-through text-[var(--color-smoke)]' : 'text-[var(--color-charcoal)]'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} size="xs" />
              {task.dueDate && (
                <span className={`flex items-center gap-1 text-xs ${overdue || remaining?.isUrgent ? 'font-medium' : 'text-[var(--color-smoke)]'}`} style={overdue || remaining?.isUrgent ? { color: 'var(--color-high-dot)' } : {}}>
                  <CalendarDays size={11} />
                  {remaining ? remaining.text : (overdue ? 'Overdue · ' : '') + formatDateTime(task.dueDate, task.dueTime)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BookOpen size={14} className="text-blue-500" />
            </div>
            {!task.deleted && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-smooth bg-[var(--color-bg)]/80 backdrop-blur-sm border border-[var(--color-mist)] text-[var(--color-smoke)] hover:text-[var(--color-high-dot)] hover:border-[var(--color-high-dot)] opacity-70 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-smoke)] mb-2">
            <span>Progress</span>
            <span className={task.completed ? 'text-[var(--color-primary)]' : ''}>
              {task.currentPage} / {task.totalPages}
            </span>
          </div>
          <div className="h-2 bg-[var(--color-mist)] rounded-full overflow-hidden mb-3 relative">
            <motion.div
              className="absolute top-0 left-0 bottom-0 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          
          {!task.completed && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); incrementPage(1); }}
                className="flex-1 py-1.5 rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-xs font-semibold text-[var(--color-smoke)] transition-smooth flex items-center justify-center gap-1"
              >
                <Plus size={12} /> 1 Item
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); incrementPage(5); }}
                className="flex-1 py-1.5 rounded-lg border border-[var(--color-mist)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-xs font-semibold text-[var(--color-smoke)] transition-smooth flex items-center justify-center gap-1"
              >
                <Plus size={12} /> 5 Items
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Delete / Restore Actions */}
      {task.deleted && (
        <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-center gap-2 px-3 bg-gradient-to-l from-[var(--color-bg)] via-[var(--color-bg)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); restoreTask(task.id); }}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold shadow-sm hover:scale-105 transition-transform"
          >
            <RotateCcw size={14} /> Restore
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold shadow-sm hover:scale-105 transition-transform"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
      {/* Inline Confirmation Card */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--color-surface)]/95 backdrop-blur-md rounded-2xl p-4 text-center border border-[var(--color-mist)]"
        >
          <p className="text-sm font-bold text-[var(--color-charcoal)] mb-3">
            {task.deleted ? "Permanently delete?" : "Move to Trash?"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(false); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--color-mist)] text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] transition-smooth"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                task.deleted ? permanentDeleteTask(task.id) : deleteTask(task.id);
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-smooth"
              style={{ backgroundColor: 'var(--color-high-dot)' }}
            >
              {task.deleted ? "Delete forever" : "Yes, move"}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
