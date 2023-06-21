module.exports = {
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
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
  setupFiles: ['./jest.integration.env.ts'],
  setupFilesAfterEnv: ['./jest.unit.setup.ts'],
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1/index.ts',
    '^@core/(.*)$': '<rootDir>/src/core/$1/index.ts',
    '^@entities$': '<rootDir>/src/entities/index.ts',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1.ts',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1/index.ts',
    '^@useCases$': '<rootDir>/src/useCases/index.ts',
    '^@views$': '<rootDir>/src/views/index.ts',
    '^@views/(.*)$': '<rootDir>/src/views/$1/index.ts',
    '^@config$': '<rootDir>/src/config/index.ts',
    '^@config/(.*)$': '<rootDir>/src/config/$1.ts',
    '^@dataAccess$': '<rootDir>/src/dataAccess/index.ts',
    '^@dataAccess/(.*)$': '<rootDir>/src/dataAccess/$1/index.ts',
    '^@routes$': '<rootDir>/src/routes.ts',
    '^@components$': '<rootDir>/src/views/components/index.ts',
  },
};
