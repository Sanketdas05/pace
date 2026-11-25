// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Lenis from 'lenis';
import './App.css';
import AuthGuard from './components/auth/AuthGuard';
import Layout from './components/layout/Layout';

// Lazy load all pages to optimize initial bundle size, memory, and LCP
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const JoinTaskPage = lazy(() => import('./pages/JoinTaskPage'));
const TaskDetailsPage = lazy(() => import('./pages/TaskDetailsPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  useEffect(() => {
    // Disable smooth scrolling and RAF loop on mobile to preserve performance
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const lenis = new Lenis({
      prevent: (node) => {
        return Boolean(
          node.hasAttribute?.('data-lenis-prevent') ||
          node.closest?.('[data-lenis-prevent]') ||
          node.closest?.('.overflow-y-auto') ||
          node.closest?.('.overflow-auto') ||
          node.closest?.('.overflow-y-scroll') ||
          node.closest?.('[role="dialog"]')
        );
      },
    });
    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#7B5CF0] border-t-transparent rounded-full animate-spin"></div></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/features" element={<Navigate to="/#features" replace />} />
        <Route
          path="/tasks"
          element={
            <AuthGuard>
              <Layout>
                <TasksPage />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/join/:taskId"
          element={
            <AuthGuard>
              <Layout>
                <JoinTaskPage />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/task/:taskId"
          element={
            <AuthGuard>
              <Layout>
                <TaskDetailsPage />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/calendar"
          element={
            <AuthGuard>
              <Layout>
                <CalendarPage />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Layout>
                <DashboardPage />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <Layout>
                <SettingsPage />
              </Layout>
            </AuthGuard>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
