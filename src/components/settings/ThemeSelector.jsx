// src/components/settings/ThemeSelector.jsx
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { THEMES } from '../../lib/themes';
import { useTheme } from '../../context/ThemeContext';

function ThemePreview({ theme }) {
  const { vars } = theme;
  return (
    <div
      className="w-full h-16 rounded-xl overflow-hidden flex"
      style={{ backgroundColor: vars['--color-bg'] }}
    >
      {/* Sidebar strip */}
      <div className="w-5 h-full flex flex-col gap-1 p-1.5" style={{ backgroundColor: vars['--color-primary'] }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1 rounded-full bg-white/30" />
        ))}
      </div>
      {/* Content area */}
      <div className="flex-1 p-2 flex flex-col gap-1.5">
        {/* Card mock */}
        <div className="flex-1 rounded-lg p-1.5 flex items-center gap-1.5" style={{ backgroundColor: vars['--color-surface'] }}>
          <div className="w-1.5 h-full rounded-full" style={{ backgroundColor: vars['--color-high-dot'] }} />
          <div className="flex-1 space-y-1">
            <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: vars['--color-mist'] }} />
            <div className="h-1 rounded-full w-1/2" style={{ backgroundColor: vars['--color-mist'] }} />
          </div>
          <div
            className="w-5 h-5 rounded-full border-2 flex-shrink-0"
            style={{ borderColor: vars['--color-low-dot'] }}
          />
        </div>
        {/* Second card */}
        <div className="flex-1 rounded-lg p-1.5 flex items-center gap-1.5" style={{ backgroundColor: vars['--color-surface'] }}>
          <div className="w-1.5 h-full rounded-full" style={{ backgroundColor: vars['--color-medium-dot'] }} />
          <div className="flex-1 space-y-1">
            <div className="h-1.5 rounded-full w-2/3" style={{ backgroundColor: vars['--color-mist'] }} />
            <div className="h-1 rounded-full w-1/3" style={{ backgroundColor: vars['--color-mist'] }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThemeSelector() {
  const { activeThemeId, setTheme } = useTheme();
  const themeList = Object.values(THEMES);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {themeList.map((theme) => {
        const isActive = activeThemeId === theme.id;
        return (
          <motion.button
            key={theme.id}
            id={`theme-${theme.id}`}
            onClick={() => setTheme(theme.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative p-3 rounded-2xl border-2 text-left transition-all duration-200 ${
              isActive
                ? 'border-[var(--color-primary)] shadow-md'
                : 'border-[var(--color-mist)] hover:border-[var(--color-smoke)]/40'
            }`}
          >
            {/* Active checkmark */}
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Check size={11} className="text-white" strokeWidth={3} />
              </motion.div>
            )}

            {/* Preview */}
            <ThemePreview theme={theme} />

            {/* Label */}
            <div className="mt-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{theme.emoji}</span>
                <span className="font-semibold text-sm text-[var(--color-charcoal)]">{theme.name}</span>
              </div>
              <p className="text-[10px] text-[var(--color-smoke)] mt-0.5">{theme.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
