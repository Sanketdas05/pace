import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaceLogo from './PaceLogo';

// TODO: CTA labels ("Try Pace", "See how streaks work": confirm whether Pace has a free plan or a demo)
export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Section links on the landing page (matches exact scroll sequence)
  const navLinks = [
    { label: 'Themes', href: '#themes' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'Capabilities', href: '#bento' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      style={{
        backgroundColor: 'var(--lp-nav-bg, rgba(17,17,17,0.92))',
        borderColor: 'var(--lp-nav-border, rgba(255,255,255,0.06))',
        transition: 'background-color 0.4s ease, border-color 0.4s ease',
      }}
      className="sticky top-0 z-50 w-full backdrop-blur-md border-b"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        {/* Desktop and Tablet Nav Layout: Grid with shared horizontal axis */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-20">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-0.5 text-left"
              aria-label="Pace home"
            >
              <PaceLogo />
            </button>
          </div>

          {/* Center: Rounded-full pill with landing page section links */}
          <div className="flex items-center justify-center">
            <div 
              style={{
                backgroundColor: 'var(--lp-nav-pill-bg, rgba(255,255,255,0.06))',
                borderColor: 'var(--lp-nav-pill-border, rgba(255,255,255,0.12))',
                color: 'var(--lp-nav-pill-text, #E4E4E7)',
                transition: 'background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease',
              }}
              className="inline-flex items-center rounded-full p-[3px] text-[13.5px] border shadow-sm"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3.5 py-1.5 rounded-full hover:opacity-75 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  style={{ color: 'inherit' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Log in link + Brand button */}
          <div className="flex items-center justify-end gap-4">
            <Link
              to="/login"
              style={{
                color: 'var(--lp-nav-pill-text, #E4E4E7)',
                transition: 'color 0.4s ease',
              }}
              className="text-sm font-medium hover:opacity-75 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
            >
              Log in
            </Link>

            <Link
              to="/login"
              style={{
                backgroundColor: 'var(--lp-accent, #FF6B00)',
                color: 'var(--lp-accent-text, #111111)',
                transition: 'background-color 0.4s ease, color 0.4s ease',
              }}
              className="h-10 px-5 rounded-full text-sm font-medium flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-sm hover:opacity-90"
            >
              Try Pace
            </Link>
          </div>

        </div>

        {/* Mobile Nav Layout (< md) */}
        <div className="flex md:hidden items-center justify-between h-20">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-0.5"
            aria-label="Pace home"
          >
            <PaceLogo />
          </button>

          <div className="flex items-center gap-2.5">
            {/* 44px Hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              style={{
                backgroundColor: 'var(--lp-nav-pill-bg, rgba(255,255,255,0.06))',
                borderColor: 'var(--lp-nav-pill-border, rgba(255,255,255,0.12))',
                color: 'var(--lp-nav-pill-text, #E4E4E7)',
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-4 pb-6 border-t border-white/[0.06] flex flex-col gap-2.5"
            role="dialog"
            aria-label="Mobile navigation links"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2 text-base text-ink-2 hover:text-white hover:bg-surface rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  backgroundColor: 'var(--lp-accent, #FF6B00)',
                  color: 'var(--lp-accent-text, #111111)',
                  transition: 'background-color 0.4s ease, color 0.4s ease',
                }}
                className="w-full h-12 rounded-full font-medium text-base flex items-center justify-center hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-sm"
              >
                Try Pace
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-ink-2 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Log in
              </Link>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
