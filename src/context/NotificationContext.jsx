import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTasks } from './TaskContext';
import { Bell, X, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { tasks, updateTask } = useTasks();
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Timer to check tasks every minute
  useEffect(() => {
    // Request permission for mobile/desktop native notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (!tasks || tasks.length === 0) return;

    const checkTasks = () => {
      const now = new Date();
      
      const intervals = [
        { mins: 60, key: 'notified60m', title: '1 Hour Left!' },
        { mins: 30, key: 'notified30m', title: '30 Minutes Left!' },
        { mins: 15, key: 'notified15m', title: '15 Minutes Left!' },
        { mins: 10, key: 'notified10m', title: '10 Minutes Left!' },
        { mins: 5,  key: 'notified5m',  title: '5 Minutes Left! Hurry!' },
      ];

      tasks.forEach(task => {
        if (task.completed || !task.dueDate || !task.dueTime) return;
        
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        const diffMs = dueDateTime - now;
        const diffMins = Math.floor(diffMs / (1000 * 60));

        // Skip if overdue
        if (diffMins < 0) return;

        // 1. Silently mark any intervals that have already passed as "notified"
        // This prevents a newly created 14-min task from triggering the 60m and 30m notifications
        const updates = {};
        let needsUpdate = false;
        
        intervals.forEach(interval => {
          if (diffMins < interval.mins - 2 && !task[interval.key]) {
            updates[interval.key] = true;
            needsUpdate = true;
          }
        });

        if (needsUpdate) {
          updateTask(task.id, updates);
        }

        // 2. Find the exact interval we are crossing right now
        for (const interval of intervals) {
          if (diffMins <= interval.mins && diffMins >= interval.mins - 2 && !task[interval.key] && !updates[interval.key]) {
            const message = `Time is running out for "${task.title}". Complete it to protect your streak.`;
            
            // In-App Toast
            addToast(interval.title, message, 'warning');
            
            // Native Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(reg => {
                  reg.showNotification(interval.title, { body: message, icon: '/pwa-192x192.png' });
                });
              } else {
                new Notification(interval.title, { body: message });
              }
            }

            // Mark as notified
            updateTask(task.id, { [interval.key]: true });
            break; // Only trigger one notification per cycle
          }
        }
      });
    };

    // Check immediately, then every minute
    checkTasks();
    const intervalId = setInterval(checkTasks, 60000);

    return () => clearInterval(intervalId);
  }, [tasks, addToast, updateTask]);

  return (
    <NotificationContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border ${
                toast.type === 'warning' 
                  ? 'bg-[var(--color-surface)] border-[var(--color-high-dot)] shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-[var(--color-high-dot)]/20' 
                  : 'bg-[var(--color-surface)] border-[var(--color-mist)] shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
              } w-80 relative overflow-hidden`}
            >
              <div className={`mt-0.5 ${toast.type === 'warning' ? 'text-[var(--color-high-dot)]' : 'text-[var(--color-primary)]'}`}>
                {toast.type === 'warning' ? <AlertTriangle size={20} /> : <Bell size={20} />}
              </div>
              
              <div className="flex-1 pr-6">
                <h4 className="text-sm font-bold text-[var(--color-charcoal)] mb-1">
                  {toast.title}
                </h4>
                <p className={`text-xs ${toast.type === 'warning' ? 'text-[var(--color-high-dot)] font-medium' : 'text-[var(--color-smoke)]'} leading-snug`}>
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className={`absolute top-3 right-3 p-1 rounded-md text-[var(--color-smoke)] transition-smooth ${
                  toast.type === 'warning' ? 'hover:bg-[var(--color-high-bg)] hover:text-[var(--color-high-dot)]' : 'hover:bg-[var(--color-mist)] hover:text-[var(--color-charcoal)]'
                }`}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
