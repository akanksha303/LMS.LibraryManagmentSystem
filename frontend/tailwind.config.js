/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          'royal-violet': '#7c3aed',     // Bright premium violet
          'deep-purple': '#2e0854',      // Deep purple for backgrounds / sidebar
          'light-lavender': '#f5f3ff',   // Soft background / card tint
          'lavender-border': '#e9d5ff',  // Soft border line
          'dark-text': '#1e1b4b',        // Dark grey-purple text
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(109, 40, 217, 0.05), 0 2px 10px -1px rgba(109, 40, 217, 0.03)',
        'premium': '0 10px 30px -5px rgba(109, 40, 217, 0.08), 0 4px 15px -2px rgba(109, 40, 217, 0.04)',
      }
    },
  },
  plugins: [],
}
