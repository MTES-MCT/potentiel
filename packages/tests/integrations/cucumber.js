module.exports = {
  default:
    'src/**/*.feature --require dist/**/*.js --language fr --publish-quiet --format @cucumber/pretty-formatter',
  ci: 'src/**/*.feature --require dist/**/*.js --language fr --publish',
};
