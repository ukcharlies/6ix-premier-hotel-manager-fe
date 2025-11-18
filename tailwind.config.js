/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6ff',
          100: '#f8ecff',
          200: '#ecd1ff',
          300: '#d3a8ff',
          400: '#b67cff',
          500: '#8f4cff',
          600: '#6b2bd6',
          700: '#4b1aa8',
          800: '#33107a',
          900: '#1d0547'
        },
        accent: {
          50: '#fff8f6',
          100: '#fff1ef',
          200: '#ffd7ce',
          300: '#ffb49a',
          400: '#ff8a63',
          500: '#ff6b3e',
          600: '#e85a30',
          700: '#b74324',
          800: '#7f2f19',
          900: '#4f1b10'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      }
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: 'class',
};
