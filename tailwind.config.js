/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#558a86",
        secondary: "#a63e14",
        container: "#bfbabe",
        background: "#f1f2f0",
      },
    },
  },
  plugins: [],
};
