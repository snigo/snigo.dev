module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  modulePathIgnorePatterns: ['pkg/'],
  moduleNameMapper: {
    '^@snigo.dev/(.*)$': '<rootDir>/packages/$1/src',
  },
  roots: [
    '<rootDir>/packages',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
