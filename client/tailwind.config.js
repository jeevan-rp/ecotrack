/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: '#0A1914',
          light: '#112A22'
        },
        accent: {
          green: '#00FFA3',
          lime: '#D4FF00'
        },
        mint: '#A3C6B9'
      }
    },
  },
  plugins: [],
}
