// src/components/tasks/TaskRow.jsx
import { motion } from 'framer-motion';
import { Check, Trash2, RotateCcw, CalendarDays, Clock, Briefcase, BookOpen, Sun, ShoppingCart, Plane, Dumbbell, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { formatTimeOnly, isOverdue } from '../../lib/dateUtils';

const CATEGORY_ICONS = {
  work: Briefcase,
  study: BookOpen,
  daily: Sun,
  groceries: ShoppingCart,
  travel: Plane,
  workout: Dumbbell,
};

const priorityStyles = {
  high: {
    bg: 'var(--color-high-bg)',
    color: 'var(--color-high-dot)',
    label: 'High',
  },
  medium: {
    bg: 'var(--color-medium-bg)',
    color: 'var(--color-medium-dot)',
    label: 'Medium',
  },
  low: {
    bg: 'var(--color-low-bg)',
    color: 'var(--color-low-dot)',
    label: 'Low',
  },
};

export default function TaskRow({ task }) {
  const navigate = useNavigate();
  const { updateTask, deleteTask, restoreTask, permanentDeleteTask } = useTasks();

  const overdue = isOverdue(task.dueDate, task.dueTime) && !task.completed;
  const doneSubtasks = task.subtasks?.filter((s) => s.done).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const todayStr = new Date().toLocaleDateString('en-CA');
  const isDueToday = task.dueDate === todayStr;

  const priority = priorityStyles[task.priority] || priorityStyles.low;
  const CategoryIcon = CATEGORY_ICONS[task.category] || ClipboardList;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!task.deleted) {
      updateTask(task.id, { completed: !task.completed });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (task.deleted) {
      permanentDeleteTask(task.id);
    } else {
      deleteTask(task.id);
    }
  };

  const handleRestore = (e) => {
    e.stopPropagation();
    restoreTask(task.id);
  };

  // Format time/date display
  let timeDisplay = '';
  if (task.dueTime) {
    timeDisplay = formatTimeOnly(task.dueTime);
  } else if (task.dueDate) {
    timeDisplay = isDueToday ? 'Today' : task.dueDate;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        if (!task.deleted) navigate(`/task/${task.id}`);
      }}
      className={`task-row group flex items-center justify-between p-3 md:p-3.5 px-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
        task.deleted ? 'opacity-70 grayscale-[30%]' : 'hover:shadow-xs hover:border-[var(--color-primary)]/40'
      }`}
      style={{
        backgroundColor: 'var(--color-surface, #FFFFFF)',
        borderColor: 'var(--color-mist)',
      }}
    >
      {/* Left: Checkbox circle + Title + Badges */}
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
        {/* Checkbox button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={task.deleted}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
          style={
            task.completed
              ? { backgroundColor: 'var(--color-accent, var(--color-primary))' }
              : { border: '2px solid var(--color-mist)' }
          }
        >
          {task.completed && (
            <Check size={12} strokeWidth={3.5} className="text-white" />
          )}
        </button>

        {/* Title & Priority Tag */}
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <CategoryIcon size={14} className="text-[var(--color-smoke)] shrink-0 opacity-70 hidden sm:inline" />
          <span
            className={`text-xs md:text-sm font-medium select-none truncate transition-colors duration-200 ${
              task.completed
                ? 'line-through opacity-60 text-[var(--color-smoke)]'
                : 'text-[var(--color-charcoal)]'
            }`}
          >
            {task.title}
          </span>

          {/* Priority Pill Badge */}
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold select-none flex-shrink-0"
            style={{
              backgroundColor: priority.bg,
              color: priority.color,
            }}
          >
            {priority.label}
          </span>

          {/* Subtasks Count if any */}
          {totalSubtasks > 0 && (
            <span className="text-[10px] font-mono text-[var(--color-smoke)] opacity-70 hidden md:inline">
              {doneSubtasks}/{totalSubtasks} subtasks
            </span>
          )}
        </div>
      </div>

      {/* Right: Time / Status / Actions */}
      <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
        {timeDisplay && (
          <span
            className={`text-[11px] font-mono ${
              overdue ? 'text-[var(--color-high-dot)] font-semibold' : 'text-[var(--color-smoke)]'
            }`}
          >
            {timeDisplay}
          </span>
        )}

        {task.completed ? (
          <span className="text-[11px] font-medium text-emerald-600 font-sans">
            Done
          </span>
        ) : overdue ? (
          <span className="text-[11px] font-semibold text-[var(--color-high-dot)] font-sans">
            Overdue
          </span>
        ) : null}

        {/* Delete / Restore Actions */}
        {task.deleted ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleRestore}
              title="Restore task"
              className="p-1 rounded-lg text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-mist)]/50 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={handleDelete}
              title="Delete permanently"
              className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            title="Delete task"
            className="p-1 rounded-lg text-[var(--color-smoke)] opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
