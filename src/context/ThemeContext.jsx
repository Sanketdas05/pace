// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, DEFAULT_CUSTOM_THEME, applyTheme } from '../lib/themes';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'taskflow-theme-id';
const CUSTOM_STORAGE_KEY = 'taskflow-custom-theme';

export function ThemeProvider({ children }) {
  const [activeThemeId, setActiveThemeId] = useState('modern');
  const [customTheme, setCustomTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOM_THEME;
    } catch { return DEFAULT_CUSTOM_THEME; }
  });

  // On mount — restore saved theme
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY) || 'modern';
    setActiveThemeId(savedId);
    const theme = savedId === 'custom'
      ? (() => {
          try {
            const c = localStorage.getItem(CUSTOM_STORAGE_KEY);
            return c ? JSON.parse(c) : DEFAULT_CUSTOM_THEME;
          } catch { return DEFAULT_CUSTOM_THEME; }
        })()
      : THEMES[savedId] || THEMES.modern;
    applyTheme(theme);
  }, []);

  const setTheme = (themeId) => {
    const theme = themeId === 'custom' ? customTheme : THEMES[themeId] || THEMES.modern;
    setActiveThemeId(themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
    applyTheme(theme);
  };

  const updateCustomTheme = (vars) => {
    const updated = { ...customTheme, vars: { ...customTheme.vars, ...vars } };
    setCustomTheme(updated);
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(updated));
    // If custom is active, apply immediately
    if (activeThemeId === 'custom') {
      applyTheme(updated);
    }
    return updated;
  };

  const saveAndApplyCustom = (themeToApply) => {
    const theme = themeToApply || customTheme;
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(theme));
    localStorage.setItem(STORAGE_KEY, 'custom');
    setActiveThemeId('custom');
    applyTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{
      activeThemeId,
      customTheme,
      setTheme,
      updateCustomTheme,
      saveAndApplyCustom,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
