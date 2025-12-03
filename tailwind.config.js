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
        // Custom 6ix Premier Color Palette
        premier: {
          // Light backgrounds & subtle elements
          'light': '#DAE1E1',      // Lightest gray
          'gray': '#C4D1D5',       // Light blue-gray
          // Primary accent - Warm copper/brown
          'copper': '#A47550',     // Warm brown accent
          // Dark elements
          'dark': '#1B2E34',       // Dark blue-gray
          'black': '#151515',      // Almost black
        },
        // Semantic color mappings for easy use
        primary: {
          50: '#f0f4f5',
          100: '#DAE1E1',
          200: '#C4D1D5',
          300: '#a8b9bf',
          400: '#8ca1a9',
          500: '#A47550',  // Copper as primary
          600: '#8d6244',
          700: '#6f4e36',
          800: '#523929',
          900: '#1B2E34',
        },
        dark: {
          50: '#e8eaeb',
          100: '#C4D1D5',
          200: '#9aa8ae',
          300: '#6f7f87',
          400: '#455660',
          500: '#1B2E34',  // Main dark
          600: '#17262d',
          700: '#121e23',
          800: '#0e161a',
          900: '#151515',  // Darkest
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
