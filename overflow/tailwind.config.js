const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        sans: ["Dosis", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        transparent: 'transparent',
        'over': '#0097cf',
        'overflow': '#031725',
      },

    },
  },
  plugins: [],
}
