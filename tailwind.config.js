/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7fa",
          100: "#dcecf2",
          200: "#b9d9e5",
          300: "#8fc1d2",
          400: "#61a5bd",
          500: "#2f6b8a",
          600: "#285c76",
          700: "#214c61",
          800: "#1a3d4d",
          900: "#122d39",
        },
      },
    },
  },

  plugins: [],
};