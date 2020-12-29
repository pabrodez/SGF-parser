module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ]
};
