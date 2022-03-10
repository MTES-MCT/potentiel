module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-prefix-selector': {
      prefix: '.only-dsfr',
      transform(prefix, selector, prefixedSelector, filepath) {
        if (selector.match(/^(html|body)/)) {
          return selector.replace(/^([^\s]*)/, `$1 ${prefix}`)
        }

        if (selector === ':root') {
          return selector
        }

        return prefixedSelector
      },
    },
  },
}
