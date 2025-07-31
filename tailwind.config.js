/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        consulting: {
          navy: '#1e293b',
          blue: '#3b82f6',
          gray: '#64748b',
          lightgray: '#f1f5f9',
          green: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'consulting': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
} 