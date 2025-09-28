// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // This is the crucial line for our theme switcher
  theme: {
    extend: {
      // Here we define our elegant, non-generic color palette
      colors: {
        primary: {
          DEFAULT: "#4338CA", // A nice, deep indigo
          hover: "#3730A3", // A slightly darker shade for hover
        },
        // Background colors for the whole page
        background: {
          light: "#F8FAFC", // A very light, clean gray
          dark: "#0B1120", // A deep, near-black navy blue
        },
        // Colors for elements like cards and headers
        surface: {
          light: "#FFFFFF", // White
          dark: "#182133", // A lighter navy blue for contrast
        },
        // Text colors
        text: {
          primary: {
            light: "#0F172A", // Near-black for high contrast on light backgrounds
            dark: "#E2E8F0", // A light gray for readability on dark backgrounds
          },
          secondary: {
            light: "#64748B", // A medium gray for less important text
            dark: "#94A3B8", // A lighter medium gray for dark mode
          },
        },
      },
    },
  },
  plugins: [],
};
