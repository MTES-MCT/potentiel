module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/*.integration.(ts|js)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testEnvironment: 'node',
}
