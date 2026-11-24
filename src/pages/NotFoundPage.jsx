import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Compass, CheckSquare, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PaceLogo from '../components/landing/PaceLogo';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const primaryDestination = currentUser ? '/tasks' : '/';
  const primaryLabel = currentUser ? 'Return to Tasks' : 'Return to Home';

  return (
    <div className="min-h-screen bg-[#0E1312] text-white flex flex-col justify-between selection:bg-[#FF6B00]/30 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div 
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full pointer-events-none blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, #FF6B00 0%, #22D3EE 60%, transparent 80%)' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none blur-[120px] opacity-15"
        style={{ background: '#FF6B00' }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to={primaryDestination} className="group">
          <PaceLogo />
        </Link>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors py-2 px-3.5 rounded-xl hover:bg-white/5 border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>Go back</span>
        </button>
      </header>

      {/* Main 404 Hero */}
      <main className="relative z-10 max-w-xl mx-auto px-6 py-12 text-center flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wide uppercase text-white/70 mb-8 backdrop-blur-md">
            <Compass size={14} className="text-[#FF6B00] animate-spin" style={{ animationDuration: '14s' }} />
            <span>Error 404 &bull; Page Not Found</span>
          </div>

          {/* Large Stylized 404 */}
          <div className="relative select-none mb-6">
            <span className="text-[100px] sm:text-[140px] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-white/85 to-white/10 bg-clip-text text-transparent">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-[#FF6B00]/25 blur-2xl" />
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Lost your pace?
          </h1>
          <p className="text-base text-white/60 max-w-md mx-auto leading-relaxed mb-8">
            The page you are looking for doesn't exist, has been removed, or has drifted out of rhythm.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to={primaryDestination}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-black bg-[#FF6B00] hover:bg-[#ff7d1f] shadow-lg shadow-[#FF6B00]/20 transition-all active:scale-[0.98]"
            >
              <Home size={16} />
              <span>{primaryLabel}</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-[0.98]"
            >
              <ArrowLeft size={16} />
              <span>Go to previous page</span>
            </button>
          </div>

          {/* Helpful quick directory */}
          <div className="mt-12 pt-8 border-t border-white/10 w-full">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
              Or jump directly to
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-white/70">
              <Link to="/tasks" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <CheckSquare size={13} className="text-[#FF6B00]" />
                <span>Tasks</span>
              </Link>
              <Link to="/calendar" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Calendar size={13} className="text-[#22D3EE]" />
                <span>Calendar</span>
              </Link>
              <Link to="/privacy" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Shield size={13} />
                <span>Privacy</span>
              </Link>
              <Link to="/terms" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <span>Terms</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} Pace. Keep your rhythm.
      </footer>
    </div>
  );
}
