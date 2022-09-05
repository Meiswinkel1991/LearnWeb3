/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1b2030",
        secondary: "#292e41",
        jellygrey: "#D2D4DC",
        btngrey: "#383C4F",
        jellyblue: "#2D8997",
        jellypink: "#FF00AF",
      },
    },
  },
  plugins: [],
};
