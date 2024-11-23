/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./views/**/*.{html,ejs,js}",
    "./public/**/*.{html,ejs,js}",
  ],
  theme: {
    extend: {
      animation: {
        float: 'float 3.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      }
    },
    boxShadow: {
      'custom-cyan': '0 4px 6px #17C2EC',
    },
    plugins: [
      require('@tailwindcss/aspect-ratio'),
    ],
  }
}
