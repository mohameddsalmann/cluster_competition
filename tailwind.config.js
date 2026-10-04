/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cluster: {
          navy: '#09233f',
          navyLight: '#103357',
          activeBlue: '#0083cb',
          gradientStart: '#0052b4',
          gradientMid: '#0078cf',
          gradientEnd: '#009ee3',
          bg: '#f1f4f8',
          card: '#ffffff',
          border: '#e2e8f0',
          textMuted: '#64748b',
          textDark: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
