// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, CheckSquare, Calendar, BarChart2, Mail, Lock, User, Palette, Flame, Shield, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: "Defining the",
    subtitle: "speed of life.",
    features: [
      { icon: CheckSquare, text: 'Smart task management' },
      { icon: Calendar, text: 'Visual calendar view' },
      { icon: BarChart2, text: 'Progress analytics' },
    ]
  },
  {
    title: "Gamified",
    subtitle: "productivity.",
    features: [
      { icon: Zap, text: 'Earn points & level up' },
      { icon: Flame, text: 'Maintain daily streaks' },
      { icon: Calendar, text: 'Build lasting habits' },
    ]
  },
  {
    title: "Collaborate",
    subtitle: "with your team.",
    features: [
      { icon: User, text: 'Assign tasks to members' },
      { icon: Mail, text: 'Real-time team chat' },
      { icon: CheckSquare, text: 'Shared progress tracking' },
    ]
  },
  {
    title: "Beautifully",
    subtitle: "designed.",
    features: [
      { icon: Palette, text: 'Sleek, modern interface' },
      { icon: CheckSquare, text: 'Customizable themes' },
      { icon: BarChart2, text: 'Fluid animations' },
    ]
  },
  {
    title: "Stay focused",
    subtitle: "every day.",
    features: [
      { icon: Shield, text: 'Secure authentication' },
      { icon: BarChart2, text: 'Detailed insights' },
      { icon: CheckSquare, text: 'Never miss a deadline' },
    ]
  }
];

export default function LoginPage() {
  const { currentUser, signInWithGoogle, loginWithEmail, registerWithEmail, enterDemoMode, authLoading } = useAuth();
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
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
    <div className="min-h-screen app-bg flex">
      {/* Left panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-16"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">Pace</span>
        </div>

        {/* Hero text slideshow */}
        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <h2 className="text-white text-5xl font-bold leading-tight mb-6">
                {slides[currentSlide].title}
                <br />
                <span className="text-white/60">{slides[currentSlide].subtitle}</span>
              </h2>
              <div className="space-y-4">
                {slides[currentSlide].features.map(({ icon: Icon, text }, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Icon size={16} className="text-white/80" />
                    </div>
                    <span className="text-white/70 text-sm">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slideshow dots */}
        <div className="flex gap-2 mt-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-white w-4' : 'bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Right panel — Sign In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col items-center justify-center px-8 py-16"
      >
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-[var(--color-charcoal)] font-bold text-xl">Pace</span>
        </div>

        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-[var(--color-charcoal)] mb-2">
              {isLoginView ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-[var(--color-smoke)] mb-8">
              {isLoginView ? 'Sign in to access your workspace' : 'Sign up to start managing your tasks'}
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-3 rounded-xl bg-terracotta/10 text-terracotta text-sm"
              >
                {error}
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-3 rounded-xl bg-forest/10 text-forest text-sm font-medium"
              >
                {successMsg}
              </motion.div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
              {!isLoginView && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-smoke)]" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full pl-11 pr-4 py-3 capitalize rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-smooth"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-smoke)]" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-smooth"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-smoke)]" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-mist)] bg-[var(--color-bg)] text-[var(--color-charcoal)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-smooth"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-smooth hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {loading ? 'Processing...' : isLoginView ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mb-6">
              <button
                type="button"
                onClick={() => { setIsLoginView(!isLoginView); setError(null); setSuccessMsg(null); }}
                className="text-sm font-medium text-[var(--color-smoke)] hover:text-[var(--color-primary)] transition-smooth"
              >
                {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[var(--color-mist)]" />
              <span className="text-xs text-[var(--color-smoke)]">or continue with</span>
              <div className="flex-1 h-px bg-[var(--color-mist)]" />
            </div>

            {/* Google Sign In */}
            <motion.button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 surface rounded-xl border border-[var(--color-mist)] shadow-card hover:shadow-card-hover text-[var(--color-charcoal)] font-medium text-sm transition-smooth disabled:opacity-60 disabled:cursor-not-allowed mb-4"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.7-.2-3.3-.9-4.9z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.6 19 12.5 24 12.5c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z" />
                <path fill="#4CAF50" d="M24 45.5c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.3C29.3 37.1 26.8 38 24 38c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 41 16.2 45.5 24 45.5z" />
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.3c-.4.4 6.6-4.8 6.6-13.7 0-1.7-.2-3.3-.9-4.9z" />
              </svg>
              Google
            </motion.button>

            {/* Demo Mode */}
            <motion.button
              id="demo-mode-btn"
              type="button"
              onClick={enterDemoMode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--color-smoke)] text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-smooth"
            >
              Try Demo Mode
              <ArrowRight size={16} />
            </motion.button>

            <p className="text-center text-xs text-[var(--color-smoke)] mt-6 opacity-60">
              Google & Email Sign-In require Firebase.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
