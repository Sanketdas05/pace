import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Calendar, BarChart2, Settings, Zap } from 'lucide-react';
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

  const primaryColor = activeThemeId === 'custom' 
    ? customTheme.vars['--color-primary'] 
    : THEMES[activeThemeId]?.vars['--color-primary'] || '#2C4C3B';

  const isLight = isColorLight(primaryColor);
  const textPrimary = isLight ? 'text-[var(--color-charcoal)]' : 'text-white';
  const textMuted = isLight ? 'text-[var(--color-charcoal)] opacity-60' : 'text-white/60';
  const textMutedHover = isLight ? 'hover:text-[var(--color-charcoal)] hover:bg-black/5' : 'hover:text-white hover:bg-white/10';
  const activeBg = isLight ? 'bg-black/10 text-[var(--color-charcoal)]' : 'bg-white/15 text-white';
  const dividerClass = isLight ? 'bg-black/10' : 'bg-white/10';
  const logoBg = isLight ? 'bg-black/10' : 'bg-white/15';
  const ringClass = isLight ? 'ring-black/20' : 'ring-white/20';

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 shadow-sidebar z-40" style={{ backgroundColor: 'var(--color-primary)' }}>
      {/* Logo */}
      <div className="px-6 py-8">
        <Link to="/tasks" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className={`w-9 h-9 ${logoBg} rounded-xl flex items-center justify-center`}>
            <Zap size={18} className={textPrimary} />
          </div>
          <div>
            <h1 className={`${textPrimary} font-semibold text-base tracking-tight`}>Pace</h1>
            <p className={`${textPrimary} opacity-60 text-xs`}>Defining the speed of life</p>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className={`mx-6 h-px ${dividerClass} mb-6`} />

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
                    ? activeBg
                    : `${textMuted} ${textMutedHover}`
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className={`ml-auto w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[var(--color-charcoal)]' : 'bg-white'}`}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* User Avatar */}
      {currentUser && (
        <div className={`px-6 py-6 border-t ${dividerClass}`}>
          <Link to="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="avatar"
                className={`w-9 h-9 rounded-full object-cover ring-2 ${ringClass}`}
              />
            ) : (
              <div className={`w-9 h-9 ${logoBg} rounded-full flex items-center justify-center ${textPrimary} font-bold text-sm ring-2 ${ringClass}`}>
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
