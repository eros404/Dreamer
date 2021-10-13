const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      'lightred': '#E60000',
      'red': '#B30000',
      'green': '#2A9D8F',
      'darkgreen': '#1E6E64',
      'navy': '#17050F',
      'yellow': '#f3a712',
      'blue': '#004FFF'
    },
    fontFamily: {
      'open': ['"Open Sans"', '"Clear Sans"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      'mono': ['ui-monospace', 'SFMono-Regular', 'Consolas']
    },
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
      '1': '1rem',
      '1.75': '1.75rem',
      '2': '2rem'
     },
    extend: {
      fontSize: {
        h1: ['2.25em', '1.2'],
        h2: ['1.75em', '1.225'],
        h3: ['1.5em', '1.43'],
        h4: '1.25em',
        h5: '1em',
        h6: '1em'
    }},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
