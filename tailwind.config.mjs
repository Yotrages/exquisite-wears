/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
    mode: "jit",
    theme: {
      extend: {
        colors: {
            primary: "#001F3F",
            secondary: "#00f6ff",
            dimWhite: "rgba(255, 255, 255, 0.7)",
            dimBlue: "rgba(9, 151, 124, 0.1)"
        },
        fontFamily: {
            poppins: ["poppins", "sans-serif"],
        },
      },
      screens: {
        qy: "575px",
        xs: "480px",
        ss: "632px",
        sm: "768px",
        md: "940px",
        xl: "1200px",
      },
    },
    plugins: [],
  }
