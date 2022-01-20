const unitTestsConfig = require('./jest.unit.config')

module.exports = {
  ...unitTestsConfig,
  testMatch: ['**/*.integration.(ts|js)'],
}
