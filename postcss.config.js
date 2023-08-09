const postCssImport = require('postcss-import');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    postCssImport(),
    purgecss({
      content: [
        './src/views/**/*.tsx',
        './src/views/**/*.html',
        './src/views/index.html.ts',
        // './keycloak/themes/potentiel/login/template.ftl',
      ],
    }),
  ],
};
