import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Trash2, Sparkles, User, Users } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GROQ_URL, isDev, DEFAULT_AI_MODEL, parseAIJsonResponse } from '../../config/ai';

const priorityOptions = [
  { value: 'high', label: 'High', color: 'bg-[var(--color-high-bg)] text-[var(--color-high-dot)] border-[var(--color-high-bg)]', dot: 'bg-[var(--color-high-dot)]' },
  { value: 'medium', label: 'Medium', color: 'bg-[var(--color-medium-bg)] text-[var(--color-medium-dot)] border-[var(--color-medium-bg)]', dot: 'bg-[var(--color-medium-dot)]' },
  { value: 'low', label: 'Low', color: 'bg-[var(--color-low-bg)] text-[var(--color-low-dot)] border-[var(--color-low-bg)]', dot: 'bg-[var(--color-low-dot)]' },
];

const categoryOptions = [
  { value: 'work', label: 'Work' },
  { value: 'study', label: 'Study' },
  { value: 'daily', label: 'Daily' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'travel', label: 'Travel' },
  { value: 'workout', label: 'Workout' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EditTaskModal({ task, onClose }) {
  const { updateTask } = useTasks();

  const [title, setTitle] = useState(task.title || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [dueTime, setDueTime] = useState(task.dueTime || '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [taskType, setTaskType] = useState(task.type || 'individual');
  const [category, setCategory] = useState(task.category || 'work');
  const [repeatDays, setRepeatDays] = useState(task.repeatDays || []);
  
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  
  const [aiLoading, setAiLoading] = useState(false);

  const toggleRepeatDay = (idx) => {
    setRepeatDays(prev => 
      prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx].sort()
    );
  };

  const handleSelectMethod = async () => {
    if (!title.trim()) return;
    setAiLoading(true);
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
        const generated = parsed.subtasks.map((t, i) => ({ id: `gen-${Date.now()}-${i}`, title: t, done: false }));
        setSubtasks(prev => [...prev, ...generated]);
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      console.error("Failed to generate subtasks", err);
    }
    setAiLoading(false);
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: `m-${Date.now()}`, title: newSubtask.trim(), done: false }]);
    setNewSubtask('');
  };

  const removeSubtask = (id) => setSubtasks((prev) => prev.filter((s) => s.id !== id));

  const handleSave = () => {
    if (!title.trim()) return;
    
    const isRepeatable = ['daily', 'workout', 'groceries'].includes(category) && repeatDays.length > 0;
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
    
    updateTask(task.id, {
      title: title.trim(),
      dueDate: finalDueDate,
      dueTime,
      priority,
      category,
      type: taskType,
      repeatDays: isRepeatable ? repeatDays : [],
      ...(category !== 'study' ? { subtasks } : {}),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="relative surface p-6 rounded-2xl shadow-2xl max-w-md w-full border border-[var(--color-mist)] max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[var(--color-smoke)] hover:bg-[var(--color-mist)] hover:text-[var(--color-charcoal)] transition-smooth"
          >
            <X size={18} />
          </button>

          <h2 className="text-xl font-bold text-[var(--color-charcoal)] mb-6">Edit Task</h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                Task Title
              </label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-smooth"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                Category
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

            {/* Repeat Days */}
            {['daily', 'workout', 'groceries'].includes(category) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                  Repeat On
                </label>
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

            {/* Task Type */}
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

            {/* Due Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <DatePicker
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
                  Time
                </label>
                <DatePicker
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
                    onClick={() => setPriority(value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-smooth ${
                      priority === value ? color + ' shadow-sm' : 'border-[var(--color-mist)] text-[var(--color-smoke)] hover:border-[var(--color-smoke)]/40'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${dot}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks */}
            {category !== 'study' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[var(--color-smoke)] uppercase tracking-wider">
                    Subtasks
                  </label>
                  <button
                    onClick={handleSelectMethod}
                    disabled={aiLoading}
                    className="text-xs text-[var(--color-sage)] hover:text-[var(--color-sage)]/80 flex items-center gap-1 font-semibold disabled:opacity-50"
                  >
                    <Sparkles size={12} /> {aiLoading ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                
                <div className="space-y-2 mb-3">
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 bg-[var(--color-bg)] px-3 py-2 rounded-xl border border-[var(--color-mist)] group">
                      <div className="w-4 h-4 rounded-[4px] border border-[var(--color-mist)] flex items-center justify-center flex-shrink-0 bg-transparent">
                         {st.done && <Check size={10} className="text-[var(--color-primary)]" />}
                      </div>
                      <div className={`flex-1 text-sm text-[var(--color-charcoal)] ${st.done ? 'line-through opacity-50' : ''}`}>{st.title}</div>
                      <button onClick={() => removeSubtask(st.id)} className="p-1 text-[var(--color-smoke)] opacity-0 group-hover:opacity-100 hover:text-red-500 rounded-lg hover:bg-red-50 transition-smooth">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-smooth"
                  />
                  <button
                    onClick={addSubtask}
                    disabled={!newSubtask.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-text)] disabled:opacity-50 transition-smooth flex items-center justify-center hover:opacity-90"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="w-full mt-4 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
