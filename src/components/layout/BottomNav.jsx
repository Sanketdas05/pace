// src/components/layout/BottomNav.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { CheckSquare, Calendar, BarChart2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/dashboard', icon: 'dashboard', label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const icons = {
  dashboard: BarChart2,
};

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-mist)] safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon, label }) => {
          const Icon = typeof icon === 'string' ? icons[icon] || BarChart2 : icon;
          const isActive = to === '/tasks' ? location.pathname === '/tasks' : location.pathname.startsWith(to);

          return (
            <NavLink key={to} to={to} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-smooth ${
                  isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-smoke)]'
                }`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.5} />
                  {isActive && (
                    <motion.div
                      layoutId="bottom-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--color-primary)] rounded-full"
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-[var(--color-primary)]' : ''}`}>
                  {label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
