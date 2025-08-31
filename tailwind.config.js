/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
  // Remove forced line-height on large display sizes globally
  '5xl': ['4rem', { lineHeight: 'normal' }],
  '6xl': ['4.5rem', { lineHeight: 'normal' }],
  '7xl': ['5rem', { lineHeight: 'normal' }],
      },
    },
  },
  plugins: [],
};
