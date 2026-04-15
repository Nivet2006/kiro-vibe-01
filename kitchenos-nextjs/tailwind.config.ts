import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':        '#000000',
        'bg-surface':     '#0A0A0A',
        'bg-elevated':    '#111111',
        'border-subtle':  '#1E1E1E',
        'border-active':  '#333333',
        'accent-lime':    '#E2FF43',
        'accent-white':   '#FFFFFF',
        'status-success': '#00FF41',
        'status-warning': '#FFBF00',
        'status-danger':  '#FF3131',
        'text-primary':   '#FFFFFF',
        'text-secondary': '#888888',
        'text-muted':     '#444444',
        'text-mono':      '#E2FF43',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h1':      ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h2':      ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3':      ['18px', { lineHeight: '1.4', letterSpacing: '0em',     fontWeight: '600' }],
        'body':    ['14px', { lineHeight: '1.6', letterSpacing: '0.01em',  fontWeight: '400' }],
        'label':   ['12px', { lineHeight: '1.4', letterSpacing: '0.04em',  fontWeight: '500' }],
        'mono-sm': ['12px', { lineHeight: '1.5', letterSpacing: '0em',     fontWeight: '400' }],
        'mono-md': ['14px', { lineHeight: '1.5', letterSpacing: '0em',     fontWeight: '500' }],
      },
      spacing: {
        '1': '4px',  '2': '8px',  '3': '12px', '4': '16px',
        '6': '24px', '8': '32px', '12': '48px', '16': '64px',
      },
      borderRadius: {
        'none': '0px', 'sm': '2px', 'DEFAULT': '4px', 'md': '6px',
      },
      animation: {
        'pulse-red':  'pulse-red 2s ease-in-out infinite',
        'blink-live': 'blink-live 1.5s ease-in-out infinite',
        'log-entry':  'log-entry 0.2s ease-out forwards',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 49, 49, 0.4)' },
          '50%':      { boxShadow: '0 0 8px 2px rgba(255, 49, 49, 0.15)' },
        },
        'blink-live': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        'log-entry': {
          'from': { opacity: '0', transform: 'translateY(-8px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
