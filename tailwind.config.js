module.exports = {
  content: ['./src/views/**/*.tsx', './src/views/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'blue-france-sun': {
          base: '#000091',
          hover: '#1212ff',
          active: '#2323ff',
        },
        'blue-france-975': {
          base: '#f5f5fe',
          hover: '#dcdcfc',
          active: '#cbcbfa',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
}
