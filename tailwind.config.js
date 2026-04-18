/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8b7355",
        "primary-dark": "#6b5744",
        accent: "#c9a86c",
        "accent-dark": "#a8884d",
        sand: "#f5f0e8",
        "sand-dark": "#1a1915",
      },
    },
  },
  plugins: [],
};