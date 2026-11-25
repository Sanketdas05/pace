import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LANDING_THEMES, getLandingThemeVars } from '../config/landingThemes';
import Nav from '../components/landing/Nav';
import Hero from '../components/landing/Hero';
import ThemesPanel from '../components/landing/ThemesPanel';
import OctopusFlowchart from '../components/landing/OctopusFlowchart';
import BentoGrid from '../components/landing/BentoGrid';
import WhatItOffers from '../components/landing/WhatItOffers';
import FaqSection from '../components/landing/FaqSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  const { currentUser, authLoading } = useAuth();
  const { activeThemeId } = useTheme();
  const [showAllTools, setShowAllTools] = useState(false);

  // Auto-expand if URL has #features
  useEffect(() => {
    if (window.location.hash === '#features') {
      setShowAllTools(true);
      setTimeout(() => {
        const el = document.getElementById('features');
        if (el) {
          const navOffset = 70;
          const targetY = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  if (authLoading) return null;
  if (currentUser) return <Navigate to="/tasks" replace />;

  const theme = LANDING_THEMES[activeThemeId] || LANDING_THEMES.modern;
  const themeVars = getLandingThemeVars(theme);

  // Smoothly reveal the drawer and scroll down to show the tools
  const handleToggleTools = (open) => {
    if (open) {
      setShowAllTools(true);
      setTimeout(() => {
        const featuresEl = document.getElementById('features');
        if (featuresEl) {
          const navOffset = 70;
          const targetY = featuresEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      handleCollapseTools();
    }
  };

  // Smoothly collapse without jumping to footer
  const handleCollapseTools = () => {
    const triggerEl = document.getElementById('bento-tools-trigger');
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      // If user has scrolled down into the tools section
      if (rect.top < -20) {
        const navOffset = 120;
        const targetY = triggerEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
        // Allow viewport to smoothly scroll up to the trigger before collapsing
        setTimeout(() => {
          setShowAllTools(false);
        }, 320);
        return;
      }
    }
    setShowAllTools(false);
  };

  // When clicking "Explore All Tools" in the footer, open and scroll directly below Bento
  const handleFooterExploreTools = () => {
    setShowAllTools(true);
    setTimeout(() => {
      const target = document.getElementById('features') || document.getElementById('bento-tools-trigger');
      if (target) {
        const navOffset = 70;
        const targetY = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
        window.history.pushState(null, '', '#features');
      }
    }, 120);
  };

  return (
    <div 
      style={{
        ...themeVars,
        backgroundColor: theme.heroBg,
        color: theme.heroText,
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
      className="min-h-screen font-sans selection:bg-brand selection:text-[#111111] overflow-x-hidden"
    >
      <Nav />
      <main>
        <Hero />
        <ThemesPanel />
        <OctopusFlowchart />
        <BentoGrid showAllTools={showAllTools} onToggleTools={handleToggleTools} />
        <AnimatePresence>
          {showAllTools && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-t-[32px] md:rounded-t-[48px] -mt-8 md:-mt-12 relative z-30 shadow-[0_-25px_60px_rgba(0,0,0,0.4)]"
            >
              <WhatItOffers onCollapse={handleCollapseTools} />
            </motion.div>
          )}
        </AnimatePresence>
        <FaqSection />
      </main>
      <Footer onExploreTools={handleFooterExploreTools} />
    </div>
  );
}
