/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#07090c',
          900: '#0b0e13',
          850: '#10141b',
          800: '#141922',
          700: '#1b212c',
          600: '#252c39',
          500: '#3a4353',
        },
        ink: {
          100: '#e7eaf0',
          300: '#aab2c2',
          500: '#78829a',
          700: '#4d5568',
        },
        accent: {
          DEFAULT: '#2f6fed',
          dim: '#1f4faa',
        },
        risk: {
          critical: '#e5484d',
          high: '#f0883e',
          medium: '#e8b93a',
          low: '#3aa76d',
          info: '#2f6fed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 1px 2px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
