import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PaceLogo from './PaceLogo';

export default function Footer({ className = '' }) {
  return (
    <footer 
      role="contentinfo"
      style={{
        backgroundColor: 'var(--lp-footer-bg, #D95500)',
        color: 'var(--lp-footer-text, #FFFFFF)',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
      className={`relative z-30 w-full pt-20 md:pt-28 pb-12 px-6 sm:px-8 rounded-t-[32px] md:rounded-t-[40px] -mt-8 md:-mt-12 shadow-2xl overflow-hidden ${className}`}
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* FINAL CTA */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/15 text-xs font-mono font-medium text-white/90 mb-6">
            <span>START YOUR WORKFLOW</span>
          </div>

          <h2 className="font-display font-medium text-[clamp(42px,6vw,84px)] leading-[1.03] tracking-tight text-white mb-6">
            Your next productive day starts here.
          </h2>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-normal leading-relaxed mb-8">
            Capture tasks, break them down with AI, build daily streaks, and collaborate with your team without friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/login"
              style={{
                backgroundColor: 'var(--lp-footer-btn-bg, #FFFFFF)',
                color: 'var(--lp-footer-btn-text, #111111)',
                transition: 'background-color 0.4s ease, color 0.4s ease',
              }}
              className="w-full sm:w-auto h-14 px-8 rounded-full font-medium text-base hover:opacity-90 inline-flex items-center justify-center shadow-lg"
            >
              <span>Try Pace Free</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-black/15 border border-white/20 text-white font-medium text-base hover:bg-black/25 transition-colors duration-150 inline-flex items-center justify-center"
            >
              <span>Explore All Tools</span>
            </a>
          </div>
        </div>

        {/* Bottom Navigation & Copyright */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/80">
          
          {/* Left: Logo & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <PaceLogo markClassName="text-white" />
            <span className="hidden sm:inline-block text-white/30">|</span>
            <span className="font-mono text-white/80">
              Defining the speed of life
            </span>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
            <a href="#themes" className="hover:text-white transition-colors">Themes</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#bento" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>

          {/* Right Copyright */}
          <div className="flex items-center gap-4 font-mono text-white/70">
            <span>© {new Date().getFullYear()} Pace Systems.</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
