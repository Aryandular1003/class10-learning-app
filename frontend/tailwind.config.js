/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Accent — Warm Amber
        amber: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Secondary Accent — Teal (progress, streaks, success)
        teal: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Paid/Locked indicator — Soft Violet
        violet: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Backgrounds & Surfaces
        cream: {
          50:  '#FFFDF9',
          100: '#FFFBF5',
          200: '#FEF7EE',
          300: '#FDF0DC',
        },
        // Stone / Warm grey for text-secondary
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        // Semantic
        success: '#16A34A',
        warning: '#EA580C',
        danger:  '#DC2626',

        // Aliases for easy use in components
        'bg-base':        '#FFFBF5',
        'surface':        '#FFFFFF',
        'text-primary':   '#1C1917',
        'text-secondary': '#78716C',
        'accent':         '#F59E0B',
        'accent-dark':    '#B45309',
        'locked':         '#7C3AED',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'h2': ['22px', { lineHeight: '1.3',  fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '1.4',  fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'sm':   ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'xs':   ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
      },
      borderRadius: {
        'card':   '16px',
        'btn':    '12px',
        'pill':   '9999px',
        'chip':   '8px',
      },
      boxShadow: {
        'card':   '0 2px 12px 0 rgba(28, 25, 23, 0.07)',
        'card-md':'0 4px 24px 0 rgba(28, 25, 23, 0.10)',
        'amber':  '0 4px 14px 0 rgba(245, 158, 11, 0.30)',
        'teal':   '0 4px 14px 0 rgba(13, 148, 136, 0.25)',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      backgroundImage: {
        'amber-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'teal-gradient':  'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
        'violet-gradient':'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'warm-gradient':  'linear-gradient(180deg, #FFFBF5 0%, #FDF0DC 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
