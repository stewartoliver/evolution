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
        background: {
          light: "#F3F4F6",        // Light background adjusted to gray-100
          DEFAULT: "#FAFAFA",      // Slightly off-white for default background
          dark: "#1F2937",         // Dark background
          "card-light": "#E5E7EB", // Light card background adjusted to gray-200
          "card-dark": "#27303F",  // Dark card background (unchanged)
          "input-light": "#E5E7EB", // Light input background adjusted to gray-200
          "input-dark": "#374151",  // Dark input background (unchanged)
        },
        text: {
          light: "#4B5563",         // Light text adjusted to gray-700
          DEFAULT: "#111827",       // Default text (unchanged)
          dark: "#F9FAFB",          // Dark text (unchanged)
          sub: "#6B7280",            // Subtext Light (unchanged)
          "sub-dark": "#D1D5DB",     // Subtext Dark (unchanged)
        },
        border: {
          light: "#D1D5DB", // Light border adjusted to gray-300
          dark: "#4B5563",  // Dark border (unchanged)
        },
        success: {
          DEFAULT: "#10B981",     // Success color (unchanged)
          dark: "#059669",        // Darker success color for hover (unchanged)
        },
        danger: {
          DEFAULT: "#EF4444",     // Danger color (unchanged)
          dark: "#DC2626",        // Darker danger color for hover (unchanged)
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
