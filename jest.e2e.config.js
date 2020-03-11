module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  // preset: 'jest-puppeteer',
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/features/**/*.e2e.(ts|js)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  globalSetup: '<rootDir>/features/setup/setup.ts',
  globalTeardown: '<rootDir>/features/setup/teardown.js',
  testEnvironment: '<rootDir>/features/setup/puppeteer_environment.js',
  setupFilesAfterEnv: ['expect-puppeteer']
}
