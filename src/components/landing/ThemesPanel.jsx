import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Notch from './Notch';

// TODO: Theme palettes (confirm against the real themes: Gen-Z, Snowwy, Forest, Modern)
const themes = [
  {
    id: 'genz',
    name: 'Gen-Z',
    bg: '#1B1033',
    accent: '#D7FF3A',
    text: '#FFFFFF',
    chipText: '#1B1033',
    offset: false,
    tagline: 'Electric & dark'
  },
  {
    id: 'snowwy',
    name: 'Snowwy',
    bg: '#EAF3FB',
    accent: '#4C8FD0',
    text: '#1B2B3A',
    chipText: '#FFFFFF',
    offset: true, // 2nd offset down 24px at lg
    tagline: 'Cool daylight calm'
  },
  {
    id: 'default',
    name: 'Forest',
    bg: '#1F3A2B',
    accent: '#9ED98F',
    text: '#EAF5E6',
    chipText: '#1F3A2B',
    offset: false,
    tagline: 'Earthy & focused'
  },
  {
    id: 'modern',
    name: 'Modern',
    bg: '#FFFFFF',
    accent: '#FF6B00',
    text: '#111111',
    chipText: '#111111',
    offset: true, // 4th offset down 24px at lg
    tagline: 'High contrast craft'
  },
];

export default function ThemesPanel({ className = '' }) {
  const { activeThemeId, setTheme } = useTheme();

  return (
    <section 
      id="themes"
      aria-label="Theme variations"
      style={{
        backgroundColor: 'var(--lp-light-bg, #FAF7F0)',
        color: 'var(--lp-light-text, #111111)',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
      className={`relative z-20 w-full rounded-t-[28px] md:rounded-t-[40px] -mt-20 md:-mt-24 lg:-mt-28 pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 ${className}`}
    >
      {/* Notch at top center */}
      <div className="absolute -top-px left-1/2 -translate-x-1/2 z-30">
        <Notch />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        
        {/* Headings */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-4"
            style={{ backgroundColor: 'var(--lp-light-pill-bg, rgba(0,0,0,0.05))', color: 'var(--lp-light-muted, #757575)' }}
          >
            <span>AESTHETIC & THEMES</span>
          </div>
          <h2 
            className="font-display font-medium text-[clamp(32px,4vw,56px)] leading-tight tracking-tight mb-3"
            style={{ color: 'var(--lp-light-text, #111111)' }}
          >
            Four moods. One streak.
          </h2>
          <p 
            className="text-base md:text-lg font-normal leading-relaxed"
            style={{ color: 'var(--lp-light-muted, #5A5A5A)' }}
          >
            Work feels different in daylight, late nights, and deep sprints. Switch themes anytime without losing a day — or prompt the built-in AI studio to build your custom palette.
          </p>
        </div>

        {/* 4 Miniature Theme Cards: 2x2 on mobile, 4 columns on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto items-start w-full">
          {themes.map((theme) => {
            const isCurrent = activeThemeId === theme.id || (theme.id === 'default' && activeThemeId === 'default');
            return (
              <div 
                key={theme.name}
                onClick={() => setTheme(theme.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setTheme(theme.id); }}
                className="flex flex-col cursor-pointer group focus-visible:outline-none"
              >
                {/* Miniature App Card */}
                <div 
                  className={`rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border transition-all duration-200 group-hover:-translate-y-1.5 ${
                    isCurrent ? 'shadow-lg scale-[1.02]' : 'border-black/[0.06]'
                  }`}
                  style={{
                    '--b': theme.bg,
                    '--a': theme.accent,
                    '--t': theme.text,
                    backgroundColor: 'var(--b)',
                    color: 'var(--t)',
                    borderColor: isCurrent ? 'var(--lp-accent, #FF6B00)' : 'rgba(0,0,0,0.06)',
                    boxShadow: isCurrent ? '0 0 0 2px var(--lp-accent, #FF6B00)' : undefined,
                  }}
                >
                  {/* Card Header: Filler bar + 12 chip */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div className="w-16 h-2 rounded-full opacity-35" style={{ backgroundColor: 'var(--t)' }} />
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-display font-medium tracking-wide shadow-sm"
                      style={{ backgroundColor: 'var(--a)', color: theme.chipText }}
                    >
                      12
                    </span>
                  </div>

                  {/* Three Task Rows: First Checked */}
                  <div className="space-y-2.5">
                    
                    {/* Row 1: Checked */}
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--a)' }}
                      >
                        <svg 
                          className="w-2.5 h-2.5" 
                          style={{ color: theme.chipText }}
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="w-4/5 h-2 rounded opacity-50 line-through" style={{ backgroundColor: 'var(--t)' }} />
                    </div>

                    {/* Row 2: Empty with accent circle */}
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0 opacity-80"
                        style={{ borderColor: 'var(--a)' }}
                      ></div>
                      <div className="w-3/5 h-2 rounded opacity-80" style={{ backgroundColor: 'var(--t)' }} />
                    </div>

                    {/* Row 3: Empty subtle */}
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-4 h-4 rounded-full border flex-shrink-0 opacity-35"
                        style={{ borderColor: 'var(--t)' }}
                      ></div>
                      <div className="w-1/2 h-2 rounded opacity-40" style={{ backgroundColor: 'var(--t)' }} />
                    </div>

                  </div>

                  {/* Bottom miniature filler */}
                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                    <div className="w-10 h-1.5 rounded opacity-25" style={{ backgroundColor: 'var(--t)' }} />
                    <div className="w-6 h-1.5 rounded opacity-25" style={{ backgroundColor: 'var(--t)' }} />
                  </div>

                </div>

                {/* Theme Name & Indicator Under Card */}
                <div className="text-center mt-3">
                  <div 
                    className="text-sm font-medium flex items-center justify-center gap-1.5"
                    style={{ color: 'var(--lp-light-text, #111111)' }}
                  >
                    <span>{theme.name}</span>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--lp-accent, #FF6B00)' }} />}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--lp-light-muted, #757575)' }}>{theme.tagline}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Your Own Custom Theme Card */}
        <div 
          className="mt-12 md:mt-16 max-w-4xl mx-auto w-full rounded-2xl p-5 sm:p-6 border transition-all duration-300"
          style={{
            backgroundColor: 'var(--lp-light-card-bg, #FFFFFF)',
            borderColor: 'var(--lp-light-card-border, rgba(0,0,0,0.08))',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
                style={{
                  backgroundColor: 'var(--lp-accent, #FF6B00)',
                  color: 'var(--lp-accent-text, #111111)',
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-medium text-base md:text-lg" style={{ color: 'var(--lp-light-text, #111111)' }}>
                    Create your own custom theme
                  </h3>
                  <span 
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: 'var(--lp-accent-subtle, rgba(255,107,0,0.12))',
                      color: 'var(--lp-accent, #FF6B00)',
                      border: '1px solid var(--lp-accent-border, rgba(255,107,0,0.3))'
                    }}
                  >
                    AI STUDIO
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1 max-w-xl" style={{ color: 'var(--lp-light-muted, #5A5A5A)' }}>
                  Don’t see your exact aesthetic? Prompt the built-in Theme Studio with any vibe or tweak granular hex colors to make Pace truly yours.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/login"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-xs whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--lp-light-text, #111111)',
                  color: 'var(--lp-light-bg, #FAF7F0)',
                }}
              >
                <span>Try Pace Free</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Subtle bottom transition pill - generous padding so it never gets clipped or crowded */}
      <div className="w-full flex justify-center pt-10 md:pt-14 pb-20 md:pb-28">
        <a 
          href="#ecosystem" 
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('ecosystem');
            if (el) {
              const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }}
          style={{
            backgroundColor: 'var(--lp-light-pill-bg, rgba(0,0,0,0.05))',
            color: 'var(--lp-light-muted, #5A5A5A)',
            transition: 'background-color 0.4s ease, color 0.4s ease',
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity shadow-xs cursor-pointer"
        >
          <span>Explore how Pace works</span>
          <svg className="w-3.5 h-3.5" style={{ color: 'var(--lp-accent, #FF6B00)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </a>
      </div>

    </section>
  );
}
