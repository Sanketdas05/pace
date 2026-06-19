// src/pages/CalendarPage.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { formatTimeOnly } from '../lib/dateUtils';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate + 'T00:00:00') < today;
}

function getTasksForDate(tasks, year, month, day) {
  const ds = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  return tasks.filter((t) => t.dueDate === ds);
}

// Priority pill inside day cell
function MiniTaskPill({ task }) {
  return (
    <div
      className="w-full rounded-md px-1.5 py-0.5 text-[9px] font-semibold truncate leading-tight"
      style={{
        backgroundColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-bg)`,
        color: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'})`,
      }}
    >
      {task.title}
    </div>
  );
}

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'timeline'
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (dir) => {
    setDirection(dir);
    setSelectedDay(null);
    setViewDate(new Date(year, month + dir, 1));
  };

  const selectedTasks = selectedDay
    ? getTasksForDate(tasks, year, month, selectedDay)
    : [];

  // Build 6-week grid (fill empties)
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Monthly task summary for the mini-stats strip
  const monthTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate + 'T00:00:00');
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Calendar</h1>
          <p className="text-[var(--color-smoke)] text-sm mt-0.5">
            {monthTasks.length} task{monthTasks.length !== 1 ? 's' : ''} due this month
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex bg-[var(--color-mist)] p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-smooth ${viewMode === 'month' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-charcoal)]' : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'}`}
            >
              <CalendarIcon size={14} /> Month
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-smooth ${viewMode === 'timeline' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-charcoal)]' : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'}`}
            >
              <LayoutList size={14} /> Timeline
            </button>
          </div>

          {/* Month nav */}
          <div className="flex items-center justify-between sm:justify-center gap-1 shrink-0">
            <button
              id="cal-prev-month"
              onClick={() => changeMonth(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-smooth bg-[var(--color-mist)] text-[var(--color-smoke)] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-bg)]"
            >
              <ChevronLeft size={17} />
            </button>
            <div className="px-3 flex-1 sm:flex-none sm:min-w-[130px] text-center">
              <span className="font-bold text-[var(--color-charcoal)] text-sm whitespace-nowrap">
                {MONTHS[month]} {year}
              </span>
            </div>
            <button
              id="cal-next-month"
              onClick={() => changeMonth(1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-smooth bg-[var(--color-mist)] text-[var(--color-smoke)] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-bg)]"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Due', value: monthTasks.length, color: 'var(--color-primary)' },
          { label: 'Completed', value: monthTasks.filter((t) => t.completed).length, color: 'var(--color-low-dot)' },
          { label: 'Overdue', value: monthTasks.filter(isOverdue).length, color: 'var(--color-high-dot)' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="surface rounded-2xl p-4 text-center shadow-card"
          >
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-[var(--color-smoke)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Calendar grid or Timeline view */}
      {viewMode === 'month' ? (
        <div className="surface rounded-3xl shadow-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[var(--color-mist)]">
          {DAYS_SHORT.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-[11px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--color-smoke)' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Animated month grid */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className="grid grid-cols-7"
                style={{ borderBottom: wi < weeks.length - 1 ? '1px solid var(--color-mist)' : 'none' }}
              >
                {week.map((day, di) => {
                  if (!day) {
                    return (
                      <div
                        key={`e-${wi}-${di}`}
                        className="min-h-[80px] p-1.5"
                        style={{
                          borderRight: di < 6 ? '1px solid var(--color-mist)' : 'none',
                          backgroundColor: 'var(--color-bg)',
                          opacity: 0.4,
                        }}
                      />
                    );
                  }

                  const isToday =
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();
                  const isSelected = day === selectedDay;
                  const dayTasks = getTasksForDate(tasks, year, month, day);
                  const hasOverdue = dayTasks.some(isOverdue);

                  return (
                    <motion.button
                      key={day}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className="min-h-[80px] p-1.5 text-left transition-smooth relative flex flex-col"
                      style={{
                        borderRight: di < 6 ? '1px solid var(--color-mist)' : 'none',
                        backgroundColor: isSelected
                          ? 'var(--color-primary)'
                          : isToday
                          ? 'var(--color-mist)'
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-mist)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected)
                          e.currentTarget.style.backgroundColor = isToday ? 'var(--color-mist)' : 'transparent';
                      }}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                            isSelected ? 'text-white' : isToday ? 'text-white' : 'text-[var(--color-charcoal)]'
                          }`}
                          style={
                            isToday && !isSelected
                              ? { backgroundColor: 'var(--color-primary)' }
                              : {}
                          }
                        >
                          {day}
                        </span>
                        {hasOverdue && !isSelected && (
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--color-high-dot)' }}
                          />
                        )}
                      </div>

                      {/* Task pills — show up to 2, then "+N more" */}
                      <div className="space-y-0.5 flex-1">
                        {isSelected ? (
                          <div className="text-white/80 text-[9px] font-medium">
                            {dayTasks.length > 0 ? `${dayTasks.length} task${dayTasks.length > 1 ? 's' : ''}` : 'No tasks'}
                          </div>
                        ) : (
                          <>
                            {dayTasks.slice(0, 2).map((t) => (
                              <MiniTaskPill key={t.id} task={t} />
                            ))}
                            {dayTasks.length > 2 && (
                              <div
                                className="text-[9px] font-semibold pl-1"
                                style={{ color: 'var(--color-smoke)' }}
                              >
                                +{dayTasks.length - 2} more
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        </div>
      ) : (
        <TimelineView tasks={tasks} viewDate={viewDate} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      )}

      {/* Selected Day Modal */}
      <AnimatePresence>
        {selectedDay && viewMode === 'month' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="surface rounded-2xl shadow-card overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid var(--color-mist)' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <CalendarDays size={17} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[var(--color-charcoal)] text-sm">
                  {MONTHS[month]} {selectedDay}, {year}
                </p>
                <p className="text-xs text-[var(--color-smoke)]">
                  {selectedTasks.length === 0
                    ? 'Nothing due'
                    : `${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''} due`}
                </p>
              </div>
            </div>

            {/* Task list */}
            {selectedTasks.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-[var(--color-smoke)]">No tasks scheduled for this day 🎉</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-mist)]">
                {selectedTasks.map((task) => {
                  const done = task.subtasks?.filter((s) => s.done).length || 0;
                  const total = task.subtasks?.length || 0;
                  return (
                    <div key={task.id} className="flex items-center gap-3 px-5 py-3.5">
                      {/* Priority bar */}
                      <div
                        className="w-1 h-10 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-dot)`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            task.completed ? 'line-through text-[var(--color-smoke)]' : 'text-[var(--color-charcoal)]'
                          }`}
                        >
                          {task.title}
                        </p>
                        {total > 0 && (
                          <p className="text-xs text-[var(--color-smoke)] mt-0.5">
                            {done}/{total} subtasks done
                          </p>
                        )}
                        {task.note && (
                          <p className="text-[11px] mt-1 italic truncate" style={{ color: 'var(--color-primary)' }}>
                            📝 {task.note}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-bg)`,
                            color: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'})`,
                          }}
                        >
                          {task.priority}
                        </span>
                        {task.completed && (
                          <span className="text-[10px] font-medium" style={{ color: 'var(--color-low-dot)' }}>
                            ✓ Done
                          </span>
                        )}
                        {isOverdue(task) && (
                          <span className="text-[10px] font-medium" style={{ color: 'var(--color-high-dot)' }}>
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineView({ tasks, viewDate, selectedDay, setSelectedDay }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      // Use setTimeout to ensure the DOM has rendered the buttons before measuring
      setTimeout(() => {
        const activeBtn = scrollRef.current?.querySelector('button[data-active="true"]');
        if (activeBtn) {
          const containerWidth = scrollRef.current.clientWidth;
          const btnLeft = activeBtn.offsetLeft;
          const btnWidth = activeBtn.clientWidth;
          const scrollPos = btnLeft - (containerWidth / 2) + (btnWidth / 2);
          scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
      }, 50);
    }
  }, [selectedDay, viewDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const activeDay = selectedDay || (isCurrentMonth ? today.getDate() : 1);
  const activeDateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(activeDay).padStart(2,'0')}`;

  const days = Array.from({ length: daysInMonth }).map((_, i) => new Date(year, month, i + 1));
  const dayTasks = tasks.filter(t => !t.deleted && t.dueDate === activeDateStr);

  // Hours: 08 AM to 08 PM
  const hours = Array.from({ length: 13 }).map((_, i) => {
    const h = i + 8;
    return {
       label: h < 12 ? `${h < 10 ? '0'+h : h} AM` : h === 12 ? '12 PM' : `${h - 12 < 10 ? '0'+(h-12) : h-12} PM`,
       value: h
    };
  });

  const scrollByAmount = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="surface rounded-3xl shadow-card overflow-hidden border border-[var(--color-mist)] flex flex-col w-full max-w-2xl mx-auto">
      {/* Date Selector Wrapper */}
      <div className="relative group border-b border-[var(--color-mist)] bg-[var(--color-bg)] z-10">
        {/* Left Arrow (Desktop Only) */}
        <button 
          onClick={() => scrollByAmount(-200)}
          className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-20 flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--color-surface)] shadow-md flex items-center justify-center text-[var(--color-charcoal)] border border-[var(--color-mist)] hover:bg-[var(--color-mist)] transition-colors">
            <ChevronLeft size={16} />
          </div>
        </button>

        {/* Date Selector */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8 py-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {days.map(d => {
            const isSelected = d.getDate() === activeDay;
            return (
              <button 
                key={d.toISOString()}
                data-active={isSelected ? "true" : undefined}
                onClick={() => setSelectedDay(d.getDate())}
                className="flex flex-col items-center gap-3 relative shrink-0 min-w-[3rem]"
              >
                <span className="text-[11px] sm:text-xs font-bold text-[var(--color-smoke)]">{DAYS_SHORT[d.getDay()][0]}</span>
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-bold transition-smooth ${isSelected ? 'bg-[var(--color-low-bg)] text-[var(--color-charcoal)] shadow-sm border border-[var(--color-low-dot)] scale-110' : 'bg-[var(--color-bg)] text-[var(--color-charcoal)] hover:bg-[var(--color-mist)]'}`}>
                  {d.getDate()}
                </div>
                {isSelected && <div className="absolute -bottom-6 w-8 h-1 rounded-full bg-[var(--color-low-dot)]" />}
              </button>
            )
          })}
        </div>

        {/* Right Arrow (Desktop Only) */}
        <button 
          onClick={() => scrollByAmount(200)}
          className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--color-bg)] via-[var(--color-bg)] to-transparent z-20 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--color-surface)] shadow-md flex items-center justify-center text-[var(--color-charcoal)] border border-[var(--color-mist)] hover:bg-[var(--color-mist)] transition-colors">
            <ChevronRight size={16} />
          </div>
        </button>
      </div>

      {/* Vertical Agenda */}
      <div className="flex-1 overflow-y-auto max-h-[600px] bg-[var(--color-bg)]/50 p-4 sm:p-6 custom-scrollbar relative">
        {dayTasks.filter(t => !t.dueTime).length > 0 && (
           <div className="mb-6 pb-6 border-b-2 border-dashed border-[var(--color-mist)]">
             <div className="text-[10px] font-bold text-[var(--color-smoke)] mb-3 pl-16">ALL DAY</div>
             <div className="flex flex-col gap-2 pl-16">
                {dayTasks.filter(t => !t.dueTime).map(task => (
                  <div 
                       key={task.id} 
                       className="w-full rounded-full p-2.5 pl-4 flex items-center shadow-sm border"
                       style={{ 
                         backgroundColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-bg)`,
                         borderColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-dot)`,
                       }}
                     >
                        <span className="font-bold text-sm truncate" style={{ color: `var(--color-charcoal)` }}>{task.title}</span>
                  </div>
                ))}
             </div>
           </div>
        )}

        {hours.map(hour => {
          const tasksInHour = dayTasks.filter(t => {
            if (!t.dueTime) return false;
            const taskHour = parseInt(t.dueTime.split(':')[0], 10);
            return taskHour === hour.value;
          });

          return (
            <div key={hour.value} className="flex min-h-[90px] relative group">
              {/* Horizontal Line */}
              <div className="absolute left-16 right-0 top-0 border-t border-[var(--color-mist)] group-hover:border-[var(--color-charcoal)]/10 transition-colors"></div>

              {/* Hour Label */}
              <div className="w-16 shrink-0 relative">
                <span className="text-[11px] font-bold text-[var(--color-smoke)] absolute -top-2 bg-[var(--color-bg)] pr-2 z-10">{hour.label}</span>
              </div>
              
              {/* Task Pills */}
              <div className="flex-1 pl-2 pb-4 pt-2.5 flex flex-col gap-2.5">
                {tasksInHour.map(task => {
                   const subtaskCount = task.subtasks?.length || 0;
                   return (
                     <div 
                       key={task.id} 
                       className="w-full rounded-full p-1.5 pl-5 pr-1.5 flex items-center justify-between shadow-sm border hover:-translate-y-0.5 transition-transform cursor-pointer"
                       style={{ 
                         backgroundColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-bg)`,
                         borderColor: `var(--color-${task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'}-dot)`,
                       }}
                     >
                        <div className="flex items-center gap-3 truncate min-w-0">
                          <span className="font-bold text-[13px] sm:text-sm truncate" style={{ color: `var(--color-charcoal)` }}>{task.title}</span>
                          {subtaskCount > 0 && (
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0" style={{ color: `var(--color-charcoal)` }}>
                              {subtaskCount}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 px-3 py-1.5 rounded-full bg-white/60 border border-white/40 shadow-sm ml-2">
                          <span className="text-[11px] sm:text-xs font-bold" style={{ color: `var(--color-charcoal)` }}>
                            {formatTimeOnly(task.dueTime)}
                          </span>
                        </div>
                     </div>
                   );
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
