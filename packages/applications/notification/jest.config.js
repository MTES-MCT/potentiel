module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  testMatch: ['**/*.spec.(ts|js)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testEnvironment: 'node',
  // setupFiles: ['./jest.env.ts'],
};
