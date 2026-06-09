/** @type {import('tailwindcss').Config} */
// tailwind.config.js
// Tells Tailwind which files to scan for class names.
// Only classes found in these files will be included in the final CSS bundle.

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Scan all JS/JSX files inside src/
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        general: ["General Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      // Custom colors for our dark purple/cyan theme
      colors: {
        "quantum-dark": "#0a0a1a",
        "quantum-card": "#0f0f2a",
        "quantum-border": "#1e1e4a",
        "quantum-purple": "#7c3aed",
        "quantum-cyan": "#06b6d4",
        "quantum-glow": "rgba(124, 58, 237, 0.3)",
      },
      // Custom animations for the glowing effects
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(124, 58, 237, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.6), 0 0 40px rgba(6, 182, 212, 0.2)" },
        },
      },
    },
  },
  plugins: [],
};
