// src/components/tasks/TaskCard.jsx
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronDown, Trash2, StickyNote, Check } from 'lucide-react';
import CircularProgress from './CircularProgress';
import PriorityBadge from '../ui/PriorityBadge';
import SubtaskItem from './SubtaskItem';
import { useTasks } from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom';

import { formatDateTime, formatTimeOnly, getTimeRemaining, isOverdue } from '../../lib/dateUtils';
import { Clock, Briefcase, BookOpen, Sun, ShoppingCart, Plane, Dumbbell, ClipboardList, RotateCcw, User } from 'lucide-react';

const CATEGORY_ICONS = {
  work: Briefcase,
  study: BookOpen,
  daily: Sun,
  groceries: ShoppingCart,
  travel: Plane,
  workout: Dumbbell,
};

const priorityAccentStyle = {
  high: { backgroundColor: 'var(--color-high-dot)' },
  medium: { backgroundColor: 'var(--color-medium-dot)' },
  low: { backgroundColor: 'var(--color-low-dot)' },
};

export default function TaskCard({ task }) {
  const { toggleSubtask, deleteTask, restoreTask, permanentDeleteTask, updateTaskNote } = useTasks();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteValue, setNoteValue] = useState(task.note || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const noteTimer = useRef(null);

  const done = task.subtasks?.filter((s) => s.done).length || 0;
  const total = task.subtasks?.length || 0;
  const overdue = isOverdue(task.dueDate, task.dueTime) && !task.completed;
  const remaining = !task.completed ? getTimeRemaining(task.dueDate, task.dueTime) : null;
  
  const isTeam = task.type === 'team' || (task.members && task.members.length > 1);
  const memberCount = task.members?.length || 1;
  const progressPercent = total > 0 ? (done / total) * 100 : (task.completed ? 100 : 0);

  const handleNoteChange = useCallback((val) => {
    setNoteValue(val);
    setNoteSaved(false);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => {
      updateTaskNote(task.id, val);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 1800);
    }, 700);
  }, [task.id, updateTaskNote]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`surface rounded-2xl shadow-card overflow-hidden relative group ${task.deleted ? 'opacity-70 grayscale-[30%]' : 'cursor-pointer'}`}
      onClick={() => {
        if (!task.deleted) navigate(`/task/${task.id}`);
      }}
    >
      {/* Priority accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={priorityAccentStyle[task.priority] || priorityAccentStyle.low}
      />

      <div className="p-5 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-[15px] leading-snug mb-1.5 truncate flex items-center gap-2 ${
                task.completed
                  ? 'line-through text-[var(--color-smoke)]'
                  : 'text-[var(--color-charcoal)]'
              }`}
            >
              {(() => {
                const Icon = CATEGORY_ICONS[task.category] || ClipboardList;
                return <Icon size={14} className="text-[var(--color-smoke)] shrink-0" />;
              })()}
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} size="xs" />
              {task.dueDate && (
                <span
                  className={`flex items-center gap-1 text-xs ${
                    overdue || remaining?.isUrgent ? 'font-medium' : 'text-[var(--color-smoke)]'
                  } ${remaining?.animate ? 'animate-pulse' : ''}`}
                  style={overdue ? { color: 'var(--color-high-dot)' } : (remaining?.color ? { color: remaining.color } : {})}
                >
                  <CalendarDays size={11} />
                  {remaining ? remaining.text : (overdue ? 'Overdue · ' : '') + formatDateTime(task.dueDate, task.dueTime)}
                </span>
              )}
              {!task.dueDate && task.dueTime && (
                <span className="flex items-center gap-1 text-xs text-[var(--color-smoke)]">
                  <Clock size={11} />
                  {formatTimeOnly(task.dueTime)}
                </span>
              )}
            </div>
          </div>

          {/* Circular progress */}
          {total > 0 && (
            <div className="flex-shrink-0">
              <CircularProgress done={done} total={total} />
            </div>
          )}
        </div>

        {/* Subtasks toggle */}
        {total > 0 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="flex items-center gap-1.5 mt-4 text-xs text-[var(--color-smoke)] hover:text-[var(--color-primary)] transition-smooth"
            >
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.div>
              {expanded ? 'Hide' : 'Show'} subtasks ({done}/{total})
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-[var(--color-mist)] space-y-0.5">
                    {task.subtasks.map((subtask) => (
                      <SubtaskItem
                        key={subtask.id}
                        subtask={subtask}
                        onToggle={(sid) => toggleSubtask(task.id, sid)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ── Team Footer ─────────────────────────────────── */}
        {isTeam && (
          <div className="mt-4 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-mist)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(memberCount, 3) }).map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm" style={{ zIndex: 3 - i }}>
                    <User size={12} strokeWidth={3} />
                  </div>
                ))}
                {memberCount > 3 && (
                  <div className="w-7 h-7 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-surface)] text-[var(--color-smoke)] flex items-center justify-center text-[10px] font-bold shadow-sm z-0">
                    +{memberCount - 3}
                  </div>
                )}
              </div>
              <div className="bg-[var(--color-surface)] px-3 py-1 rounded-full border border-[var(--color-mist)] shadow-sm flex items-center gap-1.5">
                <span className="font-bold text-[var(--color-charcoal)] text-xs">{memberCount}</span>
                <span className="text-[var(--color-smoke)] text-xs font-semibold">In team</span>
              </div>
            </div>
            
            <div className="relative w-full h-7 rounded-md bg-[var(--color-surface)] border border-[var(--color-mist)] flex items-center">
               {/* Background text (visible when not covered by progress fill) */}
               <span className="absolute left-3 text-[11px] font-bold text-[var(--color-primary)] whitespace-nowrap z-0">
                 Work in progress
               </span>

               {/* Progress Fill (overflow hidden cuts off the inner text precisely) */}
               <div 
                 className="absolute top-0 left-0 bottom-0 transition-all duration-500 ease-out overflow-hidden z-10"
                 style={{ 
                   width: `${progressPercent}%`, 
                   backgroundColor: 'var(--color-primary)',
                   backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)'
                 }}
               >
                 {/* Foreground text (white) positioned exactly the same */}
                 <div className="absolute top-0 left-0 bottom-0 min-w-[200px] flex items-center">
                   <span className="absolute left-3 text-[11px] font-bold text-white whitespace-nowrap drop-shadow-sm">
                     Work in progress
                   </span>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* ── Per-task Notes ─────────────────────────────────── */}
        <div className="mt-3 pt-3 border-t border-[var(--color-mist)]">
          <button
            onClick={(e) => { e.stopPropagation(); setNoteOpen(!noteOpen); }}
            className="flex items-center gap-1.5 text-xs transition-smooth"
            style={{ color: noteOpen ? 'var(--color-primary)' : 'var(--color-smoke)' }}
          >
            <StickyNote size={13} />
            <span>{noteOpen ? 'Hide note' : (task.note ? 'View note' : 'Add note')}</span>
            {task.note && !noteOpen && (
              <span className="w-1.5 h-1.5 rounded-full ml-1" style={{ backgroundColor: 'var(--color-primary)' }} />
            )}
          </button>

          <AnimatePresence>
            {noteOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="mt-2 relative">
                  <textarea
                    onClick={(e) => e.stopPropagation()}
                    value={noteValue}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder="Ideas, changes, reminders for this task…"
                    rows={3}
                    className="w-full resize-none rounded-xl px-3 py-2.5 text-xs leading-relaxed placeholder:text-[var(--color-smoke)]/50 focus:outline-none focus:ring-2 transition-smooth"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1.5px solid var(--color-mist)',
                      color: 'var(--color-charcoal)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-mist)'}
                  />
                  <AnimatePresence>
                    {noteSaved && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-medium"
                        style={{ color: 'var(--color-low-dot)' }}
                      >
                        <Check size={10} strokeWidth={3} /> Saved
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete / Restore Actions */}
      {task.deleted ? (
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
      ) : (
        <motion.button
          className="absolute top-3 right-3 opacity-100 w-7 h-7 flex items-center justify-center rounded-lg transition-smooth bg-[var(--color-bg)]/80 backdrop-blur-sm border border-[var(--color-mist)]"
          style={{ color: 'var(--color-smoke)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-high-dot)'; e.currentTarget.style.borderColor = 'var(--color-high-dot)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-smoke)'; e.currentTarget.style.borderColor = 'var(--color-mist)'; }}
          onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
          title="Delete task"
        >
          <Trash2 size={13} />
        </motion.button>
      )}

      {/* Inline Confirmation Card */}
      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
}
