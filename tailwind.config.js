/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: "class",
  theme: {
    extend: {
      colors: {
        primaryDark: "#022b2e",
        secondaryDark: "#09596c",
        buttonPrimary: "#36cfde",
        buttonSecondary: "#2eb8aa",
      },
      boxShadow: {
        innerTopShadow: "inset 0px 44px 5px 0px rgba(0,0,0,0.75)",
      },
    },
    screens: {
      xs: "320px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
