import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, BarChart2, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { THEMES, isColorLight } from '../../lib/themes';

const navItems = [
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/dashboard', icon: BarChart2, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const { activeThemeId, customTheme } = useTheme();

  const themeVars = activeThemeId === 'custom' 
    ? customTheme.vars 
    : THEMES[activeThemeId]?.vars || THEMES.default.vars;

  const sidebarBg = themeVars['--color-sidebar-bg'] || themeVars['--color-surface'] || themeVars['--color-primary'] || '#2C4C3B';
  const sidebarBorder = themeVars['--color-sidebar-border'] || themeVars['--color-mist'] || 'rgba(0,0,0,0.08)';
  const accentColor = themeVars['--color-accent'] || themeVars['--color-primary'] || '#FF6B00';
  
  const isLight = isColorLight(sidebarBg);

  // Robust active item background & text: guaranteed high contrast on any theme
  const candidateActiveBg = themeVars['--color-sidebar-active-bg'];
  const sidebarActiveBg = candidateActiveBg && candidateActiveBg !== 'transparent' && candidateActiveBg !== 'rgba(255, 255, 255, 0.15)'
    ? candidateActiveBg
    : (isLight ? (themeVars['--color-primary'] || '#2C4C3B') : 'rgba(255, 255, 255, 0.15)');

  const isActiveBgLight = isColorLight(sidebarActiveBg);
  const candidateActiveText = themeVars['--color-sidebar-active-text'];
  const sidebarActiveText = candidateActiveText && (isActiveBgLight ? !isColorLight(candidateActiveText) : isColorLight(candidateActiveText))
    ? candidateActiveText
    : (isActiveBgLight ? '#0F1E2E' : '#FFFFFF');

  const textPrimary = isLight ? 'text-[var(--color-charcoal)]' : 'text-white';
  const textMuted = isLight ? 'text-[var(--color-smoke)]' : 'text-white/60';
  const textMutedHover = isLight ? 'hover:text-[var(--color-charcoal)] hover:bg-black/5' : 'hover:text-white hover:bg-white/10';
  const dividerClass = isLight ? 'bg-black/10' : 'bg-white/10';
  const logoBg = isLight ? 'bg-black/5' : 'bg-white/15';
  const ringClass = isLight ? 'ring-black/20' : 'ring-white/20';

  return (
    <aside 
      className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 shadow-sidebar z-40 border-r transition-colors duration-300" 
      style={{ backgroundColor: sidebarBg, borderColor: sidebarBorder }}
    >
      {/* Logo */}
      <div className="px-6 py-8">
        <Link to="/tasks" className="flex items-center gap-3 hover:opacity-85 transition-opacity group">
          <div className={`w-9 h-9 ${logoBg} rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
            <svg 
              viewBox="0 0 36 36" 
              className="w-5 h-5 flex-shrink-0" 
              fill="none" 
              style={{ color: accentColor }}
              aria-hidden="true"
            >
              <path 
                d="M8.5 17.5C8 23.5 8.5 28 11 31.5C13.5 34.5 17 32.5 18 27.5V17.5H8.5Z" 
                fill="currentColor"
                fillOpacity="0.84"
              />
              <path 
                d="M8.5 17.5C8.5 11.2 12.5 6.5 18.5 6.5H23.5C29.5 6.5 34 11.2 34 17.5C34 23.8 29.5 28.5 23.5 28.5H18V17.5H8.5Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
          <div>
            <h1 className={`${textPrimary} font-display font-medium text-lg tracking-tight leading-none lowercase`}>pace</h1>
            <p className={`${textPrimary} opacity-60 text-[10px] tracking-wide uppercase font-mono mt-0.5`}>Defining the speed of life</p>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px mb-6 transition-colors duration-300" style={{ backgroundColor: sidebarBorder }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="block"
            >
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth ${
                  isActive
                    ? 'shadow-xs'
                    : `${textMuted} ${textMutedHover}`
                }`}
                style={isActive ? { backgroundColor: sidebarActiveBg, color: sidebarActiveText } : {}}
              >
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.5} style={isActive ? { color: sidebarActiveText } : {}} />
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`} style={isActive ? { color: sidebarActiveText } : {}}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: sidebarActiveText }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* User Avatar */}
      {currentUser && (
        <div className="px-6 py-6 border-t transition-colors duration-300" style={{ borderColor: sidebarBorder }}>
          <Link to="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="avatar"
                className={`w-9 h-9 rounded-full object-cover ring-2 ${ringClass}`}
              />
            ) : (
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ring-2 ${ringClass}`}
                style={{ backgroundColor: accentColor, color: isColorLight(accentColor) ? '#111111' : '#FFFFFF' }}
              >
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`${textPrimary} text-sm font-medium truncate`}>
                {currentUser.displayName || 'User'}
              </p>
              <p className={`${textPrimary} opacity-60 text-xs truncate`}>
                {currentUser.email}
              </p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
