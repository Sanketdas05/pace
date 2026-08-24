// src/components/tasks/CreateTaskModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Sparkles, ChevronRight, Check, Users, User, Book } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GROQ_URL, isDev, DEFAULT_AI_MODEL, parseAIJsonResponse } from '../../config/ai';


// ─── Priority Option ──────────────────────────────────────────────────────────
const priorityOptions = [
  { value: 'high', label: 'High', color: 'bg-terracotta/15 text-terracotta border-terracotta/30', dot: 'bg-terracotta' },
  { value: 'medium', label: 'Medium', color: 'bg-sand/30 text-[#B5823A] border-sand/50', dot: 'bg-sand' },
  { value: 'low', label: 'Low', color: 'bg-sage/15 text-sage border-sage/30', dot: 'bg-sage' },
];

export default function CreateTaskModal({ onClose }) {
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = task details, 2 = subtask method
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [taskType, setTaskType] = useState('individual');
  const [category, setCategory] = useState('work');
  const [repeatDays, setRepeatDays] = useState([]);
  const [subtaskMethod, setSubtaskMethod] = useState(null); // 'manual' | 'ai'
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'study', label: 'Study' },
    { value: 'daily', label: 'Daily' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'travel', label: 'Travel' },
    { value: 'workout', label: 'Workout' },
  ];

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleRepeatDay = (idx) => {
    setRepeatDays(prev => 
      prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx].sort()
    );
  };

  const handleStep1Next = () => {
    if (!title.trim()) return;
    setStep(2);
  };

  const handleSelectMethod = async (method) => {
    setSubtaskMethod(method);
    if (method === 'ai') {
      setAiLoading(true);
      setAiDone(false);
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (!isDev) {
          headers['Authorization'] = `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`;
        }
        
        const res = await fetch(GROQ_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: DEFAULT_AI_MODEL,
            messages: [{
              role: "system",
              content: "You are a subtask generator. Generate 3 to 5 actionable subtasks for the user's task. Return ONLY a JSON object with a 'subtasks' array containing strings."
            }, {
              role: "user",
              content: `Task: ${title}`
            }],
            response_format: { type: "json_object" },
            temperature: 0.7
          })
        });
        
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        const parsed = parseAIJsonResponse(data.choices[0].message.content);
        if (parsed.subtasks && Array.isArray(parsed.subtasks)) {
          setSubtasks(parsed.subtasks.map((t, i) => ({ id: `gen-${Date.now()}-${i}`, title: t, done: false })));
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        console.error("Failed to generate subtasks", err);
        setSubtasks([]);
      }
      setAiLoading(false);
      setAiDone(true);
    } else {
      setSubtasks([]);
    }
  };

  const addManualSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: `m-${Date.now()}`, title: newSubtask.trim(), done: false }]);
    setNewSubtask('');
  };

  const removeSubtask = (id) => setSubtasks((prev) => prev.filter((s) => s.id !== id));

  const handleCreate = async () => {
    if (!title.trim()) return;

    const isRepeatable = ['daily', 'workout', 'groceries', 'study'].includes(category) && repeatDays.length > 0;
    let finalDueDate = dueDate;

    if (!dueDate && isRepeatable) {
       const current = new Date();
       if (repeatDays.includes(current.getDay())) {
         finalDueDate = current.toISOString().split('T')[0];
       } else {
         for (let i = 1; i <= 7; i++) {
           current.setDate(current.getDate() + 1);
           if (repeatDays.includes(current.getDay())) {
             finalDueDate = current.toISOString().split('T')[0];
             break;
           }
         }
       }
    }

    const taskData = {
      title: title.trim(),
      dueDate: finalDueDate,
      dueTime,
      priority,
      type: taskType,
      category,
      subtasks: category !== 'study' ? subtasks : [],
      ...(category === 'study' ? { currentPage: Number(currentPage), totalPages: Number(totalPages) } : {}),
      ...(isRepeatable ? { repeatDays } : {})
    };
    const taskId = await addTask(taskData);
    onClose();
    if (taskId) {
      navigate('/');
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-md surface rounded-3xl shadow-modal pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 px-6 pt-5 pb-0">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-forest' : 'bg-[var(--color-mist)]'
                }`}
              />
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-[var(--color-charcoal)]">
                {step === 1 ? 'New Task' : 'Add Subtasks'}
              </h2>
              <p className="text-xs text-[var(--color-smoke)] mt-0.5">
                {step === 1 ? 'Step 1 of 2 — Task details' : 'Step 2 of 2 — Subtask creation'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-mist)] text-[var(--color-smoke)] transition-smooth"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              {/* ── STEP 1 ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                      Task Title
                    </label>
                    <input
                      id="task-title-input"
                      autoFocus
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStep1Next()}
                      placeholder="e.g. Redesign landing page..."
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm placeholder:text-[var(--color-smoke)]/60 focus:outline-none focus:border-forest/50 focus:ring-2 focus:ring-forest/10 transition-smooth"
                    />
                  </div>

                  {/* Due Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                        Due Date {['daily', 'workout', 'groceries'].includes(category) && repeatDays.length > 0 && '(Optional)'}
                      </label>
                      <DatePicker
                        id="task-due-date"
                        selected={dueDate ? new Date(dueDate) : null}
                        onChange={(date) => {
                          if (!date) setDueDate('');
                          else {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            setDueDate(`${year}-${month}-${day}`);
                          }
                        }}
                        dateFormat="MMM d, yyyy"
                        placeholderText="Select date"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-smooth"
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                        Time (Optional)
                      </label>
                      <DatePicker
                        id="task-due-time"
                        selected={dueTime ? new Date(`1970-01-01T${dueTime}`) : null}
                        onChange={(time) => {
                          if (!time) setDueTime('');
                          else {
                            const hours = String(time.getHours()).padStart(2, '0');
                            const minutes = String(time.getMinutes()).padStart(2, '0');
                            setDueTime(`${hours}:${minutes}`);
                          }
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        placeholderText="Select time"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-smooth"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {priorityOptions.map(({ value, label, color, dot }) => (
                        <button
                          key={value}
                          id={`priority-${value}`}
                          onClick={() => setPriority(value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-smooth ${
                            priority === value
                              ? `${color} ring-1 ring-current`
                              : 'border-[var(--color-mist)] text-[var(--color-smoke)] hover:border-[var(--color-smoke)]/40'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${priority === value ? dot : 'bg-[var(--color-mist)]'}`} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                      Task Category
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setCategory(opt.value)}
                          className={`py-2 rounded-xl border text-xs font-semibold transition-smooth ${
                            category === opt.value ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-mist)] text-[var(--color-smoke)] hover:border-[var(--color-smoke)]/40'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Repeat Days (Only for Daily/Workout/Groceries/Study) */}
                  {['daily', 'workout', 'groceries', 'study'].includes(category) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider">
                          Repeat On
                        </label>
                        <button
                          onClick={() => repeatDays.length === 7 ? setRepeatDays([]) : setRepeatDays([0, 1, 2, 3, 4, 5, 6])}
                          className="text-[10px] font-bold px-2 py-0.5 rounded border border-[var(--color-mist)] text-[var(--color-smoke)] hover:bg-[var(--color-high-bg)] hover:text-[var(--color-high-dot)] transition-colors"
                        >
                          Everyday
                        </button>
                      </div>
                      <div className="flex justify-between gap-1">
                        {DAYS.map((day, idx) => (
                          <button
                            key={day}
                            onClick={() => toggleRepeatDay(idx)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-smooth ${
                              repeatDays.includes(idx) ? 'bg-[var(--color-high-dot)] text-[var(--color-bg)]' : 'bg-[var(--color-mist)]/30 text-[var(--color-smoke)] hover:bg-[var(--color-high-bg)] hover:text-[var(--color-high-dot)]'
                            }`}
                          >
                            {day[0]}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Task Type Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                      Task Type
                    </label>
                    <div className="flex bg-[var(--color-mist)] p-1 rounded-xl">
                      <button
                        onClick={() => setTaskType('individual')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-smooth ${
                          taskType === 'individual' ? 'bg-[var(--color-surface)] text-[var(--color-charcoal)] shadow-sm' : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'
                        }`}
                      >
                        <User size={16} /> Individual
                      </button>
                      <button
                        onClick={() => setTaskType('team')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-smooth ${
                          taskType === 'team' ? 'bg-[var(--color-surface)] text-[var(--color-charcoal)] shadow-sm' : 'text-[var(--color-smoke)] hover:text-[var(--color-charcoal)]'
                        }`}
                      >
                        <Users size={16} /> Team
                      </button>
                    </div>
                  </div>

                  <button
                    id="modal-next-btn"
                    onClick={handleStep1Next}
                    disabled={!title.trim()}
                    className="w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed mt-2 hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22 }}
                >
                  {category === 'study' ? (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl mx-auto flex items-center justify-center mb-3">
                          <Book size={24} className="text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-charcoal)]">Study Tracker</h3>
                        <p className="text-xs text-[var(--color-smoke)] mt-1 max-w-[240px] mx-auto">
                          Track pages, chapters, or modules.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase mb-1.5">Current Page/Item</label>
                          <input
                            type="number"
                            value={currentPage}
                            onChange={(e) => setCurrentPage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-center text-xl font-bold"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase mb-1.5">Total Pages/Items</label>
                          <input
                            type="number"
                            value={totalPages}
                            onChange={(e) => setTotalPages(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-center text-xl font-bold"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 py-3 rounded-xl border border-[var(--color-mist)] text-sm font-semibold text-[var(--color-smoke)]"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleCreate}
                          disabled={!totalPages || totalPages <= 0}
                          className="flex-1 py-3 text-white text-sm font-semibold rounded-xl"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          Create Task
                        </button>
                      </div>
                    </div>
                  ) : !subtaskMethod ? (
                    <div className="space-y-3">
                      <p className="text-sm text-[var(--color-smoke)] mb-4">
                        How would you like to create subtasks for <span className="font-semibold text-[var(--color-charcoal)]">"{title}"</span>?
                      </p>

                      {/* Manual option */}
                      <motion.button
                        id="subtask-manual-btn"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectMethod('manual')}
                        className="w-full p-4 rounded-2xl border-2 border-[var(--color-mist)] hover:border-forest/40 hover:bg-forest/5 transition-smooth text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-forest/10 group-hover:bg-forest/15 rounded-xl flex items-center justify-center transition-smooth">
                            <Plus size={20} className="text-forest" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[var(--color-charcoal)]">Manual Entry</p>
                            <p className="text-xs text-[var(--color-smoke)] mt-0.5">Type individual subtasks yourself</p>
                          </div>
                        </div>
                      </motion.button>

                      {/* AI option */}
                      <motion.button
                        id="subtask-ai-btn"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectMethod('ai')}
                        className="w-full p-4 rounded-2xl border-2 border-[var(--color-mist)] hover:border-sage/60 hover:bg-sage/5 transition-smooth text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sage/15 group-hover:bg-sage/25 rounded-xl flex items-center justify-center transition-smooth">
                            <Sparkles size={20} className="text-sage" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[var(--color-charcoal)]">AI Generated</p>
                            <p className="text-xs text-[var(--color-smoke)] mt-0.5">Auto-generate 3–5 smart subtasks</p>
                          </div>
                        </div>
                      </motion.button>

                      <button
                        id="skip-subtasks-btn"
                        onClick={handleCreate}
                        className="w-full py-2.5 text-sm text-[var(--color-smoke)] hover:text-[var(--color-charcoal)] transition-smooth"
                      >
                        Skip — create without subtasks
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* AI Loading state */}
                      {subtaskMethod === 'ai' && aiLoading && (
                        <div className="space-y-2.5 mb-5">
                          <p className="text-xs text-[var(--color-smoke)] mb-3 flex items-center gap-2">
                            <Sparkles size={13} className="text-sage animate-pulse" /> Generating subtasks…
                          </p>
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-md shimmer-bg flex-shrink-0" />
                              <div
                                className="h-4 rounded-lg shimmer-bg flex-1"
                                style={{ width: `${65 + i * 7}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Subtask list */}
                      {(!aiLoading || subtaskMethod === 'manual') && (
                        <div className="space-y-1.5 mb-4 max-h-48 overflow-y-auto">
                          <AnimatePresence>
                            {subtasks.map((s, i) => (
                              <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ delay: subtaskMethod === 'ai' ? i * 0.08 : 0 }}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--color-bg)] group"
                              >
                                <div className="w-5 h-5 rounded-md bg-[var(--color-mist)] flex-shrink-0 flex items-center justify-center">
                                  <Check size={11} className="text-[var(--color-smoke)]" />
                                </div>
                                <span className="flex-1 text-sm text-[var(--color-charcoal)]">{s.title}</span>
                                <button
                                  onClick={() => removeSubtask(s.id)}
                                  className="opacity-0 group-hover:opacity-100 text-[var(--color-smoke)] hover:text-terracotta transition-smooth"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Manual input */}
                      {subtaskMethod === 'manual' && (
                        <div className="flex gap-2 mb-4">
                          <input
                            id="manual-subtask-input"
                            type="text"
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addManualSubtask()}
                            placeholder="Add a subtask…"
                            autoFocus
                            className="flex-1 px-3 py-2.5 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-smoke)]/60 focus:outline-none focus:border-forest/50 transition-smooth"
                          />
                          <button
                            onClick={addManualSubtask}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-smooth hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSubtaskMethod(null); setSubtasks([]); setAiDone(false); }}
                          className="flex-1 py-2.5 rounded-xl border border-[var(--color-mist)] text-sm text-[var(--color-smoke)] hover:border-[var(--color-smoke)]/40 transition-smooth"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          id="create-task-btn"
                          onClick={handleCreate}
                          disabled={!title.trim() || (!dueDate && !(['daily', 'workout', 'groceries'].includes(category) && repeatDays.length > 0)) || aiLoading}
                          className="flex-1 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-smooth disabled:opacity-50"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          Create Task
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
