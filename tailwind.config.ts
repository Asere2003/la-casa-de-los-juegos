import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:            '#004317',
        'primary-container':'#1a5c2a',
        'primary-light':    '#2d7a3f',
        secondary:          '#805533',
        tertiary:           '#755b00',
        gold:               '#c9a84c',
        'gold-dim':         '#e6c364',
        surface:            '#fff8f6',
        'surface-low':      '#fff1ec',
        'surface-container':'#ffe9e2',
        'surface-lowest':   '#ffffff',
        'on-surface':       '#2a170f',
        'on-surface-var':   '#40493f',
        outline:            '#717a6f',
        'outline-var':      '#c0c9bc',
        'wood-dark':        '#2c1810',
        'wood-deep':        '#1a0f0a',
        error:              '#ba1a1a',
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'Noto Serif', 'serif'],
        body:     ['var(--font-body)', 'Newsreader', 'serif'],
        mono:     ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        lg:      '4px',
        xl:      '8px',
        full:    '12px',
      },
      boxShadow: {
        warm:    '0 4px 16px rgba(42,23,15,.09)',
        'warm-lg':'0 20px 48px rgba(42,23,15,.18)',
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease forwards',
        'fade-in-up':  'fadeInUp 0.6s ease forwards',
        'slide-left':  'slideInLeft 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
