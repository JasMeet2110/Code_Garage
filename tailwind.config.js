/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./Client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        subtleZoom: {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.1)" },
        },
        fadeInSoft: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.1)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.9s ease-out",
        subtleZoom: "subtleZoom 15s ease-in-out infinite alternate",
        fadeInSoft: "fadeInSoft 0.4s ease-out",
        pulseSlow: "pulseSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
