// src/pages/FeaturesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { LANDING_THEMES, getLandingThemeVars } from '../config/landingThemes';
import WhatItOffers from '../components/landing/WhatItOffers';
import PaceLogo from '../components/landing/PaceLogo';
import Footer from '../components/landing/Footer';

export default function FeaturesPage() {
  const { activeThemeId } = useTheme();
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
      className="min-h-screen flex flex-col justify-between selection:bg-[#FF6B00]/30 overflow-x-hidden font-sans"
    >
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="group">
          <PaceLogo />
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors py-2 px-3.5 rounded-xl hover:bg-white/5 border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Full Feature Cards */}
      <main className="flex-1">
        <WhatItOffers />
      </main>

      <Footer />
    </div>
  );
}
