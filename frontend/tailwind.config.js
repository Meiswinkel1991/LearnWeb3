const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F28C18",

        secondary: "#6D3A9C",

        accent: "#51A800",

        neutral: "#1B1D1D",

        "base-100": "#212121",

        info: "#2463EB",

        success: "#16A249",

        warning: "#DB7706",

        error: "#DC2828",
      },
    },
  },

  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".active-nav-btn": {
          color: theme("colors.primary"),
          "text-decoration-line": "underline",
          "text-underline-offset": "4px",
          "text-decoration-thickness": "2px",
        },
      });
    }),
  ],
};
