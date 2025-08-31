/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f9f9f9",
        secondary: "#e2f047",
        tertiary: "#404040",
        deep: '#0b4c53',
        light: '#f9fbfc',
        gray: {
          10: "#EEEEEE",
          20: "#A2A2A2",
          30: "#7B7B7B",
          50: "#585858",
          90: "#141414",
        },
      },
      screens: {
        xs: "400px",
      },
      backgroundImage: {
        hero: "url(/src/assets/bg.png)",
      },
    },
  },
  plugins: [],
}

