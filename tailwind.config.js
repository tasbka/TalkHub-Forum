// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fef5fb',
        foreground: '#4a2c5e',
        primary: '#b08cc9',
        secondary: '#f5e6f8',
        muted: '#9b7faa',
        border: 'rgba(176, 140, 201, 0.25)',
      }
    },
  },
  plugins: [],
}