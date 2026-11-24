// src/lib/themes.js
// All theme definitions. Each theme maps CSS variable tokens.

export const THEMES = {
  default: {
    id: 'default',
    name: 'Forest',
    emoji: '🌿',
    description: 'Earthy & focused',
    dark: false,
    vars: {
      '--color-bg': '#F4F7F4',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#1F3A2B',
      '--color-primary-light': '#2E5740',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#1F3A2B',
      '--color-smoke': '#5A7865',
      '--color-mist': 'rgba(44, 76, 59, 0.12)',
      '--color-sidebar-bg': '#1F3A2B',
      '--color-sidebar-text': '#EAF5E6',
      '--color-sidebar-muted': '#8FAFA0',
      '--color-sidebar-border': 'rgba(158, 217, 143, 0.2)',
      '--color-sidebar-active-bg': 'rgba(255, 255, 255, 0.14)',
      '--color-sidebar-active-text': '#FFFFFF',
      '--color-card-today-bg': '#FDFBF7',
      '--color-card-today-border': 'rgba(44, 76, 59, 0.08)',
      '--color-card-todo-bg': '#EDF3ED',
      '--color-card-todo-border': 'rgba(44, 76, 59, 0.08)',
      '--color-card-overview-bg': '#1F3A2B',
      '--color-card-overview-text': '#FFFFFF',
      '--color-btn-new-bg': '#1F3A2B',
      '--color-btn-new-text': '#FFFFFF',
      '--color-accent': '#9ED98F',
      '--color-accent-subtle': 'rgba(158, 217, 143, 0.15)',
      '--color-high': '#A8615A',
      '--color-high-bg': '#F2E8E7',
      '--color-medium': '#B5823A',
      '--color-medium-bg': '#FAF3EA',
      '--color-low': '#5A7860',
      '--color-low-bg': '#EBF0EC',
      '--color-high-dot': '#A8615A',
      '--color-medium-dot': '#D4A373',
      '--color-low-dot': '#9ED98F',
    },
  },

  genz: {
    id: 'genz',
    name: 'Gen-Z',
    emoji: '⚡',
    description: 'Electric & dark',
    dark: true,
    vars: {
      '--color-bg': '#0D061A',
      '--color-surface': '#180D2B',
      '--color-primary': '#D7FF3A',
      '--color-primary-light': '#E2FF66',
      '--color-primary-text': '#1B1033',
      '--color-charcoal': '#FFFFFF',
      '--color-smoke': '#A78BFA',
      '--color-mist': 'rgba(215, 255, 58, 0.18)',
      '--color-sidebar-bg': '#1B1033',
      '--color-sidebar-text': '#FFFFFF',
      '--color-sidebar-muted': '#A78BFA',
      '--color-sidebar-border': 'rgba(215, 255, 58, 0.2)',
      '--color-sidebar-active-bg': '#7B5CF0',
      '--color-sidebar-active-text': '#FFFFFF',
      '--color-card-today-bg': '#1A0F2E',
      '--color-card-today-border': 'rgba(215, 255, 58, 0.18)',
      '--color-card-todo-bg': '#180D2B',
      '--color-card-todo-border': 'rgba(123, 92, 240, 0.22)',
      '--color-card-overview-bg': '#241348',
      '--color-card-overview-text': '#FFFFFF',
      '--color-btn-new-bg': '#D7FF3A',
      '--color-btn-new-text': '#1B1033',
      '--color-accent': '#D7FF3A',
      '--color-accent-subtle': 'rgba(215, 255, 58, 0.15)',
      '--color-high': '#F0527A',
      '--color-high-bg': '#220B15',
      '--color-medium': '#F0A050',
      '--color-medium-bg': '#201200',
      '--color-low': '#D7FF3A',
      '--color-low-bg': '#121F06',
      '--color-high-dot': '#F0527A',
      '--color-medium-dot': '#F0A050',
      '--color-low-dot': '#D7FF3A',
      '--genz-violet': '#7B5CF0',
      '--genz-pink': '#EC4899',
      '--genz-cyan': '#22D3EE',
      '--genz-card-border': 'rgba(215, 255, 58, 0.2)',
    },
  },

  modern: {
    id: 'modern',
    name: 'Modern',
    emoji: '🟧',
    description: 'High contrast craft',
    dark: false,
    vars: {
      '--color-bg': '#FAF7F0',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#FF6B00',
      '--color-primary-light': '#FF8533',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#111111',
      '--color-smoke': '#666666',
      '--color-mist': '#EAEAEA',
      '--color-sidebar-bg': '#FCFCFC',
      '--color-sidebar-text': '#111111',
      '--color-sidebar-muted': '#888888',
      '--color-sidebar-border': '#EAEAEA',
      '--color-sidebar-active-bg': '#111111',
      '--color-sidebar-active-text': '#FFFFFF',
      '--color-card-today-bg': '#FFFFFF',
      '--color-card-today-border': 'rgba(0, 0, 0, 0.08)',
      '--color-card-todo-bg': '#F5F5F7',
      '--color-card-todo-border': 'rgba(0, 0, 0, 0.08)',
      '--color-card-overview-bg': '#111111',
      '--color-card-overview-text': '#FFFFFF',
      '--color-btn-new-bg': '#111111',
      '--color-btn-new-text': '#FFFFFF',
      '--color-accent': '#FF6B00',
      '--color-accent-subtle': 'rgba(255, 107, 0, 0.12)',
      '--color-high': '#DC2626',
      '--color-high-bg': '#FEF2F2',
      '--color-medium': '#FF6B00',
      '--color-medium-bg': '#FFF3EB',
      '--color-low': '#059669',
      '--color-low-bg': '#ECFDF5',
      '--color-high-dot': '#EF4444',
      '--color-medium-dot': '#FF6B00',
      '--color-low-dot': '#10B981',
    },
  },

  snowwy: {
    id: 'snowwy',
    name: 'Snowwy',
    emoji: '❄️',
    description: 'Cool daylight calm',
    dark: false,
    vars: {
      '--color-bg': '#EAF2FA',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#3B82F6',
      '--color-primary-light': '#60A5FA',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#0F1E2E',
      '--color-smoke': '#47637D',
      '--color-mist': '#CBE0F2',
      '--color-sidebar-bg': '#FFFFFF',
      '--color-sidebar-text': '#0F1E2E',
      '--color-sidebar-muted': '#47637D',
      '--color-sidebar-border': '#CBE0F2',
      '--color-sidebar-active-bg': '#3B82F6',
      '--color-sidebar-active-text': '#FFFFFF',
      '--color-card-today-bg': '#FFFFFF',
      '--color-card-today-border': '#CBE0F2',
      '--color-card-todo-bg': '#F4F9FD',
      '--color-card-todo-border': '#CBE0F2',
      '--color-card-overview-bg': '#0F1E2E',
      '--color-card-overview-text': '#FFFFFF',
      '--color-btn-new-bg': '#3B82F6',
      '--color-btn-new-text': '#FFFFFF',
      '--color-accent': '#3B82F6',
      '--color-accent-subtle': 'rgba(59, 130, 246, 0.15)',
      '--color-high': '#EF4444',
      '--color-high-bg': '#FEE2E2',
      '--color-medium': '#3B82F6',
      '--color-medium-bg': '#EFF6FF',
      '--color-low': '#10B981',
      '--color-low-bg': '#D1FAE5',
      '--color-high-dot': '#EF4444',
      '--color-medium-dot': '#3B82F6',
      '--color-low-dot': '#10B981',
    },
  },

  vengence: {
    id: 'vengence',
    name: 'Vengence',
    emoji: '🦇',
    description: 'Dark, red & yellow',
    dark: true,
    vars: {
      '--color-bg': '#050505',
      '--color-surface': '#121212',
      '--color-primary': '#991B1B',
      '--color-primary-light': '#B91C1C',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#F8FAFC',
      '--color-smoke': '#94A3B8',
      '--color-mist': '#27272A',
      '--color-sidebar-bg': '#0F0F0F',
      '--color-sidebar-text': '#F8FAFC',
      '--color-sidebar-muted': '#94A3B8',
      '--color-sidebar-border': '#27272A',
      '--color-sidebar-active-bg': '#991B1B',
      '--color-sidebar-active-text': '#FFFFFF',
      '--color-card-today-bg': '#121212',
      '--color-card-today-border': '#27272A',
      '--color-card-todo-bg': '#18181B',
      '--color-card-todo-border': '#27272A',
      '--color-card-overview-bg': '#991B1B',
      '--color-card-overview-text': '#FFFFFF',
      '--color-btn-new-bg': '#991B1B',
      '--color-btn-new-text': '#FFFFFF',
      '--color-accent': '#FDE047',
      '--color-accent-subtle': 'rgba(253, 224, 71, 0.15)',
      '--color-high': '#FDE047',
      '--color-high-bg': '#422006',
      '--color-medium': '#F97316',
      '--color-medium-bg': '#431407',
      '--color-low': '#64748B',
      '--color-low-bg': '#1E293B',
      '--color-high-dot': '#FDE047',
      '--color-medium-dot': '#F97316',
      '--color-low-dot': '#64748B',
    },
  },

  calm: {
    id: 'calm',
    name: 'Calm',
    emoji: '🌸',
    description: 'Soft & serene',
    dark: false,
    vars: {
      '--color-bg': '#F7F4FB',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#7C6B9E',
      '--color-primary-light': '#9580C0',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#2E2340',
      '--color-smoke': '#8A7FA0',
      '--color-mist': '#EAE5F0',
      '--color-sidebar-bg': '#F2ECF8',
      '--color-sidebar-text': '#2E2340',
      '--color-sidebar-muted': '#8A7FA0',
      '--color-sidebar-border': '#EAE5F0',
      '--color-sidebar-active-bg': '#7C6B9E',
      '--color-sidebar-active-text': '#FFFFFF',
      '--color-card-today-bg': '#FFFFFF',
      '--color-card-today-border': '#EAE5F0',
      '--color-card-todo-bg': '#F8F5FC',
      '--color-card-todo-border': '#EAE5F0',
      '--color-card-overview-bg': '#7C6B9E',
      '--color-card-overview-text': '#FFFFFF',
      '--color-btn-new-bg': '#7C6B9E',
      '--color-btn-new-text': '#FFFFFF',
      '--color-accent': '#7C6B9E',
      '--color-accent-subtle': 'rgba(124, 107, 158, 0.15)',
      '--color-high': '#C4849A',
      '--color-high-bg': '#FDF0F4',
      '--color-medium': '#7EA8C4',
      '--color-medium-bg': '#EEF6FC',
      '--color-low': '#8BC4B8',
      '--color-low-bg': '#EEF8F6',
      '--color-high-dot': '#C4849A',
      '--color-medium-dot': '#7EA8C4',
      '--color-low-dot': '#8BC4B8',
    },
  },

  pookie: {
    id: 'pookie',
    name: 'Pookie',
    emoji: '🎀',
    description: 'Bold & playful',
    dark: false,
    vars: {
      '--color-bg': '#FCEBF3',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#D63384',
      '--color-primary-light': '#E91E8C',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#2D1A26',
      '--color-smoke': '#8A5775',
      '--color-mist': '#F3C5DF',
      '--color-sidebar-bg': '#FFFFFF',
      '--color-sidebar-text': '#2D1A26',
      '--color-sidebar-muted': '#8A5775',
      '--color-sidebar-border': '#F3C5DF',
      '--color-sidebar-active-bg': '#D63384',
      '--color-sidebar-active-text': '#FFFFFF',
      '--color-card-today-bg': '#FFFFFF',
      '--color-card-today-border': '#F3C5DF',
      '--color-card-todo-bg': '#FFF3F8',
      '--color-card-todo-border': '#F3C5DF',
      '--color-card-overview-bg': '#D63384',
      '--color-card-overview-text': '#FFFFFF',
      '--color-btn-new-bg': '#D63384',
      '--color-btn-new-text': '#FFFFFF',
      '--color-accent': '#D63384',
      '--color-accent-subtle': 'rgba(214, 51, 132, 0.15)',
      '--color-high': '#FF5C7A',
      '--color-high-bg': '#FFF0F3',
      '--color-medium': '#FF9E4A',
      '--color-medium-bg': '#FFF7EF',
      '--color-low': '#B87DFF',
      '--color-low-bg': '#F6EEFF',
      '--color-high-dot': '#FF5C7A',
      '--color-medium-dot': '#FF9E4A',
      '--color-low-dot': '#B87DFF',
    },
  },
};

export const DEFAULT_CUSTOM_THEME = {
  id: 'custom',
  name: 'Custom',
  emoji: '🎨',
  description: 'Your own palette',
  dark: false,
  vars: { ...THEMES.default.vars },
};

export function hexToRgb(hex) {
  if (!hex) return [0,0,0];
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return [+r, +g, +b];
}

export function getLuminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function isColorLight(hex) {
  const [r, g, b] = hexToRgb(hex);
  return getLuminance(r, g, b) > 0.35; // slightly lower threshold for better contrast switching
}

export const CUSTOM_THEME_FIELDS = [
  { key: '--color-bg', label: 'Background', group: 'App' },
  { key: '--color-surface', label: 'Card Surface', group: 'App' },
  { key: '--color-primary', label: 'Primary Color', group: 'App' },
  { key: '--color-charcoal', label: 'Text Color', group: 'App' },
  { key: '--color-smoke', label: 'Muted Text', group: 'App' },
  { key: '--color-mist', label: 'Border / Divider', group: 'App' },
  { key: '--color-high-dot', label: 'High Priority', group: 'Priority' },
  { key: '--color-medium-dot', label: 'Medium Priority', group: 'Priority' },
  { key: '--color-low-dot', label: 'Low Priority', group: 'Priority' },
];

export function buildFullThemeVars(colorMap, explicitDark = null) {
  const bg = colorMap['--color-bg'] || colorMap.bg || '#F9F8F6';
  const surface = colorMap['--color-surface'] || colorMap.surface || '#FFFFFF';
  const primary = colorMap['--color-primary'] || colorMap.primary || '#1F3A2B';
  const charcoal = colorMap['--color-charcoal'] || colorMap.charcoal || '#1F3A2B';
  const smoke = colorMap['--color-smoke'] || colorMap.smoke || '#5A7865';
  const mist = colorMap['--color-mist'] || colorMap.mist || 'rgba(0, 0, 0, 0.08)';
  const highDot = colorMap['--color-high-dot'] || colorMap.highDot || '#EF4444';
  const mediumDot = colorMap['--color-medium-dot'] || colorMap.mediumDot || '#F59E0B';
  const lowDot = colorMap['--color-low-dot'] || colorMap.lowDot || '#10B981';

  const dark = explicitDark !== null ? explicitDark : !isColorLight(bg);
  const primaryText = isColorLight(primary) ? '#111827' : '#FFFFFF';

  return {
    id: 'custom',
    name: 'Custom',
    emoji: '🎨',
    description: 'Custom AI palette',
    dark,
    vars: {
      '--color-bg': bg,
      '--color-surface': surface,
      '--color-primary': primary,
      '--color-primary-light': primary,
      '--color-primary-text': primaryText,
      '--color-charcoal': charcoal,
      '--color-smoke': smoke,
      '--color-mist': mist,
      '--color-sidebar-bg': dark ? surface : bg,
      '--color-sidebar-text': charcoal,
      '--color-sidebar-muted': smoke,
      '--color-sidebar-border': mist,
      '--color-sidebar-active-bg': primary,
      '--color-sidebar-active-text': primaryText,
      '--color-card-today-bg': surface,
      '--color-card-today-border': mist,
      '--color-card-todo-bg': dark ? bg : surface,
      '--color-card-todo-border': mist,
      '--color-card-overview-bg': primary,
      '--color-card-overview-text': primaryText,
      '--color-btn-new-bg': primary,
      '--color-btn-new-text': primaryText,
      '--color-accent': primary,
      '--color-accent-subtle': primary + '26',
      '--color-high': highDot,
      '--color-high-bg': highDot + '22',
      '--color-medium': mediumDot,
      '--color-medium-bg': mediumDot + '22',
      '--color-low': lowDot,
      '--color-low-bg': lowDot + '22',
      '--color-high-dot': highDot,
      '--color-medium-dot': mediumDot,
      '--color-low-dot': lowDot,
    }
  };
}

export function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  if (theme.dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
