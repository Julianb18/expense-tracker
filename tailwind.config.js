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
        primaryDark: "#272e34",
        secondaryDark: "#1f2429",
        buttonPrimary: "#0c464b",
        buttonSecondary: "#248f84",
      },
      boxShadow: {
        innerTopShadow: "inset 0px 44px 5px 0px rgba(0,0,0,0.75)",
      },
      keyframes: {
        bounceArrow: {
          "0%": {
            transform: "translateY(-15%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(20%)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
          "100%": {
            transform: "translateY(-15%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
        },
      },
      animation: {
        bounceArrow: "bounceArrow 2s infinite",
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
