// src/lib/themes.js
// All theme definitions. Each theme maps CSS variable tokens.

export const THEMES = {
  default: {
    id: 'default',
    name: 'Forest',
    emoji: '🌿',
    description: 'Clean & earthy',
    dark: false,
    vars: {
      '--color-bg': '#F9F8F6',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#2C4C3B',
      '--color-primary-light': '#3D6B53',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#2D2D2D',
      '--color-smoke': '#6B6B6B',
      '--color-mist': '#E8E6E1',
      '--color-high': '#A8615A',
      '--color-high-bg': '#F2E8E7',
      '--color-medium': '#B5823A',
      '--color-medium-bg': '#FAF3EA',
      '--color-low': '#5A7860',
      '--color-low-bg': '#EBF0EC',
      '--color-high-dot': '#A8615A',
      '--color-medium-dot': '#D4A373',
      '--color-low-dot': '#7C9082',
    },
  },

  genz: {
    id: 'genz',
    name: 'Gen-Z',
    emoji: '⚡',
    description: 'Dark & electric',
    dark: true,
    vars: {
      '--color-bg': '#000000',
      '--color-surface': '#111111',
      '--color-primary': '#7B5CF0',
      '--color-primary-light': '#9B7FF7',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#FFFFFF',
      '--color-smoke': '#888888',
      '--color-mist': '#222222',
      '--color-high': '#F0527A',
      '--color-high-bg': '#220B15',
      '--color-medium': '#F0A050',
      '--color-medium-bg': '#201200',
      '--color-low': '#50DFAB',
      '--color-low-bg': '#06201A',
      '--color-high-dot': '#F0527A',
      '--color-medium-dot': '#F0A050',
      '--color-low-dot': '#50DFAB',
      '--genz-violet': '#7B5CF0',
      '--genz-pink': '#EC4899',
      '--genz-cyan': '#22D3EE',
      '--genz-card-border': '#333333',
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
      '--color-primary': '#991B1B', // Dark Red
      '--color-primary-light': '#B91C1C',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#F8FAFC',
      '--color-smoke': '#94A3B8',
      '--color-mist': '#27272A', // Dark gray
      '--color-high': '#FDE047', // Bright Yellow Accent
      '--color-high-bg': '#422006', // Dark yellow/brown bg
      '--color-medium': '#F97316', // Orange
      '--color-medium-bg': '#431407', // Dark orange bg
      '--color-low': '#64748B', // Gray
      '--color-low-bg': '#1E293B', // Darker gray bg
      '--color-high-dot': '#FDE047', // Bright Yellow
      '--color-medium-dot': '#F97316',
      '--color-low-dot': '#64748B',
    },
  },

  modern: {
    id: 'modern',
    name: 'Modern',
    emoji: '🔷',
    description: 'Crisp & professional',
    dark: false,
    vars: {
      '--color-bg': '#F0F4FF',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#2563EB',
      '--color-primary-light': '#3B82F6',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#111827',
      '--color-smoke': '#6B7280',
      '--color-mist': '#E5E7EB',
      '--color-high': '#DC2626',
      '--color-high-bg': '#FEF2F2',
      '--color-medium': '#D97706',
      '--color-medium-bg': '#FFFBEB',
      '--color-low': '#059669',
      '--color-low-bg': '#ECFDF5',
      '--color-high-dot': '#EF4444',
      '--color-medium-dot': '#F59E0B',
      '--color-low-dot': '#10B981',
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

  snowwy: {
    id: 'snowwy',
    name: 'Snowwy',
    emoji: '❄️',
    description: 'Crisp & icy',
    dark: false,
    vars: {
      '--color-bg': '#F8FAFC',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#4567B7',
      '--color-primary-light': '#6B8BD0',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#0F172A',
      '--color-smoke': '#64748B',
      '--color-mist': '#E2E8F0',
      '--color-high': '#EF4444',
      '--color-high-bg': '#FEE2E2',
      '--color-medium': '#F59E0B',
      '--color-medium-bg': '#FEF3C7',
      '--color-low': '#10B981',
      '--color-low-bg': '#D1FAE5',
      '--color-high-dot': '#EF4444',
      '--color-medium-dot': '#F59E0B',
      '--color-low-dot': '#10B981',
    },
  },

  pookie: {
    id: 'pookie',
    name: 'Pookie',
    emoji: '🎀',
    description: 'Bold & playful',
    dark: false,
    vars: {
      '--color-bg': '#FFF5FB',
      '--color-surface': '#FFFFFF',
      '--color-primary': '#D63384',
      '--color-primary-light': '#E91E8C',
      '--color-primary-text': '#FFFFFF',
      '--color-charcoal': '#2D1A26',
      '--color-smoke': '#9B6E8A',
      '--color-mist': '#F8E0EF',
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

export function applyTheme(theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  if (theme.dark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
