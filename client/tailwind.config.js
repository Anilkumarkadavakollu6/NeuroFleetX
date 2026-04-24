/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This line is the "bridge" that makes your Context work
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090b', // Ultra-dark for premium look
        }
      }
    },
  },
  plugins: [],
}