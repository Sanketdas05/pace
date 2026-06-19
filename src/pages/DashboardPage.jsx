// src/pages/DashboardPage.jsx
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, ListTodo, StickyNote, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useReview } from '../context/ReviewContext';
import { BookOpen } from 'lucide-react';

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate + 'T00:00:00') < today;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, colorVar, bgVar, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="surface rounded-2xl shadow-card p-5 flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `var(${bgVar})` }}
      >
        <Icon size={22} style={{ color: `var(${colorVar})` }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--color-charcoal)]">{value}</p>
        <p className="text-xs text-[var(--color-smoke)] font-medium mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Donut Chart (Completed / Active / Overdue) ───────────────────────────────
function DonutChart({ completed, active, overdue }) {
  const total = completed + active + overdue;
  const size = 140;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  // Segments: completed (primary), active (medium-dot), overdue (high-dot)
  const segments = [
    { value: completed, colorVar: '--color-primary',    label: 'Completed' },
    { value: active,    colorVar: '--color-medium-dot', label: 'Active'    },
    { value: overdue,   colorVar: '--color-high-dot',   label: 'Overdue'   },
  ];

  let cumulative = 0;
  const arcs = segments.map((seg) => {
    const pct  = total === 0 ? 0 : seg.value / total;
    const dash = pct * circ;
    const gap  = circ - dash;
    const offset = circ - cumulative * circ / (total || 1);
    cumulative += seg.value;
    return { ...seg, dash, gap, offset: total === 0 ? circ : (circ - (cumulative - seg.value) / total * circ) };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="var(--color-mist)"
            strokeWidth={stroke}
          />
          {total === 0 ? null : arcs.map((arc, i) => (
            <motion.circle
              key={i}
              cx={size / 2} cy={size / 2} r={r}
              fill="none"
              stroke={`var(${arc.colorVar})`}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={arc.offset}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${arc.dash} ${arc.gap}` }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] }}
            />
          ))}
        </svg>
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[var(--color-charcoal)]">{total}</span>
          <span className="text-[10px] text-[var(--color-smoke)] font-medium">Tasks</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 flex-1 w-full">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: `var(${seg.colorVar})` }}
            />
            <span className="text-sm text-[var(--color-charcoal)] flex-1">{seg.label}</span>
            <span className="text-sm font-bold text-[var(--color-charcoal)]">{seg.value}</span>
            <span className="text-xs text-[var(--color-smoke)] w-9 text-right">
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Per-Priority Horizontal Bars ─────────────────────────────────────────────
function PriorityBars({ tasks }) {
  const rows = [
    { label: 'High',   priority: 'high',   colorVar: '--color-high-dot',   bgVar: '--color-high-bg'   },
    { label: 'Medium', priority: 'medium', colorVar: '--color-medium-dot', bgVar: '--color-medium-bg' },
    { label: 'Low',    priority: 'low',    colorVar: '--color-low-dot',    bgVar: '--color-low-bg'    },
  ];

  return (
    <div className="space-y-4">
      {rows.map(({ label, priority, colorVar, bgVar }) => {
        const total     = tasks.filter((t) => t.priority === priority).length;
        const completed = tasks.filter((t) => t.priority === priority && t.completed).length;
        const overdue   = tasks.filter((t) => t.priority === priority && isOverdue(t)).length;
        const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);

        return (
          <div key={priority}>
            {/* Label row */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `var(${colorVar})` }} />
                <span className="text-sm font-semibold text-[var(--color-charcoal)]">{label}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-smoke)]">
                <span>{completed} done</span>
                {overdue > 0 && (
                  <span style={{ color: 'var(--color-high-dot)' }}>{overdue} overdue</span>
                )}
                <span className="font-bold" style={{ color: `var(${colorVar})` }}>{pct}%</span>
              </div>
            </div>
            {/* Track */}
            <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: `var(${bgVar})` }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                style={{ backgroundColor: `var(${colorVar})` }}
              />
            </div>
            <p className="text-[10px] text-[var(--color-smoke)] mt-1">
              {total} task{total !== 1 ? 's' : ''} total
            </p>
          </div>
        );
      })}
    </div>
  );
}


// ─── Task Notes Feed ──────────────────────────────────────────────────────────
function TaskNotesFeed({ tasks }) {
  const navigate = useNavigate();
  const tasksWithNotes = tasks.filter((t) => t.note && t.note.trim());

  if (tasksWithNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
          style={{ backgroundColor: 'var(--color-mist)' }}
        >
          <StickyNote size={20} style={{ color: 'var(--color-smoke)' }} />
        </div>
        <p className="text-sm font-medium text-[var(--color-charcoal)]">No task notes yet</p>
        <p className="text-xs text-[var(--color-smoke)] mt-1">
          Open any task card and tap <strong>Add note</strong> to capture ideas or changes
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasksWithNotes.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 p-3.5 rounded-xl cursor-pointer transition-smooth group"
          style={{ backgroundColor: 'var(--color-bg)' }}
          onClick={() => navigate('/')}
        >
          {/* Priority strip */}
          <div
            className="w-1 rounded-full flex-shrink-0 self-stretch"
            style={{
              backgroundColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-dot)`,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-bold text-[var(--color-smoke)] truncate">{task.title}</p>
              <Link
                size={11}
                className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-smooth"
                style={{ color: 'var(--color-primary)' }}
              />
            </div>
            <p className="text-sm text-[var(--color-charcoal)] mt-1 leading-relaxed line-clamp-3">
              {task.note}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Journal Feed ─────────────────────────────────────────────────────────────
function JournalFeed({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
          style={{ backgroundColor: 'var(--color-mist)' }}
        >
          <BookOpen size={20} style={{ color: 'var(--color-smoke)' }} />
        </div>
        <p className="text-sm font-medium text-[var(--color-charcoal)]">No journal entries yet</p>
        <p className="text-xs text-[var(--color-smoke)] mt-1">
          Complete your Daily Review to build your journal over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((rev, i) => {
        // Fallback to today's date if missing
        const dateStr = rev.date || rev.createdAt || new Date().toISOString();
        const dateObj = new Date(dateStr);
        // Safety check
        const isValidDate = !isNaN(dateObj.valueOf());
        
        return (
          <motion.div
            key={rev.date || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl transition-smooth"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <div className="flex items-center justify-between mb-3 border-b border-[var(--color-mist)] pb-2">
              <p className="text-xs font-bold text-[var(--color-smoke)] uppercase tracking-widest">
                {isValidDate ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Recent'}
              </p>
            </div>
            
            <div className="space-y-4">
              {rev.wentWell && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-low-dot)' }} />
                    <p className="text-xs font-bold text-[var(--color-smoke)] uppercase tracking-wider">Went Well</p>
                  </div>
                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed pl-3.5">{rev.wentWell}</p>
                </div>
              )}
              {rev.didntGo && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-medium-dot)' }} />
                    <p className="text-xs font-bold text-[var(--color-smoke)] uppercase tracking-wider">Could be better</p>
                  </div>
                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed pl-3.5">{rev.didntGo}</p>
                </div>
              )}
              {rev.topPriority && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                    <p className="text-xs font-bold text-[var(--color-smoke)] uppercase tracking-wider">Top Priority</p>
                  </div>
                  <p className="text-sm text-[var(--color-charcoal)] leading-relaxed pl-3.5">{rev.topPriority}</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { tasks } = useTasks();
  const { todayReview, pastReviews } = useReview();

  // Combine and sort reviews
  const allReviews = [];
  if (todayReview && (todayReview.wentWell || todayReview.didntGo || todayReview.topPriority)) {
    allReviews.push({ date: new Date().toISOString().split('T')[0], ...todayReview });
  }
  (pastReviews || []).forEach(r => {
    if (r.wentWell || r.didntGo || r.topPriority) allReviews.push(r);
  });
  // Sort descending
  allReviews.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter(isOverdue).length;
  const active = total - completed - overdue;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const kpis = [
    { icon: ListTodo,     label: 'Total Tasks', value: total,     colorVar: '--color-primary',    bgVar: '--color-mist',     delay: 0 },
    { icon: CheckCircle2, label: 'Completed',   value: completed, colorVar: '--color-low-dot',    bgVar: '--color-low-bg',   delay: 0.08 },
    { icon: Clock,        label: 'Active',       value: active,    colorVar: '--color-medium-dot', bgVar: '--color-medium-bg',delay: 0.16 },
    { icon: AlertCircle,  label: 'Overdue',      value: overdue,   colorVar: '--color-high-dot',   bgVar: '--color-high-bg',  delay: 0.24 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Analytics</h1>
        <p className="text-[var(--color-smoke)] text-sm mt-1">Your productivity overview</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="surface rounded-2xl shadow-card p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-[var(--color-charcoal)]">Overall Progress</p>
          <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{pct}%</p>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-mist)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[var(--color-smoke)]">{completed} completed</span>
          <span className="text-xs text-[var(--color-smoke)]">{total} total</span>
        </div>
      </motion.div>

      {/* ── Charts Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Donut — overall breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface rounded-2xl shadow-card p-5"
        >
          <p className="font-semibold text-sm text-[var(--color-charcoal)] mb-1">Task Breakdown</p>
          <p className="text-xs text-[var(--color-smoke)] mb-5">All tasks by status</p>
          <DonutChart completed={completed} active={active} overdue={overdue} />
        </motion.div>

        {/* Horizontal bars — per-priority completion */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="surface rounded-2xl shadow-card p-5"
        >
          <p className="font-semibold text-sm text-[var(--color-charcoal)] mb-1">Completion by Priority</p>
          <p className="text-xs text-[var(--color-smoke)] mb-5">% of tasks done per level</p>
          <PriorityBars tasks={tasks} />
        </motion.div>
      </div>

      {/* Per-task Notes Feed */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="surface rounded-2xl shadow-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-sm text-[var(--color-charcoal)]">📝 Task Notes</p>
            <p className="text-xs text-[var(--color-smoke)] mt-0.5">
              Ideas & changes logged per task
            </p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--color-mist)',
              color: 'var(--color-smoke)',
            }}
          >
            {tasks.filter((t) => t.note?.trim()).length} notes
          </span>
        </div>
        <TaskNotesFeed tasks={tasks} />
      </motion.div>

      {/* Journal Feed */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="surface rounded-2xl shadow-card p-5 mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-sm text-[var(--color-charcoal)] flex items-center gap-2">
              <BookOpen size={16} style={{ color: 'var(--color-primary)' }} /> Journal
            </p>
            <p className="text-xs text-[var(--color-smoke)] mt-0.5">
              Reflections from your Daily Reviews
            </p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--color-mist)',
              color: 'var(--color-smoke)',
            }}
          >
            {allReviews.length} entries
          </span>
        </div>
        <JournalFeed reviews={allReviews} />
      </motion.div>
    </div>
  );
}
