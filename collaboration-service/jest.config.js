/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json', allowJs: true }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(y-protocols|yjs|lib0)/)",
  ],
};