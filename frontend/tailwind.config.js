
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      color: {
        /* but i want to chnage the value later into a more beatiful color */
         /*"rabbit-red": "#ea2e0e", */
      }
    },
  },
  plugins: [],
}

