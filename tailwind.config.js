// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The property names must be exact
        primaryColor: '#782F40', // Renamed from primary
        accentColor: '#CEB888',   // Renamed from accent
      },
    },
  },
  plugins: [],
}