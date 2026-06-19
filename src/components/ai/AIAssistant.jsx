// src/components/ai/AIAssistant.jsx
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ChevronDown } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAI } from '../../context/AIContext';
import { useState } from 'react';

const isDev = import.meta.env.DEV;
const GROQ_URL = isDev
  ? '/api/groq/openai/v1/chat/completions'
  : 'https://api.groq.com/openai/v1/chat/completions';

const QUICK_PROMPTS = [
  'Plan my day',
  'What should I prioritize?',
  'Estimate time for my tasks',
  'Break down my most complex task',
];

const TASK_TOOLS = [
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Create a new task for the user. Call this when the user asks to add or create a task.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "The task title" },
          priority: { type: "string", enum: ["high", "medium", "low"], description: "The task priority (default is medium)" },
          repeatDays: { type: "string", description: "A stringified array of day numbers (0=Sun, 1=Mon, ..., 6=Sat) for repeating tasks, e.g. '[0,1,2,3,4,5,6]'" },
          dueTime: { type: "string", description: "The time the task is due, formatted as HH:mm (24-hour), e.g. '10:00', '14:30'" },
          dueDate: { type: "string", description: "The date the task is due, formatted as YYYY-MM-DD" },
          subtasks: { type: "array", "items": { type: "string" }, description: "List of subtasks to include in this new task" }
        },
        required: ["title"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_task",
      description: "Modify an existing task. Use this to make a task repeatable, add subtasks, or change priority.",
      parameters: {
        type: "object",
        properties: {
          id: { "type": "string", "description": "The exact ID of the task to update (from the active tasks list)" },
          title: { "type": "string" },
          priority: { "type": "string", enum: ["high", "medium", "low"] },
          repeatDays: { type: "string", description: "A stringified array of day numbers (0=Sun, 1=Mon, ..., 6=Sat) for repeating tasks, e.g. '[0,1]'" },
          dueTime: { type: "string", description: "The time the task is due, formatted as HH:mm (24-hour), e.g. '10:00', '14:30'" },
          dueDate: { type: "string", description: "The date the task is due, formatted as YYYY-MM-DD" },
          newSubtasks: { "type": "array", "items": { "type": "string" }, description: "List of NEW subtasks to add to this task" }
        },
        required: ["id"]
      }
    }
  }
];

function buildSystemPrompt(tasks) {
  const taskSummary = tasks
    .filter(t => !t.completed)
    .slice(0, 20)
    .map(t => {
      let str = `- ID: ${t.id} "${t.title}" (priority: ${t.priority || 'medium'}${t.dueDate ? `, due: ${t.dueDate}` : ''}`;
      if (t.repeatDays?.length > 0) {
        str += `, repeating on days: [${t.repeatDays.join(',')}]`;
      }
      if (t.subtasks?.length > 0) {
        const subNames = t.subtasks.map(s => `${s.done ? '[x]' : '[ ]'} ${s.title}`).join(', ');
        str += `, subtasks: ${subNames}`;
      }
      str += `)`;
      return str;
    })
    .join('\n');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US');

  return `You are Pace AI, a smart productivity assistant built into the Pace task manager app. You are helpful, encouraging, and concise.

Current Date & Time: ${dateStr} ${timeStr}

The user's current active tasks are:
${taskSummary || 'No active tasks yet.'}

CRITICAL: ONLY invoke tools (like create_task or update_task) if the user's LATEST message explicitly requests an action. DO NOT repeat tool calls for requests that were already handled in the conversation history!

Keep responses short, practical, and structured. Use bullet points or numbered lists when helpful. Focus on actionable advice.
At the very end of your response, you MUST provide 2 to 3 follow-up prompt suggestions that the user might want to ask next. Format them exactly like this at the very end of your message:
[SUGGESTIONS]
- Suggestion 1
- Suggestion 2`;
}

export default function AIAssistant() {
  const { tasks, addTask, updateTask } = useTasks();
  const { open, setOpen } = useAI();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hey! I'm Pace AI 👋 I can see your task list. Ask me anything — from planning your day to breaking down a tricky task.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    let rawText = (text || input).trim();
    if (!rawText || loading) return;

    let isCreateCommand = false;
    let isUpdateCommand = false;
    let finalUserText = rawText;

    if (rawText.toLowerCase().startsWith('/task')) {
      isCreateCommand = true;
      finalUserText = rawText.substring(5).trim();
      if (!finalUserText) finalUserText = "Create a task based on our discussion.";
    } else if (rawText.toLowerCase().startsWith('/update')) {
      isUpdateCommand = true;
      finalUserText = rawText.substring(7).trim();
      if (!finalUserText) finalUserText = "Update a task based on our discussion.";
    }

    setInput('');
    setShowCommandMenu(false);
    setMessages(prev => [...prev, { role: 'user', text: rawText }]);
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(tasks);
      
      const history = messages
        .slice(1)
        .filter(m => !m.isError) 
        .map(m => ({
          role: m.role,
          content: m.text,
        }));

      const body = {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: finalUserText }
        ],
        max_tokens: 600,
        temperature: 0.7,
      };

      if (isCreateCommand) {
        body.tools = [TASK_TOOLS[0]];
        body.tool_choice = "auto";
      } else if (isUpdateCommand) {
        body.tools = [TASK_TOOLS[1]];
        body.tool_choice = "auto";
      }

      const headers = { 'Content-Type': 'application/json' };
      if (!isDev) {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`;
      }

      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // Catch the exact error Groq sends back
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please wait 60 seconds and try again.");
        }
        throw new Error(data.error?.message || "Failed to connect to AI.");
      }

      let reply = data.choices?.[0]?.message?.content || "";
      let toolCalls = data.choices?.[0]?.message?.tool_calls || [];
      
      let createdTaskMessage = "";

      // Manually parse Groq's leaking function tags if any
      const functionRegex = /<function\$([^>]+)>([\s\S]*?)<\/function>/g;
      let match;
      while ((match = functionRegex.exec(reply)) !== null) {
        const funcName = match[1];
        const funcArgs = match[2];
        toolCalls.push({
          function: { name: funcName, arguments: funcArgs }
        });
        // Remove the function block from reply
        reply = reply.replace(match[0], "");
      }

      if (toolCalls && toolCalls.length > 0) {
        for (const tool of toolCalls) {
          if (tool.function.name === 'create_task') {
            const args = JSON.parse(tool.function.arguments);
            
            let cleanRepeatDays = args.repeatDays;
            if (typeof cleanRepeatDays === 'string') {
              try { cleanRepeatDays = JSON.parse(cleanRepeatDays); } catch (e) { cleanRepeatDays = []; }
            }
            const subtaskArray = (args.subtasks || []).map((st, i) => ({ id: `gen-${Date.now()}-${i}`, title: st, done: false }));

            addTask({
              title: args.title,
              priority: args.priority || 'medium',
              subtasks: subtaskArray,
              category: (cleanRepeatDays && cleanRepeatDays.length > 0) ? 'daily' : 'work',
              repeatDays: cleanRepeatDays || [],
              dueTime: args.dueTime || null,
              dueDate: args.dueDate || null
            });
            createdTaskMessage += `✅ Created task: "${args.title}"\n`;
          } else if (tool.function.name === 'update_task') {
            const args = JSON.parse(tool.function.arguments);
            
            // Fix for bracketed IDs
            let cleanId = args.id;
            if (cleanId && cleanId.startsWith('[') && cleanId.endsWith(']')) {
              cleanId = cleanId.slice(1, -1);
            }
            
            // Fix for repeatDays string instead of array
            let cleanRepeatDays = args.repeatDays;
            if (typeof cleanRepeatDays === 'string') {
              try {
                cleanRepeatDays = JSON.parse(cleanRepeatDays);
              } catch (e) {
                cleanRepeatDays = [];
              }
            }

            const target = tasks.find(t => t.id === cleanId);
            if (target) {
              const updates = {};
              if (args.title) updates.title = args.title;
              if (args.priority) updates.priority = args.priority;
              if (cleanRepeatDays) {
                updates.repeatDays = cleanRepeatDays;
                if (!target.category || target.category === 'work') updates.category = 'daily'; // Needed for repeat logic to render
              }
              if (args.dueTime) updates.dueTime = args.dueTime;
              if (args.dueDate) updates.dueDate = args.dueDate;
              if (args.newSubtasks && args.newSubtasks.length > 0) {
                 const currentSubtasks = target.subtasks || [];
                 const appended = args.newSubtasks.map((st, i) => ({ id: `m-${Date.now()}-${i}`, title: st, done: false }));
                 updates.subtasks = [...currentSubtasks, ...appended];
              }
              
              updateTask(args.id, updates);
              createdTaskMessage += `🔄 Updated task: "${target.title}"\n`;
            } else {
              createdTaskMessage += `❌ Could not find task to update. (Tried ID: ${cleanId})\n`;
            }
          }
        }
      }
      
      if ((isCreateCommand || isUpdateCommand) && toolCalls.length === 0) {
        createdTaskMessage += `⚠️ I noticed you used a command, but I didn't catch enough details to create or update a task. Please try being more specific!\n`;
      }
      
      if (!reply && createdTaskMessage) {
         reply = createdTaskMessage;
      } else if (reply && createdTaskMessage) {
         reply = `${createdTaskMessage}\n\n${reply}`;
      }

      // Extract suggestions parsing `[SUGGESTIONS]` block from the end of the text
      let suggestions = [];
      const suggestIdx = reply.indexOf('[SUGGESTIONS]');
      if (suggestIdx !== -1) {
        const suggText = reply.slice(suggestIdx + '[SUGGESTIONS]'.length);
        reply = reply.slice(0, suggestIdx).trim();
        suggestions = suggText.split('\n')
           .map(s => s.replace(/^[-*•]\s*/, '').trim())
           .filter(s => s.length > 0 && s.length < 100)
           .slice(0, 3);
      }

      if (!reply) reply = "Done!";
      setMessages(prev => [...prev, { role: 'assistant', text: reply, suggestions }]);
      
    } catch (error) {
      // Push the actual error to the UI and flag it so it isn't sent in the next payload
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: `⚠️ ${error.message}`,
          isError: true 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — mobile only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm surface shadow-2xl border-l border-[var(--color-mist)] flex flex-col"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-mist)] flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-low-dot))' }}
                  >
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--color-charcoal)]">Pace AI</p>
                    <p className="text-xs text-[var(--color-smoke)]">
                      {tasks.filter(t => !t.completed).length} active tasks in context
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl text-[var(--color-smoke)] hover:bg-[var(--color-mist)] transition-smooth"
                  aria-label="Close AI panel"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                        msg.role === 'user'
                          ? 'rounded-tr-sm'
                          : 'text-[var(--color-charcoal)] bg-[var(--color-surface)] border border-[var(--color-mist)] rounded-tl-sm'
                      }`}
                      style={msg.role === 'user' ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' } : {}}
                    >
                      {msg.role === 'user' && (msg.text.toLowerCase().startsWith('/task') || msg.text.toLowerCase().startsWith('/update')) ? (
                        <>
                          <span className="opacity-70 mix-blend-overlay px-1.5 py-0.5 rounded font-mono font-bold mr-1">
                            {msg.text.toLowerCase().startsWith('/task') ? msg.text.substring(0, 5) : msg.text.substring(0, 7)}
                          </span>
                          <span>{msg.text.toLowerCase().startsWith('/task') ? msg.text.substring(5) : msg.text.substring(7)}</span>
                        </>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Render dynamic suggestions for the last message if it's from the assistant */}
                {messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].suggestions && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 justify-start mt-2 pb-2">
                    {messages[messages.length - 1].suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-[var(--color-mist)] text-[var(--color-charcoal)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-smooth bg-[var(--color-bg)] text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-[var(--color-mist)] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay }}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex-shrink-0">
                  <p className="text-[10px] font-semibold text-[var(--color-smoke)] uppercase tracking-wider mb-2">
                    Quick Prompts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-[var(--color-mist)] text-[var(--color-charcoal)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-smooth bg-[var(--color-bg)]"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Command Menu */}
              <AnimatePresence>
                {showCommandMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="px-4 pb-2"
                  >
                    <div className="bg-[var(--color-bg)] border border-[var(--color-mist)] rounded-xl shadow-lg overflow-hidden flex flex-col z-10">
                      <button 
                        onClick={() => { setInput('/task '); setShowCommandMenu(false); inputRef.current?.focus(); }}
                        className="text-left px-4 py-3 hover:bg-[var(--color-mist)] transition-smooth flex flex-col"
                      >
                        <span className="font-bold text-sm text-[var(--color-charcoal)]">/task</span>
                        <span className="text-xs text-[var(--color-smoke)]">Create a new task</span>
                      </button>
                      <button 
                        onClick={() => { setInput('/update '); setShowCommandMenu(false); inputRef.current?.focus(); }}
                        className="text-left px-4 py-3 hover:bg-[var(--color-mist)] transition-smooth flex flex-col border-t border-[var(--color-mist)]"
                      >
                        <span className="font-bold text-sm text-[var(--color-charcoal)]">/update</span>
                        <span className="text-xs text-[var(--color-smoke)]">Modify an existing task</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-[var(--color-mist)] flex-shrink-0">
                <div className="flex gap-2 items-end bg-[var(--color-bg)] border border-[var(--color-mist)] rounded-2xl px-4 py-2.5 focus-within:border-[var(--color-primary)] transition-smooth">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => {
                      const val = e.target.value;
                      setInput(val);
                      if (val === '/') {
                        setShowCommandMenu(true);
                      } else {
                        setShowCommandMenu(false);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything, or use /task..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-smoke)]/60 resize-none focus:outline-none max-h-28"
                    style={{ fieldSizing: 'content' }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-smooth disabled:opacity-40 flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Send size={14} className="text-white" />
                  </button>
                </div>
                <p className="text-[10px] text-[var(--color-smoke)]/60 text-center mt-2">Powered by Groq</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
