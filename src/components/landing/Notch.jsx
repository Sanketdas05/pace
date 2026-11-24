import React from 'react';

export default function Notch({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      {/* SVG Notch shape */}
      <svg 
        viewBox="0 0 320 58" 
        preserveAspectRatio="none" 
        className="w-[200px] h-[40px] md:w-[320px] md:h-[58px]"
        style={{ fill: 'var(--lp-hero-bg, #111111)', color: 'var(--lp-hero-bg, #111111)', transition: 'fill 0.4s ease, color 0.4s ease' }}
        aria-hidden="true"
      >
        <path d="M0 0C44 0 58 6 76 24C94 42 112 58 148 58H172C208 58 226 42 244 24C262 6 276 0 320 0Z" />
      </svg>
      
      {/* Content inside scoop */}
      <div 
        className="absolute top-1 md:top-2 flex items-center gap-1.5 text-[11px] md:text-xs font-medium tracking-wide"
        style={{ color: 'var(--lp-accent, #FF6B00)', transition: 'color 0.4s ease' }}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
        <span>Make it yours</span>
      </div>
    </div>
  );
}
