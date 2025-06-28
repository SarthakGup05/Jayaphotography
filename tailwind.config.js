/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        blush: {
          DEFAULT: '#F8E1E9',
        },
        charcoal: {
          DEFAULT: '#4A4A4A',
        },
        gold: {
          DEFAULT: '#FFD700',
        },
      },
    },
  },
  plugins: [],
};
