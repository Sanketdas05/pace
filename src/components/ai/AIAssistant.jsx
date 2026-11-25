// src/components/ai/AIAssistant.jsx
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTasks } from '../../context/TaskContext';
import { useAI } from '../../context/AIContext';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { buildFullThemeVars } from '../../lib/themes';
import { GROQ_URL, isDev, DEFAULT_AI_MODEL, getAIHeaders } from '../../config/ai';

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
      description: "Create a new task in the user's task list. ALWAYS call this when the user wants to add, create, or make a new task — even from natural language.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "The title of the task" },
          priority: { type: "string", enum: ["high", "medium", "low"], description: "Task priority (high, medium, low). Default is medium." },
          category: { type: "string", enum: ["work", "study", "daily", "groceries", "travel", "workout", "habit"], description: "Category of the task (default is work). Use 'habit' for habits, 'daily' for daily routines." },
          repeatDays: { type: "string", description: "Stringified JSON array of day indices (0=Sun, 1=Mon, ..., 6=Sat) for repeating tasks, e.g. '[0,1,2,3,4,5,6]'. Use this for recurring/repeating tasks." },
          dueTime: { type: "string", description: "Due time in 24-hour HH:mm format, e.g. '10:00', '14:30'" },
          dueDate: { type: "string", description: "Due date in YYYY-MM-DD format. If user specifies 'today' or leaves date unspecified for a one-time task, use today's date." },
          subtasks: { type: "array", items: { type: "string" }, description: "List of subtask title strings" },
          note: { type: "string", description: "Optional note or description for the task" }
        },
        required: ["title"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_task",
      description: "Modify an existing task. Use this to update title, priority, due date/time, category, repeat schedule, mark as complete/incomplete, add notes, or add new subtasks. ALWAYS call this when the user wants to change, edit, modify, rename, reschedule, or mark a task.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "The exact ID or title of the task to update (from the active tasks list). Match by ID first, then by title." },
          title: { type: "string", description: "Updated task title" },
          priority: { type: "string", enum: ["high", "medium", "low"], description: "Updated priority" },
          category: { type: "string", enum: ["work", "study", "daily", "groceries", "travel", "workout", "habit"], description: "Updated category" },
          completed: { type: "boolean", description: "Set to true to mark the task as complete, false to mark as incomplete" },
          repeatDays: { type: "string", description: "Stringified JSON array of day numbers (0=Sun..6=Sat) for repeat schedule" },
          dueTime: { type: "string", description: "Updated due time in HH:mm" },
          dueDate: { type: "string", description: "Updated due date in YYYY-MM-DD" },
          note: { type: "string", description: "Updated note or description" },
          newSubtasks: { type: "array", items: { type: "string" }, description: "List of NEW subtask titles to add" },
          subtasks: { type: "array", items: { type: "string" }, description: "List of subtasks to append" }
        },
        required: ["id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "delete_task",
      description: "Delete or remove a task from the user's task list. ALWAYS call this when the user asks to delete, remove, cancel, or get rid of a task.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "The exact ID or title of the task to delete (from the active tasks list). Match by ID first, then by title." }
        },
        required: ["id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "set_theme",
      description: "Change the app theme preset or generate a custom theme from user's human description. ALWAYS call this when the user mentions changing, switching, setting, or creating a theme or visual aesthetic (e.g. 'make it cyberpunk', 'switch to pookie theme', 'dark mode with neon cyan', 'matcha green aesthetic', 'cozy autumn coffee theme').",
      parameters: {
        type: "object",
        properties: {
          themeId: { 
            type: "string", 
            enum: ["default", "genz", "snowwy", "pookie", "modern", "custom"], 
            description: "Use 'default', 'genz', 'snowwy', 'pookie', or 'modern' if matching a known preset, or 'custom' if generating a new color scheme from the user's description." 
          },
          themeName: { 
            type: "string", 
            description: "A creative display name for the theme (e.g. 'Cyberpunk 2077', 'Matcha Latte', 'Sunset Glow', 'Nordic Slate')" 
          },
          isDark: {
            type: "boolean",
            description: "Whether the custom theme should be in dark mode (true) or light mode (false)"
          },
          colors: {
            type: "object",
            description: "Required when themeId is 'custom'. Provide 9 hex colors that match the user's human description with strong readable contrast.",
            properties: {
              bg: { type: "string", description: "Main app background hex code" },
              surface: { type: "string", description: "Card & surface background hex code" },
              primary: { type: "string", description: "Main vibrant accent color for buttons & active states" },
              charcoal: { type: "string", description: "Primary text color (must strongly contrast with bg)" },
              smoke: { type: "string", description: "Muted/secondary text color" },
              mist: { type: "string", description: "Border and divider color" },
              highDot: { type: "string", description: "High priority accent color hex" },
              mediumDot: { type: "string", description: "Medium priority accent color hex" },
              lowDot: { type: "string", description: "Low priority accent color hex" }
            },
            required: ["bg", "surface", "primary", "charcoal", "smoke", "mist", "highDot", "mediumDot", "lowDot"]
          }
        },
        required: ["themeId"]
      }
    }
  }
];

function buildSystemPrompt(tasks) {
  const activeTasks = (tasks || []).filter(t => !t.completed && !t.deleted);
  const completedTasks = (tasks || []).filter(t => t.completed && !t.deleted);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const taskSummary = activeTasks
    .slice(0, 30)
    .map((t, idx) => {
      let str = `${idx + 1}. [ID: ${t.id}] "${t.title}" (Priority: ${t.priority || 'medium'}`;
      if (t.category) str += `, Category: ${t.category}`;
      if (t.dueDate) str += `, Due: ${t.dueDate}`;
      if (t.dueTime) str += ` at ${t.dueTime}`;
      if (t.repeatDays && t.repeatDays.length > 0) {
        const repeatNames = t.repeatDays.map(d => daysOfWeek[d] || d).join(',');
        str += `, Repeats: [${repeatNames}]`;
      }
      if (t.subtasks && t.subtasks.length > 0) {
        const subNames = t.subtasks.map(s => `${s.done ? '[Done]' : '[Pending]'} ${s.title}`).join(' | ');
        str += `, Subtasks: ${subNames}`;
      }
      if (t.note) {
        str += `, Note: "${t.note}"`;
      }
      str += `)`;
      return str;
    })
    .join('\n');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const todayYMD = now.toLocaleDateString('en-CA');

  const upcomingCalendar = [];
  for (let i = 0; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const ymd = d.toLocaleDateString('en-CA');
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayName;
    upcomingCalendar.push(`- ${label} (${dayName}): ${ymd}`);
  }

  return `You are Pace AI, an intelligent, encouraging, and structured productivity assistant built into the Pace task manager app.

Current Date & Time: ${dateStr} at ${timeStr} (Today in YYYY-MM-DD is ${todayYMD})

==================================================
CALENDAR REFERENCE (Use these EXACT YYYY-MM-DD dates):
==================================================
${upcomingCalendar.join('\n')}

==================================================
USER'S ACTIVE TASKS (${activeTasks.length} total):
==================================================
${taskSummary || 'No active tasks found.'}

${completedTasks.length > 0 ? `Recently Completed: ${completedTasks.slice(0, 5).map(t => `"${t.title}"`).join(', ')}` : ''}

==================================================
BEHAVIOR & INSTRUCTIONS:
==================================================
1. WORKFLOW & DAY PLANNING:
   - When the user asks to "Plan my day", "What should I prioritize?", or organize their workflow:
     - You MUST use and name their ACTUAL tasks from the list above.
     - Format the plan with bold section headers like **🌅 Morning**, **☀️ Afternoon**, **🌇 Evening** and bullet points under each.
     - NEVER use markdown tables. Use bullet points only.
     - Put High priority tasks first. Mention specific pending subtasks.

2. TASK CREATION FROM HUMAN LANGUAGE (ALWAYS call create_task):
   - When the user expresses an intent to add, create, plan, or be reminded of a task, ALWAYS invoke the "create_task" tool.
   - Parse natural human language deeply:
     * DATES: Resolve phrases like "tomorrow", "this Friday", "next Tuesday", "in 2 days" using the Calendar Reference table above into YYYY-MM-DD. If no date is mentioned for a new task, default to "${todayYMD}".
     * TIMES: Convert "at 4pm", "16:00", "in the morning at 9", "noon" into 24-hr HH:mm format.
     * PRIORITY: Look for urgency ("urgent", "asap", "critical", "important" -> "high"; "low priority", "trivial", "someday" -> "low"; default "medium").
     * CATEGORY: Map automatically: gym/workout/running -> "workout", study/reading/exam -> "study", groceries/shopping -> "groceries", flight/trip -> "travel", habits/routine -> "habit" or "daily", work/meeting/coding -> "work".
     * RECURRING: "every day" -> repeatDays: "[0,1,2,3,4,5,6]", "weekdays" -> repeatDays: "[1,2,3,4,5]", "weekends" -> repeatDays: "[0,6]".
     * SUBTASKS: If the user provides steps or asks you to break it down, populate the subtasks array.
     * NOTE: Capture any extra context or details into the note field.

3. TASK UPDATES FROM HUMAN LANGUAGE (ALWAYS call update_task):
   - When the user asks to modify, reschedule, reprioritize, rename, complete, or add notes/subtasks to an existing task in natural human language, ALWAYS invoke "update_task".
   - Match the target task by its ID or title keywords (e.g. "landing page", "workout", "campaign").
   - To mark as completed/done: set completed: true. To mark incomplete: set completed: false.
   - To reschedule: map human date expressions to YYYY-MM-DD from the Calendar Reference table.
   - To add subtasks: pass newSubtasks array.
   - To change priority or note: pass priority or note.

4. THEME GENERATION & SWITCHING FROM HUMAN LANGUAGE (ALWAYS call set_theme):
   - When the user asks to change, switch, customize, or generate a theme (e.g. "switch to pookie theme", "make a cyberpunk theme with neon green", "dark mode with lavender accents", "cozy coffee shop palette", "matcha aesthetic"):
   - ALWAYS call the "set_theme" tool!
   - If they name a known preset (default, genz, snowwy, pookie, modern), pass themeId.
   - If they describe a custom theme or visual vibe, set themeId: "custom", invent a creative themeName, and provide 9 rich hex colors in the colors object with strong readable contrast.

5. TASK DELETION (ALWAYS call delete_task):
   - When the user asks to delete, remove, cancel, or get rid of a task, call the "delete_task" tool with the task ID or title.

6. FORMATTING RULES (CRITICAL):
   - NEVER use markdown tables (no pipes | or dashes ---).
   - Use **bold** for task names and headers.
   - Use emoji for section headers and status (✅ 🔴 📅 🎨 🌅 ☀️ 🌇).
   - Use bullet points (- ) for lists.
   - Keep responses concise.
   - End every response with exactly 2-3 follow-up suggestions in this format:
[SUGGESTIONS]
- Suggestion 1
- Suggestion 2`;
}

export default function AIAssistant() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { setTheme, saveAndApplyCustom } = useTheme();
  const { open, setOpen } = useAI();
  const { profile } = useGamification();

  // Daily quota: 25 base prompts + 10 bonus for maintaining 3+ day streak
  const maxDailyPrompts = (profile?.streak >= 3) ? 35 : 25;
  const getTodayStr = () => new Date().toLocaleDateString('en-CA');

  const [aiUsage, setAiUsage] = useState(() => {
    try {
      const saved = localStorage.getItem('pace_ai_daily_usage');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === getTodayStr()) {
          return parsed.count || 0;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const remainingPrompts = Math.max(0, maxDailyPrompts - aiUsage);
  const isQuotaExceeded = remainingPrompts <= 0;

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

    if (isQuotaExceeded) {
      setMessages(prev => [
        ...prev,
        { role: 'user', text: rawText },
        {
          role: 'assistant',
          text: `⏳ **Daily Pace AI Limit Reached**\n\nYou've used your **${maxDailyPrompts}** free prompts for today. Your quota resets automatically at midnight!\n\n${profile?.streak < 3 ? '🔥 *Tip: Build a 3-day streak to unlock 10 bonus prompts every day!*' : '✨ *Streak bonus active: +10 daily prompts included.*'}`,
        }
      ]);
      setInput('');
      return;
    }

    let isCreateCommand = false;
    let isUpdateCommand = false;
    let isDeleteCommand = false;
    let finalUserText = rawText;

    if (rawText.toLowerCase().startsWith('/task')) {
      isCreateCommand = true;
      const userDescription = rawText.substring(5).trim();
      finalUserText = `[COMMAND: CREATE TASK] You MUST call the create_task tool now. Create a new task with these details: ${userDescription || 'ask me for details'}`;
    } else if (rawText.toLowerCase().startsWith('/update')) {
      isUpdateCommand = true;
      const userDescription = rawText.substring(7).trim();
      finalUserText = `[COMMAND: UPDATE TASK] You MUST call the update_task tool now. Find the matching task from the active list and update it. Details: ${userDescription || 'ask me which task to update'}`;
    } else if (rawText.toLowerCase().startsWith('/delete')) {
      isDeleteCommand = true;
      const userDescription = rawText.substring(7).trim();
      finalUserText = `[COMMAND: DELETE TASK] You MUST call the delete_task tool now. Find the matching task from the active list and delete it. Task to delete: ${userDescription || 'ask me which task to delete'}`;
    }

    setInput('');
    setShowCommandMenu(false);
    setMessages(prev => [...prev, { role: 'user', text: rawText }]);
    setLoading(true);

    const nextCount = aiUsage + 1;
    setAiUsage(nextCount);
    try {
      localStorage.setItem('pace_ai_daily_usage', JSON.stringify({
        date: getTodayStr(),
        count: nextCount,
      }));
    } catch (e) {
      console.error(e);
    }

    const findBestMatchingTask = (query) => {
      if (!query) return null;
      const q = query.toLowerCase().trim();
      // 1. Direct ID match
      let match = tasks.find(t => t.id === q);
      if (match) return match;
      // 2. Exact Title match
      match = tasks.find(t => t.title.toLowerCase() === q);
      if (match) return match;
      // 3. Substring match
      match = tasks.find(t => t.title.toLowerCase().includes(q) || q.includes(t.title.toLowerCase()));
      if (match) return match;
      // 4. Token overlap scoring
      const qWords = q.split(/\s+/).filter(w => w.length > 2);
      let bestScore = 0;
      let bestTask = null;
      for (const t of tasks) {
        const tWords = t.title.toLowerCase().split(/\s+/);
        const score = qWords.filter(w => tWords.some(tw => tw.includes(w) || w.includes(tw))).length;
        if (score > bestScore) {
          bestScore = score;
          bestTask = t;
        }
      }
      return bestScore > 0 ? bestTask : null;
    };

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
        model: DEFAULT_AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: finalUserText }
        ],
        max_tokens: 2048,
        temperature: 0.3,
        tools: TASK_TOOLS,
        tool_choice: "auto",
      };

      const headers = getAIHeaders();

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
        reply = reply.replace(match[0], "");
      }

      if (toolCalls && toolCalls.length > 0) {
        for (const tool of toolCalls) {
          if (tool.function.name === 'create_task') {
            const args = typeof tool.function.arguments === 'string'
              ? JSON.parse(tool.function.arguments)
              : tool.function.arguments;
            
            let cleanRepeatDays = args.repeatDays;
            if (typeof cleanRepeatDays === 'string') {
              try { cleanRepeatDays = JSON.parse(cleanRepeatDays); } catch (e) { cleanRepeatDays = []; }
            }
            const subtaskArray = (args.subtasks || []).map((st, i) => ({
              id: `gen-${Date.now()}-${i}`,
              title: typeof st === 'string' ? st : (st.title || 'Subtask'),
              done: false
            }));

            const todayYMD = new Date().toLocaleDateString('en-CA');
            let resolvedDueDate = args.dueDate;
            if (!resolvedDueDate || resolvedDueDate.toLowerCase() === 'today') {
              resolvedDueDate = todayYMD;
            } else if (resolvedDueDate.toLowerCase() === 'tomorrow') {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              resolvedDueDate = tomorrow.toLocaleDateString('en-CA');
            }

            await addTask({
              title: args.title,
              priority: args.priority || 'medium',
              subtasks: subtaskArray,
              category: args.category || ((cleanRepeatDays && cleanRepeatDays.length > 0) ? 'daily' : 'work'),
              repeatDays: cleanRepeatDays || [],
              dueTime: args.dueTime || null,
              dueDate: resolvedDueDate,
              ...(args.note ? { note: args.note } : {})
            });
            createdTaskMessage += `✅ Created task: "${args.title}"\n`;
          } else if (tool.function.name === 'update_task') {
            const args = typeof tool.function.arguments === 'string'
              ? JSON.parse(tool.function.arguments)
              : tool.function.arguments;
            
            let cleanId = (args.id || '').toString().trim();
            if (cleanId.startsWith('[') && cleanId.endsWith(']')) {
              cleanId = cleanId.slice(1, -1).trim();
            }
            
            let cleanRepeatDays = args.repeatDays;
            if (typeof cleanRepeatDays === 'string') {
              try { cleanRepeatDays = JSON.parse(cleanRepeatDays); } catch (e) { cleanRepeatDays = []; }
            }

            const target = findBestMatchingTask(cleanId);

            if (target) {
              const updates = {};
              if (args.title) updates.title = args.title;
              if (args.priority) updates.priority = args.priority;
              if (args.category) updates.category = args.category;
              if (typeof args.completed === 'boolean') updates.completed = args.completed;
              if (cleanRepeatDays !== undefined) {
                updates.repeatDays = cleanRepeatDays;
                if (!target.category || target.category === 'work') updates.category = 'daily';
              }
              if (args.dueTime) updates.dueTime = args.dueTime;
              if (args.dueDate) {
                const todayYMD = new Date().toLocaleDateString('en-CA');
                if (args.dueDate.toLowerCase() === 'today') {
                  updates.dueDate = todayYMD;
                } else if (args.dueDate.toLowerCase() === 'tomorrow') {
                  const tm = new Date();
                  tm.setDate(tm.getDate() + 1);
                  updates.dueDate = tm.toLocaleDateString('en-CA');
                } else {
                  updates.dueDate = args.dueDate;
                }
              }
              if (args.note !== undefined) updates.note = args.note;

              const newSubs = args.newSubtasks || args.subtasks;
              if (newSubs && Array.isArray(newSubs) && newSubs.length > 0) {
                const currentSubtasks = target.subtasks || [];
                const appended = newSubs.map((st, i) => ({
                  id: `m-${Date.now()}-${i}`,
                  title: typeof st === 'string' ? st : (st.title || 'Subtask'),
                  done: false
                }));
                updates.subtasks = [...currentSubtasks, ...appended];
              }
              
              await updateTask(target.id, updates);
              createdTaskMessage += `🔄 Updated task: "${target.title}"\n`;
            } else {
              createdTaskMessage += `❌ Could not find task to update. (Tried: ${cleanId})\n`;
            }
          } else if (tool.function.name === 'delete_task') {
            const args = typeof tool.function.arguments === 'string'
              ? JSON.parse(tool.function.arguments)
              : tool.function.arguments;

            let cleanId = (args.id || '').toString().trim();
            if (cleanId.startsWith('[') && cleanId.endsWith(']')) {
              cleanId = cleanId.slice(1, -1).trim();
            }

            const target = findBestMatchingTask(cleanId);

            if (target) {
              await deleteTask(target.id);
              createdTaskMessage += `🗑️ Deleted task: "${target.title}"\n`;
            } else {
              createdTaskMessage += `❌ Could not find task to delete. (Tried: ${cleanId})\n`;
            }
          } else if (tool.function.name === 'set_theme') {
            const args = typeof tool.function.arguments === 'string'
              ? JSON.parse(tool.function.arguments)
              : tool.function.arguments;

            if (args.themeId && args.themeId !== 'custom') {
              setTheme(args.themeId);
              const displayName = args.themeId.charAt(0).toUpperCase() + args.themeId.slice(1);
              createdTaskMessage += `🎨 Applied "${displayName}" theme preset!\n`;
            } else if (args.colors) {
              const fullTheme = buildFullThemeVars(args.colors, args.isDark);
              fullTheme.name = args.themeName || 'Custom AI Theme';
              saveAndApplyCustom(fullTheme);
              createdTaskMessage += `🎨 Created & applied custom theme: "${fullTheme.name}"!\n`;
            } else {
              createdTaskMessage += `❌ Could not apply theme. Please specify colors or preset.\n`;
            }
          }
        }
      }
      
      if ((isCreateCommand || isUpdateCommand || isDeleteCommand) && toolCalls.length === 0) {
        createdTaskMessage += `⚠️ I noticed you used a command, but I didn't catch enough details. Please be more specific!\n`;
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
              data-lenis-prevent
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm surface shadow-2xl border-l border-[var(--color-mist)] flex flex-col"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-mist)] flex-shrink-0 bg-[var(--color-surface)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-primary-text, #ffffff)'
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[var(--color-charcoal)] leading-none">Pace AI</p>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isQuotaExceeded
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                            : remainingPrompts <= 5
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-[var(--color-mist)] text-[var(--color-smoke)]'
                        }`}
                        title={`Daily quota: ${remainingPrompts} of ${maxDailyPrompts} prompts remaining today. Resets at midnight.`}
                      >
                        {remainingPrompts}/{maxDailyPrompts} left
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-smoke)] mt-0.5">
                      {tasks.filter(t => !t.completed && !t.deleted).length} active tasks in context
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
              <div data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 overscroll-contain">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'rounded-tr-sm whitespace-pre-wrap'
                          : 'text-[var(--color-charcoal)] bg-[var(--color-surface)] border border-[var(--color-mist)] rounded-tl-sm'
                      }`}
                      style={msg.role === 'user' ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' } : {}}
                    >
                      {msg.role === 'user' ? (
                        msg.text.toLowerCase().startsWith('/task') || msg.text.toLowerCase().startsWith('/update') || msg.text.toLowerCase().startsWith('/delete') ? (
                          <>
                            <span className={`opacity-90 px-1.5 py-0.5 rounded font-mono font-bold mr-1 ${msg.text.toLowerCase().startsWith('/delete') ? 'text-red-300' : ''}`}>
                              {msg.text.toLowerCase().startsWith('/task') ? msg.text.substring(0, 5) : msg.text.substring(0, 7)}
                            </span>
                            <span>{msg.text.toLowerCase().startsWith('/task') ? msg.text.substring(5) : msg.text.substring(7)}</span>
                          </>
                        ) : (
                          msg.text
                        )
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-[var(--color-charcoal)]">{children}</strong>,
                            ul: ({ children }) => <ul className="list-none space-y-1 my-1.5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1.5">{children}</ol>,
                            li: ({ children }) => <li className="flex gap-1.5 items-start"><span className="mt-0.5 text-[var(--color-primary)]">•</span><span>{children}</span></li>,
                            h1: ({ children }) => <h1 className="font-bold text-base mb-2 text-[var(--color-charcoal)]">{children}</h1>,
                            h2: ({ children }) => <h2 className="font-bold text-sm mb-1.5 mt-2 text-[var(--color-charcoal)]">{children}</h2>,
                            h3: ({ children }) => <h3 className="font-semibold text-sm mb-1 mt-1.5">{children}</h3>,
                            code: ({ children }) => <code className="bg-[var(--color-mist)] px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            hr: () => <hr className="my-2 border-[var(--color-mist)]" />,
                            table: () => null,
                            thead: () => null,
                            tbody: () => null,
                            tr: () => null,
                            td: () => null,
                            th: () => null,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
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
                      <button 
                        onClick={() => { setInput('/delete '); setShowCommandMenu(false); inputRef.current?.focus(); }}
                        className="text-left px-4 py-3 hover:bg-[var(--color-mist)] transition-smooth flex flex-col border-t border-[var(--color-mist)]"
                      >
                        <span className="font-bold text-sm text-red-500">/delete</span>
                        <span className="text-xs text-[var(--color-smoke)]">Delete a task</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-[var(--color-mist)] flex-shrink-0">
                {isQuotaExceeded && (
                  <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
                    <span>Daily limit reached ({maxDailyPrompts}/{maxDailyPrompts}). Resets at midnight.</span>
                  </div>
                )}
                <div className="flex gap-2 items-end bg-[var(--color-bg)] border border-[var(--color-mist)] rounded-2xl px-4 py-2.5 focus-within:border-[var(--color-primary)] transition-smooth">
                  <textarea
                    ref={inputRef}
                    value={input}
                    disabled={isQuotaExceeded}
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
                    placeholder={isQuotaExceeded ? "Daily limit reached — resets at midnight" : "Ask me anything, or use /task..."}
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-smoke)]/60 resize-none focus:outline-none max-h-28 disabled:cursor-not-allowed"
                    style={{ fieldSizing: 'content' }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading || isQuotaExceeded}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-smooth disabled:opacity-40 flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Send size={14} className="text-white" />
                  </button>
                </div>
                <p className="text-[10px] text-[var(--color-smoke)]/60 text-center mt-2">
                  Powered by Groq · {maxDailyPrompts} daily prompts {profile?.streak >= 3 ? '(+10 streak bonus applied)' : ''}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
