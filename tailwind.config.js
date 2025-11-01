/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          sepia: '#704214',
          cream: '#F4E8D0',
          gold: '#D4AF37',
          darkBrown: '#3E2723',
          oldPaper: '#E8DCC4',
          rust: '#8B4513',
        },
      },
      fontFamily: {
        vintage: ['Georgia', 'Times New Roman', 'serif'],
        deco: ['Courier New', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 4s infinite',
        'fade-in': 'fadeIn 2s ease-in',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '10%': { opacity: '0.95' },
          '20%': { opacity: '1' },
          '30%': { opacity: '0.97' },
          '40%': { opacity: '1' },
          '50%': { opacity: '0.96' },
          '60%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
    },
  },
  plugins: [],
}
