import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { Bell, MessageSquare, Clock } from 'lucide-react';
import { isOverdue } from '../../lib/dateUtils';

export default function GlobalNotificationListener() {
  const { tasks } = useTasks();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const listenersRef = useRef({});
  const initialLoadRef = useRef({});
  const alertedTasksRef = useRef(new Set());

  // 1. Listen for new chat messages
  useEffect(() => {
    if (!currentUser || !tasks || tasks.length === 0) return;
    
    // Only team tasks
    const teamTasks = tasks.filter(t => !t.deleted && (t.type === 'team' || (t.members && t.members.length > 1)));
    
    teamTasks.forEach(task => {
      if (!listenersRef.current[task.id]) {
        initialLoadRef.current[task.id] = true;
        
        const q = query(collection(db, 'tasks', task.id, 'messages'), orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          // Skip initial load
          if (initialLoadRef.current[task.id]) {
            initialLoadRef.current[task.id] = false;
            return;
          }
          
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const msg = change.doc.data();
              
              // Prevent toast if sender is current user or user is already viewing the chat
              if (msg.senderId !== currentUser.uid && location.pathname !== `/task/${task.id}`) {
                toast.custom((t) => (
                  <motion.div 
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (Math.abs(info.offset.x) > 50) {
                        toast.dismiss(t.id);
                      }
                    }}
                    onClick={() => {
                      toast.dismiss(t.id);
                      navigate(`/task/${task.id}`);
                    }}
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'} cursor-pointer max-w-sm w-full bg-[var(--color-surface)] shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-[var(--color-mist)] overflow-hidden`}
                  >
                    <div className="flex-1 w-0 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 relative mt-1">
                           {msg.senderPhoto ? (
                             <img className="h-10 w-10 rounded-full object-cover" src={msg.senderPhoto} alt="" />
                           ) : (
                             <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                               {msg.senderName?.[0]?.toUpperCase() || 'U'}
                             </div>
                           )}
                           <div className="absolute -bottom-1 -right-1 bg-[var(--color-surface)] rounded-full p-0.5">
                             <div className="bg-[var(--color-primary)] rounded-full p-1 text-white">
                               <MessageSquare size={10} />
                             </div>
                           </div>
                        </div>
                        <div className="ml-1 flex-1">
                          <p className="text-sm font-bold text-[var(--color-charcoal)]">
                            {msg.senderName}
                          </p>
                          <p className="text-[10px] font-bold text-[var(--color-smoke)] uppercase tracking-wide mb-1">
                            In {task.title}
                          </p>
                          <p className="text-xs text-[var(--color-charcoal)] line-clamp-2 leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ), { duration: 35000, position: 'top-center' });
              }
            }
          });
        });
        
        listenersRef.current[task.id] = unsubscribe;
      }
    });
    
    // Cleanup old listeners if task is removed
    const currentTaskIds = teamTasks.map(t => t.id);
    Object.keys(listenersRef.current).forEach(taskId => {
      if (!currentTaskIds.includes(taskId)) {
        listenersRef.current[taskId]();
        delete listenersRef.current[taskId];
        delete initialLoadRef.current[taskId];
      }
    });
    
  }, [tasks, currentUser, location.pathname, navigate]);

  // 2. Poll for overdue/approaching deadline tasks
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const checkDeadlines = () => {
      tasks.forEach(task => {
        if (task.completed || task.deleted || !task.dueDate || !task.dueTime) return;
        
        const target = new Date(`${task.dueDate}T${task.dueTime}`);
        const now = new Date();
        const diffMs = target - now;
        const diffMins = Math.floor(diffMs / 60000);
        
        let milestone = null;
        let text = '';
        if (diffMins <= 0) {
          milestone = 'overdue';
          text = 'Task Overdue!';
        } else if (diffMins <= 5) {
          milestone = '5m';
          text = 'Due in less than 5 mins!';
        } else if (diffMins <= 10) {
          milestone = '10m';
          text = 'Due in 10 mins!';
        } else if (diffMins <= 15) {
          milestone = '15m';
          text = 'Due in 15 mins!';
        } else if (diffMins <= 30) {
          milestone = '30m';
          text = 'Due in 30 mins!';
        }
        
        if (milestone) {
          const alertKey = `${task.id}-${milestone}`;
          if (!alertedTasksRef.current.has(alertKey)) {
            alertedTasksRef.current.add(alertKey);
            
            toast.custom((t) => (
              <motion.div 
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (Math.abs(info.offset.x) > 50) {
                    toast.dismiss(t.id);
                  }
                }}
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate(`/task/${task.id}`);
                }}
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} cursor-pointer max-w-sm w-full bg-[var(--color-surface)] shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-[var(--color-mist)] p-4 hover:scale-105 transition-transform`}
              >
                <div className={`rounded-full w-10 h-10 flex items-center justify-center shrink-0 ${milestone === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  <Clock size={20} />
                </div>
                <div className="ml-3 flex-1">
                   <p className="text-sm font-bold text-[var(--color-charcoal)]">{text}</p>
                   <p className="text-xs text-[var(--color-smoke)] mt-1 line-clamp-1">{task.title}</p>
                </div>
              </motion.div>
            ), { duration: 35000, position: 'top-center' });
          }
        }
      });
    };

    // Check immediately and then every minute
    checkDeadlines();
    const interval = setInterval(checkDeadlines, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  return null;
}
