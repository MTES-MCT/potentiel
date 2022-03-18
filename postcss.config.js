const postCssImport = require('postcss-import')
const postCssPrefixSelector = require('postcss-prefix-selector')
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    postCssImport(),
    process.env.NODE_ENV === 'production' &&
      purgecss({
        content: [
          './src/views/**/*.tsx',
          './src/views/**/*.html',
          './src/views/index.html.ts',
          // './keycloak/themes/potentiel/login/template.ftl',
        ],
      }),
    postCssPrefixSelector({
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
    }),
  ],
}
