import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Users, Link as LinkIcon, Check, Clock, Trash2, CheckCircle2, X, AlertTriangle, Pencil, LogOut, Briefcase, BookOpen, Sun, ShoppingCart, Plane, Dumbbell, ClipboardList, MessageSquare, FileText } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { subscribeToMessages, sendMessage, getUserProfile } from '../lib/firestore';
import CircularProgress from '../components/tasks/CircularProgress';
import SubtaskItem from '../components/tasks/SubtaskItem';
import PriorityBadge from '../components/ui/PriorityBadge';
import { formatDateTime, formatTimeOnly, getTimeRemaining, isOverdue } from '../lib/dateUtils';
import { CalendarDays } from 'lucide-react';
import EditTaskModal from '../components/tasks/EditTaskModal';

const CATEGORY_ICONS = {
  work: Briefcase,
  study: BookOpen,
  daily: Sun,
  groceries: ShoppingCart,
  travel: Plane,
  workout: Dumbbell,
};

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, toggleSubtask, updateTaskNote, updateTask, deleteTask, leaveTask } = useTasks();
  const { currentUser, isDemoMode } = useAuth();
  
  const task = tasks.find(t => t.id === taskId);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'chat'
  const [memberProfiles, setMemberProfiles] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  const isStudy = task?.category === 'study';
  const done = isStudy ? task.currentPage : (task?.subtasks?.filter((s) => s.done).length || 0);
  const total = isStudy ? task.totalPages : (task?.subtasks?.length || 0);
  const isTeam = task?.type === 'team';

  const overdue = task ? (isOverdue(task.dueDate, task.dueTime) && !task.completed) : false;
  const remaining = task && !task.completed ? getTimeRemaining(task.dueDate, task.dueTime) : null;

  // Fetch member profiles
  useEffect(() => {
    if (!task || !task.members || !isTeam) return;
    const fetchMembers = async () => {
      if (isDemoMode) {
        setMemberProfiles([{ uid: 'demo-user', displayName: 'Demo User', alias: 'Demo' }]);
        return;
      }
      try {
        const profiles = await Promise.all(
          task.members.map(async (uid) => {
            const p = await getUserProfile(uid);
            return p ? { uid, ...p } : { uid, displayName: 'User', alias: 'User' };
          })
        );
        setMemberProfiles(profiles);
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };
    fetchMembers();
  }, [task?.members, isTeam, isDemoMode]);

  // Load chat messages
  useEffect(() => {
    if (isDemoMode) {
      // Load from local storage for demo mode
      const saved = localStorage.getItem(`taskflow-chat-${taskId}`);
      if (saved) setMessages(JSON.parse(saved));
      return;
    }
    
    // Real Firestore subscription
    const unsubscribe = subscribeToMessages(taskId, (newMsgs) => {
      setMessages(newMsgs);
    });
    return () => unsubscribe();
  }, [taskId, isDemoMode]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-[var(--color-smoke)] mb-4">Task not found or loading...</p>
        <button onClick={() => navigate('/')} className="text-[var(--color-primary)] font-semibold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleIncrementPage = (amount) => {
    const newPage = Math.min(task.currentPage + amount, task.totalPages);
    updateTask(task.id, { currentPage: newPage, completed: newPage >= task.totalPages });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (isDemoMode) {
      const msg = {
        id: Date.now().toString(),
        text: newMessage,
        senderId: 'demo-user',
        senderName: 'Demo User',
        timestamp: { toDate: () => new Date() }
      };
      const updated = [...messages, msg];
      setMessages(updated);
      localStorage.setItem(`taskflow-chat-${taskId}`, JSON.stringify(updated));
      setNewMessage('');
      return;
    }

    try {
      await sendMessage(taskId, currentUser, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}/join/${taskId}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate('/');
  };

  const handleLeave = () => {
    leaveTask(task.id);
    navigate('/');
  };

  const handleToggleComplete = () => {
    if (task.completed) return; // Disallow un-completing

    const incompleteSubtasks = task.subtasks?.filter(s => !s.done);
    if (incompleteSubtasks && incompleteSubtasks.length > 0) {
      setShowWarning(true);
      return;
    }

    updateTask(task.id, { completed: true });
  };

  const confirmComplete = () => {
    const updatedSubtasks = task.subtasks.map(s => ({ ...s, done: true }));
    updateTask(task.id, { completed: true, subtasks: updatedSubtasks });
    setShowWarning(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:flex-row gap-6">
      {/* Mobile Tab Bar */}
      {isTeam && (
        <div className="lg:hidden flex p-1 mb-2 bg-[var(--color-bg)] rounded-xl border border-[var(--color-mist)] shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-smooth ${activeTab === 'details' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-charcoal)]' : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'}`}
          >
            <FileText size={14} className={activeTab === 'details' ? 'text-[var(--color-primary)]' : ''} /> Details
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-smooth ${activeTab === 'chat' ? 'bg-[var(--color-surface)] shadow-sm text-[var(--color-charcoal)]' : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'}`}
          >
            <MessageSquare size={14} className={activeTab === 'chat' ? 'text-[var(--color-primary)]' : ''} /> Team Chat
          </button>
        </div>
      )}

      {/* ── Left Column: Task Details ── */}
      <div className={`flex-1 flex-col surface rounded-2xl shadow-card overflow-hidden relative ${isTeam && activeTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-mist)]">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] transition-smooth"
            >
              <ChevronLeft size={14} /> Back to tasks
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 md:gap-4">
            <div className="w-full">
              <h1 className={`text-2xl font-bold leading-tight mb-3 flex items-center gap-3 ${task.completed ? 'line-through text-[var(--color-smoke)]' : 'text-[var(--color-charcoal)]'}`}>
                {(() => {
                  const Icon = CATEGORY_ICONS[task.category] || ClipboardList;
                  return <Icon size={22} className="text-[var(--color-smoke)] shrink-0" />;
                })()}
                {task.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <PriorityBadge priority={task.priority} size="sm" />
                {task.dueDate && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    overdue || remaining?.isUrgent 
                      ? 'bg-[var(--color-high-bg)] text-[var(--color-high-dot)]' 
                      : 'bg-[var(--color-bg)] text-[var(--color-smoke)]'
                  }`}>
                    <CalendarDays size={12} />
                    {remaining ? remaining.text : (overdue ? 'Overdue · ' : '') + formatDateTime(task.dueDate, task.dueTime)}
                  </div>
                )}
                {!task.dueDate && task.dueTime && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-bg)] text-[var(--color-smoke)]">
                    <Clock size={12} />
                    {formatTimeOnly(task.dueTime)}
                  </div>
                )}
                {isTeam && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg)] text-[var(--color-primary)] rounded-full text-xs font-semibold">
                    <Users size={12} /> Team Task
                  </div>
                )}
                {task.repeatDays && task.repeatDays.length > 0 && (
                  <button
                    onClick={() => updateTask(task.id, { repeatDays: [] })}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-mist)] text-[var(--color-charcoal)] rounded-full text-xs font-semibold hover:bg-[var(--color-high-bg)] hover:text-red-500 transition-smooth"
                  >
                    <X size={12} /> Stop Repeating
                  </button>
                )}
              </div>
              
              {isTeam && memberProfiles.length > 0 && (
                <div className="flex items-center mt-4">
                  <div className="flex -space-x-2">
                    {memberProfiles.map(member => (
                      <div 
                        key={member.uid} 
                        className="w-8 h-8 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold shrink-0" 
                        title={member.displayName || member.alias || '?'}
                      >
                        {member.photoURL ? (
                          <img src={member.photoURL} alt={member.displayName || member.alias || '?'} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (member.displayName || member.alias || '?').charAt(0).toUpperCase()
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-[var(--color-smoke)] ml-3">
                    {memberProfiles.length} member{memberProfiles.length !== 1 && 's'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 border-t border-[var(--color-mist)] md:border-t-0 pt-4 md:pt-0">
              {total > 0 && <CircularProgress done={done} total={total} size={50} strokeWidth={4} />}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={handleToggleComplete}
                  disabled={task.completed}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-smooth border border-[var(--color-mist)] ${task.completed ? 'cursor-not-allowed opacity-80' : ''}`}
                  style={task.completed ? { backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' } : { backgroundColor: 'var(--color-bg)', color: 'var(--color-charcoal)' }}
                >
                  <CheckCircle2 size={14} className="shrink-0" /> {task.completed ? 'Completed' : 'Mark Complete'}
                </button>
                {(!task.type || task.type !== 'team' || currentUser?.uid === task.userId || isDemoMode) ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap text-[var(--color-smoke)] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-smooth border border-[var(--color-mist)] bg-[var(--color-bg)]"
                  >
                    <Trash2 size={14} className="shrink-0" /> {task.type === 'team' ? 'End it' : 'Move to Trash'}
                  </button>
                ) : task.type === 'team' ? (
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap text-[var(--color-smoke)] hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-smooth border border-[var(--color-mist)] bg-[var(--color-bg)]"
                  >
                    <LogOut size={14} className="shrink-0" /> Leave
                  </button>
                ) : null}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center p-2 rounded-lg text-[var(--color-smoke)] hover:bg-[var(--color-mist)] hover:text-[var(--color-charcoal)] transition-smooth border border-[var(--color-mist)] bg-[var(--color-bg)]"
                title="Edit Task"
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Subtasks / Study Progress */}
          {total > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[var(--color-charcoal)] mb-3">
                {isStudy ? 'Study Progress' : 'Action Items'} ({done}/{total})
              </h3>
              
              {isStudy ? (
                <div className="bg-[var(--color-bg)] p-5 rounded-2xl border border-[var(--color-mist)]">
                  <div className="h-2 bg-[var(--color-mist)] rounded-full overflow-hidden mb-5 relative">
                    <motion.div
                      className="absolute top-0 left-0 bottom-0 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((done / total) * 100, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  
                  {!task.completed && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleIncrementPage(1)}
                        className="flex-1 py-2.5 rounded-xl border border-[var(--color-mist)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-sm font-semibold text-[var(--color-smoke)] transition-smooth flex items-center justify-center gap-2"
                      >
                        +1 Page/Item
                      </button>
                      <button
                        onClick={() => handleIncrementPage(5)}
                        className="flex-1 py-2.5 rounded-xl border border-[var(--color-mist)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-sm font-semibold text-[var(--color-smoke)] transition-smooth flex items-center justify-center gap-2"
                      >
                        +5 Pages/Items
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {task.subtasks.map((subtask) => (
                    <SubtaskItem
                      key={subtask.id}
                      subtask={subtask}
                      onToggle={(sid) => toggleSubtask(task.id, sid)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-charcoal)] mb-3">Task Notes</h3>
            <textarea
              value={task.note || ''}
              onChange={(e) => updateTaskNote(task.id, e.target.value)}
              placeholder="Add extended notes, ideas, or references here..."
              className="w-full min-h-[120px] p-4 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-smoke)]/60 focus:outline-none focus:border-forest/50 transition-smooth resize-none"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1.5px solid var(--color-mist)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-mist)'}
            />
          </div>

          {/* Share Link (Team Only) */}
          {isTeam && (
            <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-mist)]">
              <h3 className="text-sm font-bold text-[var(--color-charcoal)] mb-1">Collaboration Invite</h3>
              <p className="text-xs text-[var(--color-smoke)] mb-4">Send this link to team members so they can join and chat.</p>
              
              <button
                onClick={copyInviteLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold text-sm transition-smooth"
                style={{ backgroundColor: linkCopied ? 'var(--color-charcoal)' : 'var(--color-primary)' }}
              >
                {linkCopied ? <Check size={16} /> : <LinkIcon size={16} />}
                {linkCopied ? 'Link Copied!' : 'Copy Invite Link'}
              </button>
            </div>
          )}
        </div>

        {/* Inline Confirmation Cards */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-surface)]/95 backdrop-blur-md p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-charcoal)] mb-2">Move to Trash?</h2>
              <p className="text-[var(--color-smoke)] mb-8 max-w-sm">
                This will move the task to your Trash. You can restore it later if you change your mind.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2.5 rounded-xl font-semibold border border-[var(--color-mist)] text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] transition-smooth"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-smooth shadow-sm"
                >
                  Yes, move to trash
                </button>
              </div>
            </motion.div>
          )}

          {showLeaveConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-surface)]/95 backdrop-blur-md p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                <LogOut size={24} />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-charcoal)] mb-2">Leave Team Task?</h2>
              <p className="text-[var(--color-smoke)] mb-8 max-w-sm">
                Are you sure you want to leave this team task? You will no longer receive updates or have access to the team chat.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="px-6 py-2.5 rounded-xl font-semibold border border-[var(--color-mist)] text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] transition-smooth"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeave}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-smooth shadow-sm"
                >
                  Yes, leave task
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Right Column: Inbox / Chat ── */}
      {isTeam && (
        <div className={`flex-1 lg:max-w-md flex-col surface rounded-2xl shadow-card overflow-hidden ${activeTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="p-4 border-b border-[var(--color-mist)] flex items-center justify-between bg-[var(--color-bg)]">
            <div className="flex items-center gap-2">
              <Users size={18} style={{ color: 'var(--color-primary)' }} />
              <h2 className="font-bold text-[var(--color-charcoal)] text-sm">Task Inbox</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-bg)]/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-12 h-12 bg-[var(--color-mist)] rounded-full flex items-center justify-center mb-3">
                  <Send size={18} className="text-[var(--color-smoke)] ml-1" />
                </div>
                <p className="text-sm font-semibold text-[var(--color-charcoal)]">No messages yet</p>
                <p className="text-xs text-[var(--color-smoke)] mt-1 max-w-[200px]">Send a message to start collaborating with your team.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = isDemoMode ? msg.senderId === 'demo-user' : msg.senderId === currentUser?.uid;
                
                // Format timestamp
                let timeStr = '';
                if (msg.timestamp) {
                  const d = typeof msg.timestamp.toDate === 'function' ? msg.timestamp.toDate() : new Date(msg.timestamp);
                  timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                return (
                  <motion.div
                    key={msg.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {!isMe && <span className="text-[10px] font-semibold text-[var(--color-smoke)] mb-1 ml-1">{msg.senderName}</span>}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${
                        isMe
                          ? 'rounded-br-sm text-white'
                          : 'rounded-bl-sm bg-[var(--color-surface)] text-[var(--color-charcoal)] shadow-sm border border-[var(--color-mist)]'
                      }`}
                      style={isMe ? { backgroundColor: 'var(--color-primary)' } : {}}
                    >
                      {msg.text}
                    </div>
                    {timeStr && (
                      <span className="text-[9px] text-[var(--color-smoke)] mt-1 mr-1 flex items-center gap-1">
                        <Clock size={8} /> {timeStr}
                      </span>
                    )}
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-[var(--color-mist)] bg-[var(--color-bg)] flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message team..."
              className="flex-1 px-4 py-2.5 rounded-full border border-[var(--color-mist)] bg-transparent text-sm text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-forest/10 transition-smooth"
              style={{
                border: '1px solid var(--color-mist)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-mist)'}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 disabled:opacity-50 transition-smooth"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      )}

      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWarning(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative surface p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-[var(--color-mist)]"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-high-bg)] text-[var(--color-high-dot)] flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-charcoal)] mb-2">
                Incomplete Subtasks
              </h2>
              <p className="text-sm text-[var(--color-smoke)] mb-6">
                You have unfinished action items. Are you sure you want to mark this task as complete?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWarning(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-mist)] text-sm font-semibold text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-mist)]/50 transition-smooth"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmComplete}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-smooth"
                  style={{ backgroundColor: 'var(--color-high-dot)' }}
                >
                  Yes, Complete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {isEditing && <EditTaskModal task={task} onClose={() => setIsEditing(false)} />}
    </div>
  );
}
