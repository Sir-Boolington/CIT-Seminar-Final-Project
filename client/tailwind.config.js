/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ts: {
          bg: '#0B0F1A',
          surface: '#131829',
          surface2: '#1A2035',
          accent: '#6366F1',
          accent2: '#818CF8',
          green: '#22C55E',
          red: '#EF4444',
          amber: '#F59E0B',
          text: '#E2E8F0',
          text2: '#94A3B8',
          text3: '#64748B',
          border: 'rgba(99, 102, 241, 0.15)',
          'border-h': 'rgba(99, 102, 241, 0.3)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
