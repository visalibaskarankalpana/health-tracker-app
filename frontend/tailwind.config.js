/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',   // blue
        secondary: '#06b6d4', // teal
        accent: '#f97316',    // orange
        leaf: '#22c55e',      // green
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.06)',
        glow: '0 10px 30px rgba(37, 99, 235, 0.25)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
