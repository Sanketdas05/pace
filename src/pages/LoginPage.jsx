// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LANDING_THEMES } from '../config/landingThemes';
import { CheckSquare, Calendar, BarChart2, Mail, Lock, User, Palette, Flame, Shield, ArrowRight, Sparkles } from 'lucide-react';

const slides = [
  {
    title: "Finish today.",
    subtitle: "Move at your pace.",
    features: [
      { icon: CheckSquare, text: 'Distraction-free task workspace' },
      { icon: Calendar, text: 'Visual calendar & timeline scheduling' },
      { icon: BarChart2, text: 'Daily flow with zero cognitive clutter' },
    ]
  },
  {
    title: "Keep the streak.",
    subtitle: "Small wins. Visible progress.",
    features: [
      { icon: Flame, text: 'Habit streaks, shields & level-ups' },
      { icon: Shield, text: '3-question evening structured reflection' },
      { icon: CheckSquare, text: 'Instant check-offs & momentum tracking' },
    ]
  },
  {
    title: "Make it yours.",
    subtitle: "4 handcrafted looks + AI Studio.",
    features: [
      { icon: Palette, text: 'Gen-Z, Modern, Forest & Snowwy palettes' },
      { icon: Sparkles, text: 'AI custom theme prompt generator' },
      { icon: CheckSquare, text: 'Granular token control across all cards' },
    ]
  },
  {
    title: "Connected ecosystem.",
    subtitle: "Offline-first reactive hub.",
    features: [
      { icon: User, text: 'Real-time multiplayer task inboxes' },
      { icon: Mail, text: 'In-task team chat & shared notes' },
      { icon: BarChart2, text: 'Offline-first local sync' },
    ]
  }
];

export default function LoginPage() {
  const { currentUser, signInWithGoogle, loginWithEmail, registerWithEmail, enterDemoMode, authLoading } = useAuth();
  const { activeThemeId } = useTheme();
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();
  const from = location.state?.from || '/tasks';

  const theme = LANDING_THEMES[activeThemeId] || LANDING_THEMES.modern;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (authLoading) return null;
  if (currentUser) return <Navigate to={from} replace />;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await signInWithGoogle();
      window.location.href = from;
    } catch (err) {
      setError(`Google sign-in failed: ${err.message}`);
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      if (isLoginView) {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) throw new Error('Name is required');
        await registerWithEmail(name, email, password);
        setSuccessMsg('Verification email sent! Please check your inbox and verify before logging in.');
        setIsLoginView(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col lg:flex-row transition-colors duration-500 overflow-x-hidden selection:bg-brand selection:text-[#111111]"
      style={{
        backgroundColor: theme.heroBg,
        color: theme.heroText,
      }}
    >
      {/* Left panel — Branding Showcase (Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 lg:p-16 relative border-r overflow-hidden transition-colors duration-500"
        style={{ 
          backgroundColor: theme.darkBg2 || theme.darkBg || theme.heroBg,
          borderColor: theme.darkCardBorder || 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Ambient background glow matching accent */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 transition-all duration-700"
          style={{ backgroundColor: theme.accent }}
        />

        {/* Brand Logo & Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <Link 
            to="/" 
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Pace home"
          >
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs transition-transform duration-200 group-hover:scale-105"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderColor: theme.darkCardBorder || 'rgba(255, 255, 255, 0.12)',
                color: theme.accent 
              }}
            >
              <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none">
                <path 
                  d="M8.5 17.5C8 23.5 8.5 28 11 31.5C13.5 34.5 17 32.5 18 27.5V17.5H8.5Z" 
                  fill="currentColor"
                  fillOpacity="0.84"
                />
                <path 
                  d="M8.5 17.5C8.5 11.2 12.5 6.5 18.5 6.5H23.5C29.5 6.5 34 11.2 34 17.5C34 23.8 29.5 28.5 23.5 28.5H18V17.5H8.5Z" 
                  fill="currentColor" 
                />
              </svg>
            </div>
            <div>
              <span className="font-display font-medium text-2xl tracking-tight block" style={{ color: theme.heroText }}>
                pace
              </span>
              <span className="text-[10px] tracking-wide uppercase font-mono block opacity-60" style={{ color: theme.heroMuted }}>
                defining the speed of life
              </span>
            </div>
          </Link>
        </div>

        {/* Hero text slideshow */}
        <div className="relative z-10 my-auto py-12">
          <div className="relative h-72">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4 w-fit border"
                  style={{
                    backgroundColor: theme.accentSubtle,
                    borderColor: theme.accentBorder,
                    color: theme.accent,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                  <span>WORKSPACE ACCESS</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-display font-medium tracking-tight leading-[1.1] mb-6" style={{ color: theme.heroText }}>
                  {slides[currentSlide].title}
                  <br />
                  <span style={{ color: theme.accent }}>{slides[currentSlide].subtitle}</span>
                </h2>

                <div className="space-y-3.5">
                  {slides[currentSlide].features.map(({ icon: Icon, text }, i) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                      className="flex items-center gap-3"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center border"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: theme.darkCardBorder || 'rgba(255, 255, 255, 0.1)',
                          color: theme.accent,
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: theme.heroMuted }}>
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slideshow dots */}
        <div className="relative z-10 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === currentSlide ? '24px' : '8px',
                backgroundColor: i === currentSlide ? theme.accent : 'rgba(255, 255, 255, 0.2)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right panel — Sign In / Sign Up Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative"
      >
        {/* Top bar on right: Mobile Logo */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 group">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderColor: theme.darkCardBorder || 'rgba(255, 255, 255, 0.12)',
                color: theme.accent 
              }}
            >
              <svg viewBox="0 0 36 36" className="w-5 h-5" fill="none">
                <path 
                  d="M8.5 17.5C8 23.5 8.5 28 11 31.5C13.5 34.5 17 32.5 18 27.5V17.5H8.5Z" 
                  fill="currentColor"
                  fillOpacity="0.84"
                />
                <path 
                  d="M8.5 17.5C8.5 11.2 12.5 6.5 18.5 6.5H23.5C29.5 6.5 34 11.2 34 17.5C34 23.8 29.5 28.5 23.5 28.5H18V17.5H8.5Z" 
                  fill="currentColor" 
                />
              </svg>
            </div>
            <span className="font-display font-medium text-xl tracking-tight" style={{ color: theme.heroText }}>
              pace
            </span>
          </Link>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-sm mx-auto my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-display font-medium tracking-tight mb-2" style={{ color: theme.heroText }}>
              {isLoginView ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm mb-8" style={{ color: theme.heroMuted }}>
              {isLoginView ? 'Sign in to access your workspace' : 'Sign up to start moving at your pace'}
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 px-4 py-3 rounded-xl text-sm border bg-red-500/10 border-red-500/20 text-red-400"
              >
                {error}
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 px-4 py-3 rounded-xl text-sm font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              >
                {successMsg}
              </motion.div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
              {!isLoginView && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} style={{ color: theme.heroMuted }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm border transition-all duration-200 outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: theme.heroText,
                      focusBorderColor: theme.accent,
                    }}
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} style={{ color: theme.heroMuted }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm border transition-all duration-200 outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: theme.heroText,
                    focusBorderColor: theme.accent,
                  }}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18} style={{ color: theme.heroMuted }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm border transition-all duration-200 outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: theme.heroText,
                    focusBorderColor: theme.accent,
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                style={{ 
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                  boxShadow: `0 4px 20px -2px ${theme.accent}35`,
                }}
              >
                {loading ? 'Processing...' : isLoginView ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mb-6">
              <button
                type="button"
                onClick={() => { setIsLoginView(!isLoginView); setError(null); setSuccessMsg(null); }}
                className="text-sm font-medium transition-colors duration-200 hover:underline"
                style={{ color: theme.heroMuted }}
              >
                {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs font-mono uppercase tracking-wider opacity-60" style={{ color: theme.heroMuted }}>or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Sign In */}
            <motion.button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border border-white/10 font-medium text-sm transition-all duration-200 hover:bg-white/[0.08] disabled:opacity-60 disabled:cursor-not-allowed mb-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: theme.heroText,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.7-.2-3.3-.9-4.9z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.6 19 12.5 24 12.5c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z" />
                <path fill="#4CAF50" d="M24 45.5c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.3C29.3 37.1 26.8 38 24 38c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 41 16.2 45.5 24 45.5z" />
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.3c-.4.4 6.6-4.8 6.6-13.7 0-1.7-.2-3.3-.9-4.9z" />
              </svg>
              <span>Continue with Google</span>
            </motion.button>

            {/* Demo Mode */}
            <motion.button
              id="demo-mode-btn"
              type="button"
              onClick={enterDemoMode}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 font-semibold text-sm rounded-xl border transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: theme.accentSubtle,
                color: theme.accent,
                borderColor: theme.accentBorder,
              }}
            >
              <span>Try Demo Mode</span>
              <ArrowRight size={16} />
            </motion.button>

            <p className="text-center text-xs mt-6 opacity-40 font-mono" style={{ color: theme.heroMuted }}>
              Offline-ready · Local-first fallback enabled
            </p>
          </motion.div>
        </div>

        {/* Footer / Back link */}
        <div className="text-center lg:text-left mt-8 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs" style={{ color: theme.heroMuted }}>
          <Link to="/" className="hover:underline flex items-center gap-1.5 mb-2 sm:mb-0" style={{ color: theme.heroMuted }}>
            <span>← Back to homepage</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
