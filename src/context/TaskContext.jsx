// src/context/TaskContext.jsx
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useGamification } from './GamificationContext';
import { isOverdueMoreThanWeek } from '../lib/dateUtils';
import {
  getTasks as fetchTasks,
  addTask as createTask,
  updateTask as modifyTask,
  deleteTask as removeTask,
  leaveTask as removeUserFromTask,
} from '../lib/firestore';

const TaskContext = createContext(null);

// Helper for demo dates
const getOffsetDateStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA');
};

// ─── Demo seed data (used when not authenticated / Firebase not configured) ───
const DEMO_TASKS = [
  {
    id: 'demo-1',
    title: 'Redesign Landing Page',
    dueDate: getOffsetDateStr(0), // Today
    priority: 'high',
    completed: false,
    subtasks: [
      { id: 's1', title: 'Create wireframes', done: true },
      { id: 's2', title: 'Design mockups in Figma', done: true },
      { id: 's3', title: 'Get stakeholder approval', done: false },
      { id: 's4', title: 'Implement responsive layout', done: false },
      { id: 's5', title: 'Run usability testing', done: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Q3 Marketing Campaign',
    dueDate: getOffsetDateStr(2),
    priority: 'medium',
    completed: false,
    subtasks: [
      { id: 's6', title: 'Define target audience', done: true },
      { id: 's7', title: 'Create content calendar', done: true },
      { id: 's8', title: 'Design ad creatives', done: true },
      { id: 's9', title: 'Set up analytics tracking', done: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Team Onboarding Docs',
    dueDate: getOffsetDateStr(-1),
    priority: 'low',
    completed: true,
    subtasks: [
      { id: 's10', title: 'Draft onboarding guide', done: true },
      { id: 's11', title: 'Record welcome video', done: true },
      { id: 's12', title: 'Set up access credentials', done: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'API Integration Sprint',
    dueDate: getOffsetDateStr(1),
    priority: 'high',
    completed: false,
    subtasks: [
      { id: 's13', title: 'Review API documentation', done: true },
      { id: 's14', title: 'Build authentication layer', done: true },
      { id: 's15', title: 'Write endpoint handlers', done: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Brand Style Guide',
    dueDate: getOffsetDateStr(4),
    priority: 'medium',
    completed: false,
    subtasks: [
      { id: 's16', title: 'Define color palette', done: true },
      { id: 's17', title: 'Select typography system', done: false },
      { id: 's18', title: 'Create logo variations', done: false },
      { id: 's19', title: 'Document component library', done: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    title: 'Daily Meditation',
    category: 'habit',
    type: 'individual',
    repeatDays: [0, 1, 2, 3, 4, 5, 6], // Every day
    priority: 'low',
    completed: false,
    createdAt: new Date('2026-06-12').toISOString(),
  },
  {
    id: 'demo-7',
    title: 'Read Atomic Habits',
    category: 'study',
    type: 'individual',
    totalPages: 320,
    currentPage: 45,
    priority: 'medium',
    completed: false,
    createdAt: new Date('2026-06-01').toISOString(),
  },
  {
    id: 'demo-8',
    title: 'Client Presentation Sync',
    type: 'team',
    members: ['demo-user', 'colleague-1', 'colleague-2'],
    dueDate: '2026-06-22',
    dueTime: '14:00',
    priority: 'high',
    completed: false,
    subtasks: [
      { id: 's20', title: 'Prepare slide deck', done: true },
      { id: 's21', title: 'Gather metric reports', done: false },
      { id: 's22', title: 'Rehearse speaking points', done: false },
    ],
    createdAt: new Date('2026-06-13').toISOString(),
  },
];

const calculateNextOccurrence = (dateStr, repeatDays) => {
  if (!repeatDays || repeatDays.length === 0 || !dateStr) return null;
  const current = new Date(dateStr);
  for (let i = 1; i <= 7; i++) {
    current.setDate(current.getDate() + 1);
    if (repeatDays.includes(current.getDay())) {
      return current.toISOString().split('T')[0];
    }
  }
  return null;
};

export function TaskProvider({ children }) {
  const { currentUser, isDemoMode } = useAuth();
  const gamification = useGamification();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const completingTasks = useRef(new Set());

  const autoCleanExpiredTasks = useCallback((taskList) => {
    let hasChanges = false;
    const cleaned = taskList.map(t => {
      if (!t.completed && !t.deleted && isOverdueMoreThanWeek(t.dueDate, t.dueTime)) {
        hasChanges = true;
        return { ...t, deleted: true, deletedAt: new Date().toISOString(), autoArchived: true };
      }
      return t;
    });
    return { cleaned, hasChanges };
  }, []);

  const loadTasks = useCallback(async () => {
    if (isDemoMode) {
      const saved = localStorage.getItem('taskflow-demo-tasks');
      const baseTasks = saved ? JSON.parse(saved) : DEMO_TASKS;
      const { cleaned, hasChanges } = autoCleanExpiredTasks(baseTasks);
      setTasks(cleaned);
      if (hasChanges || !saved) {
        localStorage.setItem('taskflow-demo-tasks', JSON.stringify(cleaned));
      }
      setTasksLoading(false);
      return;
    }

    if (!currentUser) {
      setTasks([]);
      return;
    }
    setTasksLoading(true);
    try {
      const data = await fetchTasks(currentUser.uid);
      const { cleaned, hasChanges } = autoCleanExpiredTasks(data);
      setTasks(cleaned);
      if (hasChanges) {
        cleaned.filter(t => t.autoArchived).forEach(t => {
          modifyTask(t.id, { deleted: true, deletedAt: t.deletedAt }).catch(console.error);
        });
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setTasks([]); // Clean slate on error for authenticated users
    } finally {
      setTasksLoading(false);
    }
  }, [currentUser, isDemoMode, autoCleanExpiredTasks]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ─── Overdue Cleanup & Daily Check ──────────────────────────────────────────
  useEffect(() => {
    if (tasksLoading || tasks.length === 0) return;

    // 1. Move tasks overdue for more than 7 days into Trash automatically
    const expired = tasks.filter(t => !t.completed && !t.deleted && isOverdueMoreThanWeek(t.dueDate, t.dueTime));
    if (expired.length > 0) {
      setTasks(prev => {
        const next = prev.map(t => {
          if (!t.completed && !t.deleted && isOverdueMoreThanWeek(t.dueDate, t.dueTime)) {
            return { ...t, deleted: true, deletedAt: new Date().toISOString() };
          }
          return t;
        });
        if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
        return next;
      });
      if (currentUser && !isDemoMode) {
        expired.forEach(t => {
          modifyTask(t.id, { deleted: true, deletedAt: new Date().toISOString() }).catch(console.error);
        });
      }
    }

    // 2. Gamification Streak check
    if (!gamification.profile) return;
    const today = new Date().toLocaleDateString('en-CA');
    if (gamification.profile.lastCheckDate !== today) {
      const hasOverdue = tasks.some(t => t.dueDate && t.dueDate < today && !t.completed);
      if (hasOverdue) {
        const shieldShattered = gamification.shatterShield();
        if (!shieldShattered) {
          gamification.resetStreak();
        }
      }
      gamification.setLastCheckDate(today);
    }
  }, [tasks, tasksLoading, gamification, isDemoMode, currentUser]);

  // ─── Evaluate Gamification Completion ─────────────────────────────────────────
  const evaluateCompletion = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const today = new Date().toLocaleDateString('en-CA');
    if (!task.dueDate || task.dueDate >= today) {
      gamification.awardPoints(1);
      gamification.incrementStreak();
    }

    // Check Flawless Day
    // Are all tasks due today completed? (Counting this one as completed)
    const dueToday = tasks.filter(t => t.dueDate === today);
    if (dueToday.length > 0) {
      const allDone = dueToday.every(t => t.id === taskId ? true : t.completed);
      if (allDone) {
        gamification.awardFlawlessDay();
      }
    }
  }, [tasks, gamification]);

  const addTask = async (taskData) => {
    const newTask = {
      id: `local-${Date.now()}`,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks((prev) => {
      const next = [newTask, ...prev];
      if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
      return next;
    });

    if (currentUser && !isDemoMode) {
      try {
        const id = await createTask(currentUser.uid, taskData);
        setTasks((prev) => prev.map((t) => t.id === newTask.id ? { ...t, id } : t));
        return id;
      } catch (err) {
        console.error('Failed to persist task:', err);
      }
    }
    return newTask.id;
  };

  const handleTaskCompleted = async (taskId) => {
    evaluateCompletion(taskId);
    
    // Check if task needs to spawn next occurrence
    const task = tasks.find(t => t.id === taskId);
    if (task && task.repeatDays && task.repeatDays.length > 0 && task.dueDate) {
      const nextDate = calculateNextOccurrence(task.dueDate, task.repeatDays);
      if (nextDate) {
        const { id, completed, createdAt, ...rest } = task;
        const newTaskData = {
          ...rest,
          dueDate: nextDate,
          subtasks: task.subtasks ? task.subtasks.map(s => ({ ...s, done: false })) : [],
          ...(task.category === 'study' ? { currentPage: 0 } : {})
        };
        await addTask(newTaskData);
      }
    }
  };

  const updateTask = async (taskId, updates) => {
    const task = tasks.find(t => t.id === taskId);
    const newlyCompleted = updates.completed === true && task && !task.completed;

    if (newlyCompleted) {
      if (completingTasks.current.has(taskId)) return;
      completingTasks.current.add(taskId);
    } else if (updates.completed === false) {
      completingTasks.current.delete(taskId);
    }

    setTasks((prev) => {
      const next = prev.map((t) => t.id === taskId ? { ...t, ...updates } : t);
      if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
      return next;
    });
    
    if (newlyCompleted) {
      handleTaskCompleted(taskId);
    }

    if (currentUser && !isDemoMode) {
      try {
        await modifyTask(taskId, updates);
      } catch (err) {
        console.error('Failed to update task:', err);
      }
    }
  };

  const deleteTask = async (taskId) => {
    // Soft delete: just update the deleted flag
    setTasks((prev) => {
      const next = prev.map((t) => t.id === taskId ? { ...t, deleted: true, deletedAt: new Date().toISOString() } : t);
      if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
      return next;
    });
    if (currentUser && !isDemoMode) {
      try {
        await modifyTask(taskId, { deleted: true, deletedAt: new Date().toISOString() });
      } catch (err) {
        console.error('Failed to soft delete task:', err);
      }
    }
  };

  const restoreTask = async (taskId) => {
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id !== taskId) return t;
        const { deleted, deletedAt, ...rest } = t;
        return rest;
      });
      if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
      return next;
    });
    if (currentUser && !isDemoMode) {
      try {
        await modifyTask(taskId, { deleted: false, deletedAt: null });
      } catch (err) {
        console.error('Failed to restore task:', err);
      }
    }
  };

  const permanentDeleteTask = async (taskId) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== taskId);
      if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
      return next;
    });
    if (currentUser && !isDemoMode) {
      await removeTask(taskId);
    }
  };

  const leaveTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (currentUser && !isDemoMode) {
      await removeUserFromTask(taskId, currentUser.uid);
    }
  };

  const toggleSubtask = (taskId, subtaskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentlyCompleted = task.completed;
    const updatedSubtasks = task.subtasks.map(s => s.id === subtaskId ? { ...s, done: !s.done } : s);
    const willBeCompleted = updatedSubtasks.every(s => s.done);
    const newlyCompleted = willBeCompleted && !currentlyCompleted;

    if (newlyCompleted) {
      if (completingTasks.current.has(taskId)) return;
      completingTasks.current.add(taskId);
    } else if (!willBeCompleted) {
      completingTasks.current.delete(taskId);
    }

    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, subtasks: updatedSubtasks, completed: willBeCompleted };
      });
      if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
      return next;
    });

    if (newlyCompleted) {
      handleTaskCompleted(taskId);
    }

    if (currentUser && !isDemoMode) {
      modifyTask(taskId, { subtasks: updatedSubtasks, completed: willBeCompleted }).catch(err => {
        console.error('Failed to update subtask:', err);
      });
    }
  };

  const updateTaskNote = (taskId, note) => {
    setTasks((prev) => {
      const next = prev.map((t) => t.id === taskId ? { ...t, note } : t);
      if (isDemoMode) localStorage.setItem('taskflow-demo-tasks', JSON.stringify(next));
      return next;
    });
    if (currentUser && !isDemoMode) {
      try {
        modifyTask(taskId, { note });
      } catch (err) {
        console.error('Failed to save note:', err);
      }
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, tasksLoading, addTask, updateTask, deleteTask, restoreTask, permanentDeleteTask, leaveTask, toggleSubtask, updateTaskNote, reload: loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
