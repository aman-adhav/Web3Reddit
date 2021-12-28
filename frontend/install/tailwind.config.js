module.exports = {
  purge: ['./src/*{.js}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        reddit_dark: {
          DEFAULT: '#030303',
          search_text: '#272738'
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}