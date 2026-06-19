import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Zap, CheckSquare, Calendar, BarChart2, Users, Download, WifiOff, Play, ChevronDown, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: "Is Pace free to use?",
    answer: "Yes! Pace is completely free for individual use. You can track tasks, build habits, and earn points without paying a dime."
  },
  {
    question: "Can I use it offline?",
    answer: "Absolutely. Pace features robust offline support. Any tasks you create or complete while disconnected will automatically sync the moment you're back online."
  },
  {
    question: "Is there a desktop or mobile app?",
    answer: "Yes, Pace is a Progressive Web App (PWA). You can install it directly to your home screen or desktop from your browser for a native app-like experience without needing an app store."
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Yes! You can invite friends or team members to specific tasks or entire workspaces. Updates happen in real-time, and you can even chat directly within the task."
  },
  {
    question: "How does the gamification work?",
    answer: "Every task you complete earns you XP. Build daily streaks to multiply your earnings, and level up your profile as you become more productive. It makes getting things done actually fun!"
  },
  {
    question: "Can I try it without creating an account?",
    answer: "Yes! You can click 'Try Demo' to instantly jump into a fully-functional demo environment. If you like it, you can easily save your demo tasks to a real account later."
  }
];

export default function LandingPage() {
  const { currentUser, authLoading } = useAuth();
  const { activeThemeId, setTheme } = useTheme();
  const isDark = activeThemeId !== 'snowwy';
  const [openFaq, setOpenFaq] = useState(null);
  const [activeBar, setActiveBar] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const pwaMouseX = useMotionValue(0);
  const pwaMouseY = useMotionValue(0);
  
  const heroMouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const heroMouseY = useMotionValue(200);

  function handlePwaMouseMove(e) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    pwaMouseX.set(e.clientX - left);
    pwaMouseY.set(e.clientY - top);
  }

  function handleAnalyticsMouseMove(e) {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    let index = Math.floor((x / width) * 6);
    if (index < 0) index = 0;
    if (index > 5) index = 5;
    setActiveBar(index);
  }

  function handleHeroMouseMove(e) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    heroMouseX.set(e.clientX - left);
    heroMouseY.set(e.clientY - top);
  }

  const pwaBackgroundGradient = useMotionTemplate`
    radial-gradient(
      250px circle at ${pwaMouseX}px ${pwaMouseY}px,
      ${isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(14, 165, 233, 0.15)'},
      transparent 80%
    )
  `;

  const heroBackgroundGradient = useMotionTemplate`
    radial-gradient(
      800px circle at ${heroMouseX}px ${heroMouseY}px,
      ${isDark ? 'rgba(123, 92, 240, 0.3)' : 'rgba(69, 103, 183, 0.2)'} 0%,
      ${isDark ? 'rgba(34, 211, 238, 0.1)' : 'rgba(14, 165, 233, 0.1)'} 40%,
      ${isDark ? 'rgba(236, 72, 153, 0.05)' : 'rgba(255, 255, 255, 0)'} 60%,
      transparent 80%
    )
  `;

  if (authLoading) return null;
  if (currentUser) return <Navigate to="/tasks" replace />;

  return (
    <div 
      className="min-h-screen bg-[#F8FAFC] dark:bg-black text-[#0F172A] dark:text-white selection:bg-[#4567B7]/30 dark:selection:bg-[#7B5CF0]/30 overflow-x-hidden transition-colors duration-500"
      onMouseMove={handleHeroMouseMove}
    >
      <style>{`
        @keyframes wind {
          0% { transform: translateX(-50%) rotate(0deg) scale(1); }
          50% { transform: translateX(-48%) rotate(2deg) scale(1.05) translateY(-10px); }
          100% { transform: translateX(-50%) rotate(0deg) scale(1); }
        }
        .hero-container:hover .hero-bg { animation: wind 6s ease-in-out infinite alternate; }
      `}</style>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img src="/favicon.jpg" alt="Pace Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="font-bold text-xl tracking-tight ml-1 text-slate-900 dark:text-white transition-colors duration-500">Pace</span>
          </button>
          <div className="flex items-center gap-4">
            <button 
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? 'snowwy' : 'genz')}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white/70 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="bg-[#4567B7] hover:bg-[#6B8BD0] dark:bg-[#7B5CF0] dark:hover:bg-[#9B7FF7] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative z-10 hero-container">
        {/* Background Grid & Glow */}
        <div className="absolute inset-0 z-[-1] pointer-events-none flex justify-center items-start overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a1a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a1a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] transition-colors duration-500"></div>
          <motion.div 
            className="absolute inset-0 opacity-100"
            style={{ background: heroBackgroundGradient }}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              Defining the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4567B7] to-[#0EA5E9] dark:from-[#7B5CF0] dark:to-[#22D3EE]">speed of life.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-slate-600 dark:text-white/60 max-w-2xl mx-auto mb-10"
            >
              A beautifully gamified task manager that actually makes you want to get things done. Collaborate, track habits, and level up your productivity.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/login" className="w-full sm:w-auto bg-[#4567B7] hover:bg-[#6B8BD0] dark:bg-[#7B5CF0] dark:hover:bg-[#9B7FF7] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
                Start for free
              </Link>
              <Link to="/login" className="w-full sm:w-auto bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 px-8 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Play size={18} />
                Try Demo
              </Link>
            </motion.div>
          </div>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            
            {/* Smart Organization (col-span-2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group transition-colors duration-500 shadow-sm"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#4567B7]/10 dark:bg-[#7B5CF0]/20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500">
                  <CheckSquare className="text-[#4567B7] dark:text-[#7B5CF0] transition-colors duration-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-500">Smart Organization</h2>
                <p className="text-slate-600 dark:text-white/60 transition-colors duration-500">Organize your daily chores, workouts, and team projects seamlessly.</p>
              </div>
              <div className="mt-8 relative h-40 bg-slate-50 dark:bg-black/50 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-row-reverse items-center justify-center gap-8 transition-colors duration-500">
                {/* Pie Chart */}
                <div className="relative w-20 h-20 transition-transform duration-500 group-hover:scale-110">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="rotate-[-90deg]">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="16" />
                    
                    {/* Overdue (Pink) */}
                    <motion.circle 
                      cx="50" cy="50" r="40" fill="none" stroke="#EC4899" strokeWidth="16" strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }} whileInView={{ strokeDashoffset: 251.2 * 0.85 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    
                    {/* Completed (Purple) */}
                    <motion.circle 
                      cx="50" cy="50" r="40" fill="none" stroke="#7B5CF0" strokeWidth="16" strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }} whileInView={{ strokeDashoffset: 251.2 * 0.5 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      style={{ transformOrigin: "50px 50px", rotate: "54deg" }}
                    />
                    
                    {/* Active (Orange) */}
                    <motion.circle 
                      cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }} whileInView={{ strokeDashoffset: 251.2 * 0.7 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                      style={{ transformOrigin: "50px 50px", rotate: "234deg" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-slate-900 dark:text-white font-bold text-sm transition-colors duration-500">8</span>
                    <span className="text-[8px] text-slate-600 dark:text-white/60 -mt-1 transition-colors duration-500">Tasks</span>
                  </div>
                </div>

                {/* Subtasks */}
                <div className="flex flex-col gap-3" onMouseLeave={() => setActiveTask(null)}>
                  <motion.div 
                    onMouseEnter={() => setActiveTask(0)}
                    animate={{ x: activeTask === null ? 0 : (activeTask === 0 ? 24 : (activeTask === 1 ? 12 : 0)) }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-10 bg-white dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 w-40 flex items-center px-4 gap-3 cursor-default shadow-sm dark:shadow-none transition-colors duration-500"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#4567B7] dark:bg-[#7B5CF0] flex items-center justify-center transition-colors duration-500">
                      <CheckSquare size={10} className="text-white" />
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-white/20 rounded w-1/2 transition-colors duration-500" />
                  </motion.div>

                  <motion.div 
                    onMouseEnter={() => setActiveTask(1)}
                    animate={{ x: activeTask === null ? 0 : (activeTask === 1 ? 24 : 12) }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-10 bg-white dark:bg-white/5 rounded-lg border border-[#F59E0B]/30 w-36 flex items-center px-4 gap-3 cursor-default shadow-sm dark:shadow-none transition-colors duration-500"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#F59E0B] flex items-center justify-center">
                      <CheckSquare size={10} className="text-white" />
                    </div>
                    <div className="h-2 bg-[#F59E0B]/30 dark:bg-[#F59E0B]/50 rounded w-2/3 transition-colors duration-500" />
                  </motion.div>

                  <motion.div 
                    onMouseEnter={() => setActiveTask(2)}
                    animate={{ x: activeTask === null ? 0 : (activeTask === 2 ? 24 : (activeTask === 1 ? 12 : 0)) }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-10 bg-white dark:bg-white/5 rounded-lg border border-[#EF4444]/30 dark:border-[#EC4899]/30 w-40 flex items-center px-4 gap-3 cursor-default shadow-sm dark:shadow-none transition-colors duration-500"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#EF4444] dark:bg-[#EC4899] flex items-center justify-center transition-colors duration-500">
                      <CheckSquare size={10} className="text-white" />
                    </div>
                    <div className="h-2 bg-[#EF4444]/30 dark:bg-[#EC4899]/50 rounded w-1/3 transition-colors duration-500" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Analytics (col-span-1) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group transition-colors duration-500 shadow-sm"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#0EA5E9]/10 dark:bg-[#22D3EE]/20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500">
                  <BarChart2 className="text-[#0EA5E9] dark:text-[#22D3EE] transition-colors duration-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-500">Analytics</h2>
                <p className="text-slate-600 dark:text-white/60 transition-colors duration-500">Visualize progress,Get insights</p>
              </div>
              <div 
                className="mt-8 relative h-32 w-full flex items-end justify-between px-2 cursor-default"
                onMouseMove={handleAnalyticsMouseMove}
                onMouseLeave={() => setActiveBar(null)}
              >
                {[
                  {h: 40, cDark: '#7B5CF0', cLight: '#4567B7'}, 
                  {h: 70, cDark: '#F59E0B', cLight: '#F59E0B'}, 
                  {h: 45, cDark: '#EC4899', cLight: '#EF4444'}, 
                  {h: 90, cDark: '#7B5CF0', cLight: '#4567B7'}, 
                  {h: 60, cDark: '#F59E0B', cLight: '#F59E0B'}, 
                  {h: 100, cDark: '#EC4899', cLight: '#EF4444'}
                ].map((bar, i) => {
                  const isActive = activeBar === i;
                  const isNeighbor = activeBar !== null && Math.abs(activeBar - i) === 1;
                  const scaleY = activeBar === null ? 1 : (isActive ? 1.3 : (isNeighbor ? 1.1 : 0.8));
                  const c = isDark ? bar.cDark : bar.cLight;
                  
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.h}%` }}
                      animate={{ scaleY }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-1/6 mx-1 rounded-t-sm"
                      style={{ background: `linear-gradient(to top, ${c}33, ${c})`, transformOrigin: 'bottom' }}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* PWA (col-span-1) */}
            <motion.div 
              onMouseMove={handlePwaMouseMove}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group transition-colors duration-500 shadow-sm"
            >
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{ background: pwaBackgroundGradient }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#0EA5E9]/10 dark:bg-[#22D3EE]/20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500">
                  <Download className="text-[#0EA5E9] dark:text-[#22D3EE] transition-colors duration-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-500">PWA App</h2>
                <p className="text-slate-600 dark:text-white/60 transition-colors duration-500">Install to your device.</p>
              </div>
              <div className="mt-8 flex justify-center items-center relative h-32 transition-transform duration-500 group-hover:scale-110">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-24 h-24 bg-gradient-to-tr from-[#38BDF8] dark:from-[#22D3EE] to-blue-500 rounded-2xl flex items-center justify-center shadow-xl border border-slate-200 dark:border-white/20 transition-colors duration-500"
                >
                  <CheckSquare size={32} className="text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* AI Integration (col-span-2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group transition-colors duration-500 shadow-sm"
            >
              <div className="relative z-10 w-full md:w-1/2">
                <div className="w-12 h-12 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500">
                  <Sparkles className="text-[#F59E0B] transition-colors duration-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-500">AI Integration</h2>
                <p className="text-slate-600 dark:text-white/60 transition-colors duration-500">Generate smart tasks, automate your routine, and craft beautiful custom themes with AI.</p>
              </div>
              <motion.div 
                className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center pointer-events-none transition-transform duration-500 group-hover:scale-110"
              >
                <svg width="240" height="240" viewBox="0 0 200 200" className="opacity-80">
                  {/* Outer glow ring */}
                  <motion.circle cx="100" cy="100" r="70" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.5, 0.2] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                  />
                  {/* Slow reverse dashed ring */}
                  <motion.circle cx="100" cy="100" r="60" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="10 15"
                    animate={{ rotate: -360 }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "100px 100px" }}
                  />
                  {/* Fast dashed ring */}
                  <motion.circle cx="100" cy="100" r="50" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 8"
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "100px 100px" }}
                  />
                  {/* Inner arcs */}
                  <motion.circle cx="100" cy="100" r="35" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="60 40"
                    animate={{ rotate: -360 }} 
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "100px 100px" }}
                  />
                  {/* Inner ring */}
                  <circle cx="100" cy="100" r="25" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
                  
                  {/* Center pulse core */}
                  <motion.circle cx="100" cy="100" r="12" fill="#F59E0B" opacity="0.5"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Static center dot */}
                  <circle cx="100" cy="100" r="4" fill="#F59E0B" />
                  
                  {/* Decorative crosshairs */}
                  <motion.path d="M100 20 L100 30 M100 170 L100 180 M20 100 L30 100 M170 100 L180 100" stroke="#F59E0B" strokeWidth="2" opacity="0.6" 
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Real-time Collaboration (col-span-3) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-3 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden group transition-colors duration-500 shadow-sm"
            >
              <div className="flex-1 text-center md:text-left">
                <div className="w-12 h-12 bg-[#10B981]/10 dark:bg-[#50DFAB]/20 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0 transition-colors duration-500">
                  <Users className="text-[#10B981] dark:text-[#50DFAB] transition-colors duration-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-500">Real-time Collaboration</h2>
                <p className="text-slate-600 dark:text-white/60 transition-colors duration-500">Invite friends, share workspaces, and chat directly inside tasks instantly. Everything syncs perfectly.</p>
              </div>
              <div className="flex -space-x-4 py-4 items-center justify-center">
                {[
                  "from-purple-500 to-indigo-500",
                  "from-pink-500 to-rose-500",
                  "from-cyan-500 to-blue-500",
                  "from-amber-500 to-orange-500"
                ].map((grad, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    whileHover={{ y: -10, scale: 1.15, zIndex: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`w-16 h-16 rounded-full border-4 border-white dark:border-[#111111] bg-gradient-to-br ${grad} z-${40 - i*10} shadow-lg cursor-pointer transition-colors duration-500`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto mb-32">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white transition-colors duration-500">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#333333] rounded-2xl overflow-hidden transition-colors duration-500 shadow-sm"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-lg text-slate-900 dark:text-white transition-colors duration-500">{faq.question}</span>
                    <ChevronDown size={20} className={`text-slate-400 dark:text-white/50 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-4 text-slate-600 dark:text-white/60 transition-colors duration-500"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black py-12 px-6 transition-colors duration-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <button aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img src="/favicon.jpg" alt="Pace Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="font-bold text-xl tracking-tight ml-1 text-slate-900 dark:text-white transition-colors duration-500">Pace</span>
            </button>
            <span className="text-slate-400 dark:text-white/40 text-sm ml-2 transition-colors duration-500">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-white/60 transition-colors duration-500">
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
