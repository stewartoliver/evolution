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
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3B82F6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        background: {
          light: "#F9FAFB",       // Light background
          DEFAULT: "#FFFFFF",     // Default background
          dark: "#1F2937",        // Dark background
        },
        text: {
          light: "#1F2937",       // Light text
          DEFAULT: "#111827",     // Default text
          dark: "#F9FAFB",        // Dark text
          sub: "#6B7280",         // Subtext Light
          "sub-dark": "#D1D5DB",  // Subtext Dark
        },
        secondary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        border: {
          light: "#E5E7EB", // Light border
          dark: "#4B5563",  // Dark border
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
