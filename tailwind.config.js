/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1E40AF',
        },
        accent: {
          green: '#16A34A',
        },
        alert: {
          red: '#DC2626',
        },
        warning: {
          yellow: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}
