module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/*.spec.(ts|js)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testEnvironment: 'jsdom'
}
