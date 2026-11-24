import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LANDING_THEMES } from '../config/landingThemes';
import Nav from '../components/landing/Nav';
import Hero from '../components/landing/Hero';
import ThemesPanel from '../components/landing/ThemesPanel';
import WhatItOffers from '../components/landing/WhatItOffers';
import OctopusFlowchart from '../components/landing/OctopusFlowchart';
import BentoGrid from '../components/landing/BentoGrid';
import FaqSection from '../components/landing/FaqSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  const { currentUser, authLoading } = useAuth();
  const { activeThemeId } = useTheme();

  if (authLoading) return null;
  if (currentUser) return <Navigate to="/tasks" replace />;

  const theme = LANDING_THEMES[activeThemeId] || LANDING_THEMES.modern;

  return (
    <div 
      style={{
        '--lp-nav-bg': theme.navBg,
        '--lp-nav-border': theme.navBorder,
        '--lp-nav-pill-bg': theme.navPillBg,
        '--lp-nav-pill-border': theme.navPillBorder,
        '--lp-nav-pill-text': theme.navPillText,
        '--lp-nav-text': theme.navText,
        '--lp-nav-text-muted': theme.navTextMuted,
        '--lp-hero-bg': theme.heroBg,
        '--lp-hero-text': theme.heroText,
        '--lp-hero-muted': theme.heroMuted,
        '--lp-accent': theme.accent,
        '--lp-accent-hover': theme.accentHover,
        '--lp-accent-text': theme.accentText,
        '--lp-accent-subtle': theme.accentSubtle,
        '--lp-accent-border': theme.accentBorder,
        '--lp-light-bg': theme.lightBg,
        '--lp-light-text': theme.lightText,
        '--lp-light-muted': theme.lightMuted,
        '--lp-light-card-bg': theme.lightCardBg,
        '--lp-light-card-border': theme.lightCardBorder,
        '--lp-light-pill-bg': theme.lightPillBg,
        '--lp-dark-bg': theme.darkBg,
        '--lp-dark-bg2': theme.darkBg2,
        '--lp-dark-text': theme.darkText,
        '--lp-dark-muted': theme.darkMuted,
        '--lp-dark-card-bg': theme.darkCardBg,
        '--lp-dark-card-hover-bg': theme.darkCardHoverBg,
        '--lp-dark-card-border': theme.darkCardBorder,
        '--lp-dark-mockup-bg': theme.darkMockupBg,
        // App Mockup Variables
        '--lp-app-sidebar-bg': theme.appSidebarBg,
        '--lp-app-sidebar-text': theme.appSidebarText,
        '--lp-app-sidebar-muted': theme.appSidebarMuted,
        '--lp-app-sidebar-border': theme.appSidebarBorder,
        '--lp-app-sidebar-active-bg': theme.appSidebarActiveBg,
        '--lp-app-sidebar-active-text': theme.appSidebarActiveText,
        '--lp-app-bg': theme.appBg,
        '--lp-app-text': theme.appText,
        '--lp-app-muted': theme.appMuted,
        '--lp-app-border': theme.appBorder,
        '--lp-app-topbar-bg': theme.appTopBarBg,
        '--lp-app-card-today-bg': theme.appCardTodayBg,
        '--lp-app-card-today-border': theme.appCardTodayBorder,
        '--lp-app-card-todo-bg': theme.appCardTodoBg,
        '--lp-app-card-todo-border': theme.appCardTodoBorder,
        '--lp-app-card-overview-bg': theme.appCardOverviewBg,
        '--lp-app-card-overview-text': theme.appCardOverviewText,
        '--lp-app-btn-new-bg': theme.appBtnNewTaskBg,
        '--lp-app-btn-new-text': theme.appBtnNewTaskText,
        '--lp-app-filter-all-bg': theme.appFilterAllBg,
        '--lp-app-filter-all-text': theme.appFilterAllText,
        '--lp-app-filter-other-bg': theme.appFilterOtherBg,
        '--lp-app-filter-other-text': theme.appFilterOtherText,
        '--lp-app-task-card-bg': theme.appTaskCardBg,
        '--lp-app-task-card-border': theme.appTaskCardBorder,
        '--lp-app-task-card-text': theme.appTaskCardText,
        '--lp-app-check-color': theme.appCheckColor,
        '--lp-app-shadow': theme.appShadow,
        '--lp-footer-bg': theme.footerBg,
        '--lp-footer-text': theme.footerText,
        '--lp-footer-muted': theme.footerMuted,
        '--lp-footer-btn-bg': theme.footerBtnBg,
        '--lp-footer-btn-text': theme.footerBtnText,
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
        <WhatItOffers />
        <BentoGrid />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
