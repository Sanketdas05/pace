// src/context/NotificationContext.jsx
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useTasks } from './TaskContext';
import { isOverdue, formatTimeOnly, formatDateTime } from '../lib/dateUtils';

const NotificationContext = createContext(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      dismissNotification: () => {},
      clearAllNotifications: () => {},
      toastPopupsEnabled: false,
      setToastPopupsEnabled: () => {},
    };
  }
  return context;
}

export function NotificationProvider({ children }) {
  const { tasks } = useTasks();

  // Toast popups setting: default false (Calm ambient notifications, no invasive toasts)
  const [toastPopupsEnabled, setToastPopupsEnabledState] = useState(() => {
    try {
      const saved = localStorage.getItem('pace-toast-popups');
      return saved !== null ? JSON.parse(saved) : false; // Calm mode by default
    } catch {
      return false;
    }
  });

  const setToastPopupsEnabled = useCallback((val) => {
    setToastPopupsEnabledState(val);
    try {
      localStorage.setItem('pace-toast-popups', JSON.stringify(val));
    } catch {}
  }, []);

  // Dismissed notification IDs (persisted per session)
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pace-dismissed-notifications');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const dismissNotification = useCallback((id) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        sessionStorage.setItem('pace-dismissed-notifications', JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  // Derive notifications from tasks
  const notifications = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const list = [];
    const now = new Date();

    tasks.forEach((task) => {
      if (task.completed || task.deleted) return;

      // 1. Overdue tasks
      if (task.dueDate && isOverdue(task.dueDate, task.dueTime)) {
        const id = `overdue-${task.id}`;
        if (!dismissedIds.has(id)) {
          list.push({
            id,
            taskId: task.id,
            type: 'overdue',
            title: task.title,
            priority: task.priority,
            message: 'Task deadline has passed',
            time: task.dueDate ? formatDateTime(task.dueDate, task.dueTime) : 'Past due',
            isUrgent: true,
          });
        }
        return;
      }

      // 2. Approaching deadlines (< 60 minutes)
      if (task.dueDate && task.dueTime) {
        const dueTime = new Date(`${task.dueDate}T${task.dueTime}`);
        const diffMins = Math.floor((dueTime - now) / 60000);
        if (diffMins > 0 && diffMins <= 60) {
          const id = `due-soon-${task.id}`;
          if (!dismissedIds.has(id)) {
            list.push({
              id,
              taskId: task.id,
              type: 'due-soon',
              title: task.title,
              priority: task.priority,
              message: diffMins <= 15 ? `Due in ${diffMins}m! Complete to protect streak.` : `Due in ${diffMins} minutes`,
              time: formatTimeOnly(task.dueTime),
              isUrgent: diffMins <= 15,
            });
          }
        }
      }
    });

    return list;
  }, [tasks, dismissedIds]);

  const clearAllNotifications = useCallback(() => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      try {
        sessionStorage.setItem('pace-dismissed-notifications', JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.length,
        dismissNotification,
        clearAllNotifications,
        toastPopupsEnabled,
        setToastPopupsEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
