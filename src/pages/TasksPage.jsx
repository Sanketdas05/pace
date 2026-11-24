// src/pages/TasksPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useGamification, getUserTitle } from '../context/GamificationContext';
import { Flame, Shield, Plus, Bell, User, ListTodo, Loader, Calendar, List, LayoutGrid, Sparkles, BookOpen, X, Clock } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useReview } from '../context/ReviewContext';
import { useNotifications } from '../context/NotificationContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskRow from '../components/tasks/TaskRow';
import StudyCard from '../components/tasks/StudyCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import FAB from '../components/ui/FAB';
import { formatTimeOnly, isOverdueMoreThanWeek } from '../lib/dateUtils';

const filters = ['All', 'High', 'Medium', 'Low', 'Completed', 'Trash'];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

export default function TasksPage() {
  const { tasks, tasksLoading } = useTasks();
  const { currentUser } = useAuth();
  const { profile } = useGamification();
  const { setOpen: setAiOpen } = useAI() || {};
  const { setShowReviewModal, todayReview } = useReview() || {};
  const { notifications, unreadCount, dismissNotification, clearAllNotifications, toastPopupsEnabled } = useNotifications();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = currentUser?.displayName || 'User';

  const [viewMode, setViewMode] = useState(() => localStorage.getItem('pace-view-mode') || 'list');
  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('pace-view-mode', mode);
  };

  const [hideCompleted, setHideCompleted] = useState(() => localStorage.getItem('taskflow-hide-completed') === 'true');

  const toggleHideCompleted = () => {
    const next = !hideCompleted;
    setHideCompleted(next);
    localStorage.setItem('taskflow-hide-completed', next.toString());
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'Trash') return t.deleted;
    if (t.deleted) return false;

    // Do not keep tasks overdue for more than 7 days in active views
    if (!t.completed && isOverdueMoreThanWeek(t.dueDate, t.dueTime)) return false;

    if (activeFilter === 'Completed') return t.completed;
    if (hideCompleted && t.completed) return false;
    
    if (activeFilter === 'All') return true;
    return t.priority === activeFilter.toLowerCase();
  });

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 16) greeting = 'Good afternoon';

  const todayDateObj = new Date();
  const currentDayFull = todayDateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const currentDateFormatted = todayDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const currentShortDate = todayDateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  const todayStr = new Date().toLocaleDateString('en-CA');
  const currentDayOfWeek = new Date().getDay();
  const isDueOrRepeatingToday = (t) => {
    if (t.completed || t.deleted) return false;
    if (t.dueDate === todayStr) return true;
    if (t.repeatDays && Array.isArray(t.repeatDays) && t.repeatDays.includes(currentDayOfWeek)) return true;
    return false;
  };
  const todayTasks = tasks.filter(isDueOrRepeatingToday).slice(0, 3);
  const activeTasksCount = tasks.filter(t => !t.completed && !t.deleted).length;
  const totalTasksCount = tasks.filter(t => !t.deleted).length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="min-w-0 flex-1">
            <p className="text-[var(--color-smoke)] text-xs md:text-sm font-semibold mb-0.5">
              {greeting},
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] flex items-center gap-2 truncate">
              <span className="truncate">{displayName}!</span>
              {profile?.streak > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-high-bg)] text-[var(--color-high-dot)] rounded-lg text-xs font-bold shrink-0">
                  <Flame size={13} /> {profile.streak}
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 relative shrink-0">
            {/* Mobile AI button */}
            {setAiOpen && (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setAiOpen(true)}
                title="Pace AI"
                aria-label="Open AI Assistant"
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xs transition-smooth border border-[var(--color-mist)]"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-text, #ffffff)'
                }}
              >
                <Sparkles size={16} />
              </motion.button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--color-mist)] flex items-center justify-center text-[var(--color-charcoal)] bg-[var(--color-surface)] relative shadow-xs hover:scale-105 transition-transform"
                title="Notifications"
                aria-label="Open notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[var(--color-high-dot)] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Click-away backdrop */}
                    <div 
                      className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                      onClick={() => setShowNotifications(false)}
                    />

                    {/* Notification Panel: centered with margins on mobile; anchored right under controls on tablet/desktop */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="fixed inset-x-3 top-20 max-w-sm mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-12 sm:w-84 sm:max-w-none bg-[var(--color-surface)] border border-[var(--color-mist)] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
                    >
                      {/* Header */}
                      <div className="p-3.5 px-4 border-b border-[var(--color-mist)] flex items-center justify-between bg-[var(--color-bg)]/50">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[var(--color-charcoal)]">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-high-bg)] text-[var(--color-high-dot)]">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-[11px] font-semibold text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] transition-colors"
                            >
                              Clear all
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-mist)]/50 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {/* List */}
                      <div className="overflow-y-auto divide-y divide-[var(--color-mist)]/60 max-h-72">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className="p-3.5 hover:bg-[var(--color-bg)]/60 transition-colors flex items-start gap-3 group relative cursor-pointer"
                              onClick={() => {
                                setShowNotifications(false);
                                navigate(`/task/${n.taskId}`);
                              }}
                            >
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                n.type === 'overdue' ? 'bg-[var(--color-high-bg)] text-[var(--color-high-dot)]' : 'bg-amber-50 text-amber-600'
                              }`}>
                                <Clock size={15} />
                              </div>
                              <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    n.type === 'overdue' ? 'text-[var(--color-high-dot)]' : 'text-amber-600'
                                  }`}>
                                    {n.type === 'overdue' ? 'Overdue' : 'Due Soon'}
                                  </span>
                                  <span className="text-[10px] text-[var(--color-smoke)]">· {n.time}</span>
                                </div>
                                <p className="text-xs font-semibold text-[var(--color-charcoal)] truncate leading-tight">
                                  {n.title}
                                </p>
                                <p className="text-[11px] text-[var(--color-smoke)] mt-0.5 leading-snug">
                                  {n.message}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dismissNotification(n.id);
                                }}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-mist)] transition-colors opacity-70 group-hover:opacity-100"
                                title="Dismiss"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-low-bg)] text-[var(--color-low-dot)] flex items-center justify-center mx-auto mb-2">
                              <Bell size={18} />
                            </div>
                            <p className="text-xs font-bold text-[var(--color-charcoal)]">You're all caught up!</p>
                            <p className="text-[11px] text-[var(--color-smoke)] mt-0.5">No pending deadline alerts.</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-2.5 px-4 bg-[var(--color-bg)]/80 border-t border-[var(--color-mist)] flex items-center justify-between text-[11px]">
                        <span className="text-[var(--color-smoke)]">
                          {toastPopupsEnabled ? 'Pop-up banners on' : 'Calm notifications (no pop-ups)'}
                        </span>
                        <Link
                          to="/settings"
                          onClick={() => setShowNotifications(false)}
                          className="font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          Settings
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link to="/settings" className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs font-bold overflow-hidden border border-[var(--color-mist)] hover:scale-105 transition-transform shrink-0">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </Link>
            
            <motion.button
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-xs transition-smooth"
              style={{ 
                backgroundColor: 'var(--color-btn-new-bg, var(--color-primary))', 
                color: 'var(--color-btn-new-text, #ffffff)' 
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              New Task
            </motion.button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Today Card */}
          <div 
            className="lg:col-span-2 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xs border flex flex-col justify-between gap-4 relative overflow-hidden transition-colors duration-300" 
            style={{ 
              backgroundColor: 'var(--color-card-today-bg, var(--color-surface))',
              borderColor: 'var(--color-card-today-border, var(--color-mist))'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-charcoal)' }}>Today</h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[var(--color-mist)] text-[var(--color-smoke)] bg-[var(--color-surface)]/70">
                    {currentDayFull}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[var(--color-mist)] bg-[var(--color-surface)] text-[var(--color-charcoal)] shadow-2xs">
                  <Calendar size={13} style={{ color: 'var(--color-accent, var(--color-primary))' }} />
                  <span>{currentDateFormatted}</span>
                </div>
              </div>
              <div className="space-y-3 z-10 mt-2">
                {todayTasks.length > 0 ? (
                  todayTasks.map(t => (
                    <div key={t.id} className="flex flex-col">
                      <span className="text-xs font-bold opacity-70" style={{ color: 'var(--color-charcoal)' }}>
                        {t.dueTime ? formatTimeOnly(t.dueTime) : 'All Day'}
                      </span>
                      <span className="text-sm font-bold truncate" style={{ color: 'var(--color-charcoal)' }}>
                        {t.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-medium opacity-70" style={{ color: 'var(--color-smoke)' }}>No tasks scheduled for today.</p>
                )}
              </div>
            </div>

            {/* Schedule Status Bottom Strip */}
            <div 
              className="flex items-center justify-between pt-3 border-t border-[var(--color-mist)] text-xs font-mono z-10"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--color-smoke)] font-medium">Schedule Status</span>
                <span className="text-[11px] text-[var(--color-smoke)] opacity-70 font-sans hidden sm:inline">({currentShortDate})</span>
              </div>
              <div className="flex items-center gap-2">
                {setShowReviewModal && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-[var(--color-mist)] bg-[var(--color-surface)] hover:bg-[var(--color-mist)]/50 transition-colors shadow-2xs font-sans"
                    style={{
                      color: todayReview ? 'var(--color-low-dot)' : 'var(--color-primary)',
                      backgroundColor: todayReview ? 'var(--color-low-bg)' : 'var(--color-surface)'
                    }}
                    title="Open Daily Review"
                  >
                    <BookOpen size={12} />
                    <span>{todayReview ? 'Reviewed' : 'Review'}</span>
                  </button>
                )}
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ 
                    backgroundColor: todayTasks.length === 0 ? 'var(--color-accent-subtle, var(--color-low-bg))' : 'var(--color-high-bg)', 
                    color: todayTasks.length === 0 ? 'var(--color-accent, var(--color-primary))' : 'var(--color-high-dot)' 
                  }}
                >
                  {todayTasks.length === 0 ? 'All caught up' : `${todayTasks.length} due today`}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {/* To do list */}
            <div 
              className="rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-xs border flex flex-col justify-between transition-colors duration-300" 
              style={{ 
                backgroundColor: 'var(--color-card-todo-bg, var(--color-surface))',
                borderColor: 'var(--color-card-todo-border, var(--color-mist))'
              }}
            >
              <div className="w-9 h-9 rounded-full bg-[var(--color-surface)]/60 flex items-center justify-center mb-4 md:mb-6 shadow-2xs border border-[var(--color-mist)]">
                <ListTodo size={18} style={{ color: 'var(--color-accent, var(--color-primary))' }} />
              </div>
              <div>
                <p className="text-xs font-bold opacity-70 mb-0.5 font-mono" style={{ color: 'var(--color-charcoal)' }}>{activeTasksCount} tasks</p>
                <h3 className="text-base md:text-lg font-bold leading-tight" style={{ color: 'var(--color-charcoal)' }}>To do list</h3>
              </div>
            </div>

            {/* In progress / Overview */}
            <div 
              className="rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-xs border flex flex-col justify-between transition-colors duration-300" 
              style={{ 
                backgroundColor: 'var(--color-card-overview-bg, var(--color-charcoal))',
                borderColor: 'var(--color-card-todo-border, transparent)',
                color: 'var(--color-card-overview-text, #FFFFFF)'
              }}
            >
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-4 md:mb-6">
                <Loader size={18} className="text-white animate-[spin_4s_linear_infinite]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80 mb-0.5 font-mono">{totalTasksCount} total tasks</p>
                <h3 className="text-base md:text-lg font-bold text-white leading-tight">Overview</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Filter chips with smooth horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full sm:w-auto -mx-1 px-1">
          {filters.map((f) => (
            <motion.button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium transition-smooth flex-shrink-0 ${
                activeFilter === f
                  ? 'shadow-xs border border-transparent font-semibold'
                  : 'surface text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] border border-[var(--color-mist)]'
              }`}
              style={activeFilter === f ? { 
                backgroundColor: 'var(--color-btn-new-bg, var(--color-primary))',
                color: 'var(--color-btn-new-text, #ffffff)'
              } : {}}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* View switch + Hide completed in a dedicated clean bar */}
        <div className="flex items-center justify-between sm:justify-end gap-3.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-mist)]/50">
          {/* List / Grid view toggle */}
          <div className="flex items-center p-0.5 rounded-xl border border-[var(--color-mist)] bg-[var(--color-mist)]/30">
            <button
              onClick={() => handleViewChange('list')}
              className={`p-1.5 rounded-lg transition-smooth ${
                viewMode === 'list'
                  ? 'bg-[var(--color-surface)] text-[var(--color-charcoal)] shadow-2xs font-semibold'
                  : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'
              }`}
              title="List view (mockup layout)"
              aria-label="List view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => handleViewChange('grid')}
              className={`p-1.5 rounded-lg transition-smooth ${
                viewMode === 'grid'
                  ? 'bg-[var(--color-surface)] text-[var(--color-charcoal)] shadow-2xs font-semibold'
                  : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'
              }`}
              title="Grid card view"
              aria-label="Grid card view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          {/* Hide completed toggle */}
          <button
            onClick={toggleHideCompleted}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div
              className="relative w-8 h-4.5 rounded-full transition-smooth"
              style={{ backgroundColor: hideCompleted ? 'var(--color-primary)' : 'var(--color-mist)' }}
            >
              <motion.div
                animate={{ x: hideCompleted ? 14 : 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow"
              />
            </div>
            <span className="text-xs font-semibold text-[var(--color-smoke)] group-hover:text-[var(--color-charcoal)] transition-smooth select-none">
              Hide completed
            </span>
          </button>
        </div>
      </div>

      {/* Task list / grid */}
      {tasksLoading ? (
        <div className="space-y-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-2xl shimmer-bg" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--color-mist)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-semibold text-[var(--color-charcoal)]">No tasks here</p>
          <p className="text-sm text-[var(--color-smoke)] mt-1">Create your first task using the + button</p>
        </motion.div>
      ) : viewMode === 'list' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start"
        >
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              task.category === 'study' 
                ? <StudyCard key={task.id} task={task} />
                : <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* FAB */}
      <FAB onClick={() => setShowModal(true)} />

      {/* Modal */}
      <AnimatePresence>
        {showModal && <CreateTaskModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
