// src/pages/TasksPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useGamification, getUserTitle } from '../context/GamificationContext';
import { Flame, Shield, Plus, Bell, User, ListTodo, Loader } from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';
import StudyCard from '../components/tasks/StudyCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import FAB from '../components/ui/FAB';
import { formatTimeOnly } from '../lib/dateUtils';

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
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = currentUser?.displayName || 'User';

  const [hideCompleted, setHideCompleted] = useState(() => localStorage.getItem('taskflow-hide-completed') === 'true');

  const toggleHideCompleted = () => {
    const next = !hideCompleted;
    setHideCompleted(next);
    localStorage.setItem('taskflow-hide-completed', next.toString());
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'Trash') return t.deleted;
    if (t.deleted) return false;

    if (activeFilter === 'Completed') return t.completed;
    if (hideCompleted && t.completed) return false;
    
    if (activeFilter === 'All') return true;
    return t.priority === activeFilter.toLowerCase();
  });

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 16) greeting = 'Good afternoon';

  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayTasks = tasks.filter(t => !t.completed && !t.deleted && t.dueDate === todayStr).slice(0, 3);
  const activeTasksCount = tasks.filter(t => !t.completed && !t.deleted).length;
  const totalTasksCount = tasks.filter(t => !t.deleted).length;

  const notifications = [
    ...tasks.filter(t => {
      if (t.completed || t.deleted || !t.dueDate || !t.dueTime) return false;
      const diffMins = Math.floor((new Date(`${t.dueDate}T${t.dueTime}`) - new Date()) / 60000);
      return diffMins <= 30 && diffMins >= -60; // Show tasks approaching <30m or recently overdue <60m
    }).slice(0, 2).map(t => ({
      id: `due-${t.id}`,
      taskId: t.id,
      type: 'alert',
      text: `Task "${t.title}" is due soon!`,
      time: t.dueTime ? formatTimeOnly(t.dueTime) : 'Today'
    }))
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[var(--color-smoke)] text-sm font-semibold mb-1">
              {greeting},
            </p>
            <h1 className="text-3xl font-bold text-[var(--color-charcoal)] flex items-center gap-3">
              {displayName}!
              {profile?.streak > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-[var(--color-high-bg)] text-[var(--color-high-dot)] rounded-xl text-xs font-bold">
                  <Flame size={14} /> {profile.streak}
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full border border-[var(--color-mist)] flex items-center justify-center text-[var(--color-charcoal)] bg-[var(--color-surface)] relative shadow-sm hover:scale-105 transition-transform"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[var(--color-high-dot)]"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-64 bg-[var(--color-surface)] border border-[var(--color-mist)] rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-[var(--color-mist)] bg-[var(--color-bg)]">
                      <h3 className="font-bold text-sm text-[var(--color-charcoal)]">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              setShowNotifications(false);
                              navigate(`/task/${n.taskId}`);
                            }}
                            className="p-3 border-b border-[var(--color-mist)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                          >
                            <p className="text-xs font-semibold text-[var(--color-charcoal)] leading-tight">{n.text}</p>
                            <p className="text-[10px] text-[var(--color-smoke)] mt-1 font-bold">{n.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-[var(--color-smoke)] font-bold">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/settings" className="lg:hidden w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-sm font-bold shadow-[var(--color-primary)]/30 overflow-hidden border-2 border-[var(--color-surface)] hover:scale-105 transition-transform">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </Link>
            
            <motion.button
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm transition-smooth shadow-[var(--color-primary)]/20"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus size={18} strokeWidth={2.5} />
              New Task
            </motion.button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Today Card */}
          <div className="lg:col-span-2 rounded-3xl p-6 shadow-sm border border-[var(--color-mist)] flex flex-col gap-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-medium-bg)' }}>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-charcoal)' }}>Today</h2>
            <div className="space-y-3 z-10 flex-1">
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
                <p className="text-sm font-semibold opacity-70" style={{ color: 'var(--color-charcoal)' }}>No tasks scheduled for today.</p>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {/* To do list */}
            <div className="rounded-3xl p-5 shadow-sm border border-[var(--color-mist)] flex flex-col justify-between" style={{ backgroundColor: 'var(--color-low-bg)' }}>
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)]/50 flex items-center justify-center mb-6">
                <ListTodo size={20} style={{ color: 'var(--color-low-dot)' }} />
              </div>
              <div>
                <p className="text-xs font-bold opacity-70 mb-0.5" style={{ color: 'var(--color-charcoal)' }}>{activeTasksCount} tasks</p>
                <h3 className="text-lg font-bold leading-tight" style={{ color: 'var(--color-charcoal)' }}>To do list</h3>
              </div>
            </div>

            {/* In progress / Overview */}
            <div className="rounded-3xl p-5 shadow-sm border border-[var(--color-mist)] flex flex-col justify-between" style={{ backgroundColor: 'var(--color-primary)' }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <Loader size={20} className="text-white animate-[spin_4s_linear_infinite]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80 mb-0.5">{totalTasksCount} total tasks</p>
                <h3 className="text-lg font-bold text-white leading-tight">Overview</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <motion.button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-smooth ${
                activeFilter === f
                  ? 'text-white shadow-sm border border-transparent'
                  : 'surface text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] border border-[var(--color-mist)]'
              }`}
              style={activeFilter === f ? { backgroundColor: 'var(--color-primary)' } : {}}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Hide completed toggle */}
        <button
          onClick={toggleHideCompleted}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div
            className="relative w-9 h-5 rounded-full transition-smooth"
            style={{ backgroundColor: hideCompleted ? 'var(--color-primary)' : 'var(--color-mist)' }}
          >
            <motion.div
              animate={{ x: hideCompleted ? 18 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute top-1 w-3 h-3 bg-white rounded-full shadow"
            />
          </div>
          <span className="text-xs font-semibold text-[var(--color-smoke)] group-hover:text-[var(--color-charcoal)] transition-smooth">
            Hide completed
          </span>
        </button>
      </div>

      {/* Task grid */}
      {tasksLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl shimmer-bg" />
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
