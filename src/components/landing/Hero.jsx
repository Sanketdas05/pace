import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import AppWindow from './AppWindow';

// TODO: CTA labels ("Try Pace", "See how streaks work": confirm whether Pace has a free plan or a demo)
export default function Hero() {
  const heroRef = useRef(null);

  // GSAP: ONE restrained sequence, respects prefers-reduced-motion
  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Respect reduced motion: no animation, final state already rendered in static markup
    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Intentionally empty: static HTML displays 12, checked task, and full opacity
    });

    // Motion allowed
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Beat 1: Headline lines, subhead and CTAs
      tl.fromTo('.hero-anim-item',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
      );

      // Beat 2: App window (starts 0.2s after headline)
      tl.fromTo('.app-window-card',
        { x: isMobile ? 0 : 24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.2
      );

      // Beat 3: Task check-off (circle fills scale 0.8 to 1 in 0.25s, text strikes through)
      tl.fromTo('.task-check-circle', 
        { scale: 0.8 }, 
        { scale: 1, duration: 0.25, ease: 'power2.out' }
      );
      tl.fromTo('.task-strike-text',
        { opacity: 0.5, textDecorationLine: 'none' },
        { opacity: 1, textDecorationLine: 'line-through', duration: 0.25, ease: 'power2.out' },
        '<'
      );
    });
  }, { scope: heroRef });

  return (
    <section 
      ref={heroRef}
      className="relative z-10 w-full overflow-hidden pt-8 md:pt-12 lg:pt-14 pb-6 md:pb-8 lg:pb-10 min-h-[calc(100vh-80px)] flex flex-col justify-between"
      aria-label="Pace hero introduction"
    >
      <div className="max-w-[1440px] mx-auto pl-6 sm:pl-8 pr-6 sm:pr-8 lg:pr-0 w-full my-auto">
        
        {/* Desktop Grid: columns 1.05fr / 0.95fr on lg+, 1 column on mobile & tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subhead, CTAs */}
          <div className="flex flex-col items-start pt-2 lg:pt-4">
            
            {/* Headline on two fixed lines that never wrap on desktop */}
            <h1 
              style={{ color: 'var(--lp-hero-text, #FFFFFF)', transition: 'color 0.4s ease' }}
              className="hero-anim-item font-display font-medium text-[clamp(32px,8vw,48px)] lg:text-[clamp(44px,5.4vw,80px)] leading-none tracking-[-0.03em] text-balance lg:text-left mb-6"
            >
              <span className="block lg:whitespace-nowrap" style={{ color: 'var(--lp-hero-text, #FFFFFF)' }}>Finish today.</span>
              <span className="block lg:whitespace-nowrap" style={{ color: 'var(--lp-accent, #FF6B00)' }}>Move at your pace.</span>
            </h1>

            {/* Subhead */}
            <p 
              className="hero-anim-item text-base lg:text-xl font-normal leading-relaxed max-w-[28em] mb-8 lg:mb-10" 
              style={{ color: 'var(--lp-hero-muted, #A1A1AA)', transition: 'color 0.4s ease' }}
            >
              Pace combines distraction-free task management, AI breakdown, and daily flow into one calm space — with streaks and custom themes built right in.
            </p>

            {/* CTAs: Brand Pill Button + Secondary Text Link */}
            <div className="hero-anim-item flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
              
              {/* Primary: Brand Pill Button "Try Pace" */}
              <Link
                to="/login"
                style={{
                  backgroundColor: 'var(--lp-accent, #FF6B00)',
                  color: 'var(--lp-accent-text, #111111)',
                  transition: 'background-color 0.4s ease, color 0.4s ease',
                }}
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-7 rounded-full font-medium text-[16px] sm:text-[17px] hover:opacity-90 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0"
              >
                Try Pace
              </Link>

              {/* Secondary: Text link with 1px underline and slide-in arrow */}
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('features');
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                style={{ color: 'var(--lp-hero-muted, #A1A1AA)', transition: 'color 0.4s ease' }}
                className="group inline-flex items-center gap-2 text-base font-medium hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded py-1 cursor-pointer"
              >
                <span className="underline decoration-1 underline-offset-4">
                  See how Pace works
                </span>
                <svg
                  className="w-4 h-4 transform -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 transition-all duration-150"
                  style={{ color: 'var(--lp-accent, #FF6B00)' }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

            </div>

          </div>

          {/* Right Column: App Window - Phone frame on mobile portrait, full width desktop window on landscape & desktop/tablet */}
          <div className="w-full max-w-[370px] sm:portrait:max-w-[400px] landscape:max-w-[760px] lg:max-w-none mx-auto lg:mx-0 lg:w-[calc(100%+max(0px,calc((100vw-1440px)/2)))] lg:mr-[calc(-1*max(0px,calc((100vw-1440px)/2)))]">
            <AppWindow />
          </div>

        </div>

      </div>
    </section>
  );
}
