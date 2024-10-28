// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class", // Enable dark mode using the 'class' strategy
  content: [
    "./app/views/**/*.{erb,haml,html,slim}",
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.{js,jsx}",
    "./app/components/**/*.{rb,erb,haml,html,slim,js,jsx}",
    "./app/assets/stylesheets/**/*.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        teachers: ["Teachers", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#e0f2fe", // Lighter than before to increase contrast with 100
          100: "#bae6fd", // More distinct from 50
          200: "#7dd3fc",
          300: "#38bdf8",
          400: "#0ea5e9",
          500: "#0284c7",
          600: "#0369a1",
          700: "#075985",
          800: "#0c4a6e",
          900: "#0a3653",
        },
        secondary: {
          50: "#d1fae5", // Lighter and more distinct from 100
          100: "#a7f3d0",
          200: "#6ee7b7",
          300: "#34d399",
          400: "#10b981",
          500: "#059669",
          600: "#047857",
          700: "#065f46",
          800: "#064e3b",
          900: "#032f2f",
        },
        background: {
          light: "#E5E7EB", // Darkened slightly for better contrast with DEFAULT
          DEFAULT: "#FAFAFA", // Remains slightly off-white
          dark: "#1F2937", // Dark background remains unchanged
          "card-light": "#D1D5DB", // Darkened to gray-300 for better differentiation
          "card-dark": "#27303F", // Dark card background remains unchanged
          "input-light": "#D1D5DB", // Darkened to gray-300 for better differentiation
          "input-dark": "#374151", // Dark input background remains unchanged
        },
        text: {
          light: "#4B5563", // Light text remains unchanged
          DEFAULT: "#111827", // Default text remains unchanged
          dark: "#F9FAFB", // Dark text remains unchanged
          sub: "#6B7280", // Subtext Light remains unchanged
          "sub-dark": "#D1D5DB", // Subtext Dark remains unchanged
        },
        border: {
          light: "#9CA3AF", // Increased contrast from gray-300 to gray-400
          dark: "#4B5563", // Dark border remains unchanged
        },
        success: {
          DEFAULT: "#10B981", // Success color remains unchanged
          dark: "#059669", // Darker success color remains unchanged
        },
        danger: {
          DEFAULT: "#EF4444", // Danger color remains unchanged
          dark: "#DC2626", // Darker danger color remains unchanged
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
