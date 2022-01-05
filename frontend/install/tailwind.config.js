module.exports = {
  purge: ['./src/*{.js}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        crypdit_dark: {
          DEFAULT: '#030303',
          search_form:'#1a1a1a',
          search_text: '#272738',
        },
        crypdit_border: {
          DEFAULT: '#343536',
        },
        crypdit_post:{
          form:'#1a1a1a',
          text: '#272738',
        },
        crypdit_text: {
          DEFAULT: 'rgb(215, 218, 220)',
          darker: '#818384',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}