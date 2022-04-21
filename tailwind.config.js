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
        'blue-france-main-525': {
          base: '#6a6af4',
        },
        'red-marianne-main-472': {
          base: '#e1000f',
          hover: '#ff292f',
          active: '#ff4347',
        },
        'red-marianne-425': {
          base: '#c9191e',
          hover: '#f93f42',
          active: '#f95a5c',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
}
