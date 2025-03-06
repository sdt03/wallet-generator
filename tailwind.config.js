/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          200: "#e44444",
          600: "#731c1b" 
        },
        blue: {
          400: "#343434",
          500: "#28282B"
        }
      }
    },
  },
  plugins: [],
}

