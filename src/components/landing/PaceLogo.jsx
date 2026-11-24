import React from 'react';

export default function PaceLogo({ className = '', markClassName = '' }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Pace Signature 'p' Folded Leaf Mark */}
      <svg 
        viewBox="0 0 36 36" 
        className={`w-8 h-8 flex-shrink-0 ${markClassName}`} 
        fill="none" 
        style={{ color: 'var(--lp-accent, #FF6B00)', transition: 'color 0.4s ease' }}
        aria-hidden="true"
      >
        {/* Bottom Stem / Petal */}
        <path 
          d="M8.5 17.5C8 23.5 8.5 28 11 31.5C13.5 34.5 17 32.5 18 27.5V17.5H8.5Z" 
          fill="currentColor"
          fillOpacity="0.84"
        />
        {/* Top Rounded Loop / Cap */}
        <path 
          d="M8.5 17.5C8.5 11.2 12.5 6.5 18.5 6.5H23.5C29.5 6.5 34 11.2 34 17.5C34 23.8 29.5 28.5 23.5 28.5H18V17.5H8.5Z" 
          fill="currentColor"
        />
      </svg>
      {/* Lowercase geometric wordmark "pace" */}
      <span 
        className="font-display font-medium text-[26px] tracking-[-0.035em] leading-none lowercase"
        style={{ color: 'var(--lp-nav-text, var(--lp-hero-text, #FFFFFF))', transition: 'color 0.4s ease' }}
      >
        pace
      </span>
    </div>
  );
}
