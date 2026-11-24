/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#111111',
        surface: '#1E1E1E',
        'surface-2': '#262626',
        'ink-2': '#B5B5B5',
        'ink-3': '#757575',
        brand: '#FF6B00',
        'brand-deep': '#D95500',
        cream: '#F4F0E4',
        forest: {
          DEFAULT: '#2C4C3B',
          light: '#3D6B53',
          dark: '#1E3328',
        },
        terracotta: {
          DEFAULT: '#A8615A',
          light: '#C47B73',
          muted: '#F2E8E7',
        },
        sand: {
          DEFAULT: '#D4A373',
          light: '#E2BC95',
          muted: '#FAF3EA',
        },
        sage: {
          DEFAULT: '#7C9082',
          light: '#9BB0A1',
          muted: '#EBF0EC',
        },
        charcoal: '#2D2D2D',
        mist: '#E8E6E1',
        smoke: '#6B6B6B',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(44, 76, 59, 0.08)',
        'card-hover': '0 8px 32px rgba(44, 76, 59, 0.14)',
        'fab': '0 4px 24px rgba(44, 76, 59, 0.30)',
        'modal': '0 24px 64px rgba(0,0,0,0.15)',
        'sidebar': '2px 0 24px rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
