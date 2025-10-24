import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#312e81',    // indigo-900
          light: '#a5b4fc',   // indigo-200
        },
        accent: {
          DEFAULT: '#06b6d4', // teal-400
          dark: '#134e4a',    // teal-900
          light: '#67e8f9',   // teal-200
        },
        surface: {
          DEFAULT: '#f3f4f6', // gray-100
          dark: '#1e293b',    // slate-800
        },
        glass: 'rgba(255,255,255,0.08)',
        violet: {
          DEFAULT: '#8b5cf6', // violet-500
          light: '#ddd6fe',   // violet-200
        },
      },
      animation: {
        border: "border 4s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
    },
  },
  plugins: [daisyui],
};
