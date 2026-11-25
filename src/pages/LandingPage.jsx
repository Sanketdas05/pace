import React, { useState } from 'react';
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

  if (authLoading) return null;
  if (currentUser) return <Navigate to="/tasks" replace />;

  const theme = LANDING_THEMES[activeThemeId] || LANDING_THEMES.modern;
  const themeVars = getLandingThemeVars(theme);

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
        <BentoGrid showAllTools={showAllTools} onToggleTools={setShowAllTools} />
        <AnimatePresence>
          {showAllTools && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <WhatItOffers onCollapse={() => setShowAllTools(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
