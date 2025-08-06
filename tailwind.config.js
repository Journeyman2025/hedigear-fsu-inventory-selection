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
        // You can define custom FSU colors here if you want
        primary: '#782F40', // Example: FSU Garnet
        accent: '#CEB888',  // Example: FSU Gold
      },
    },
  },
  plugins: [],
}