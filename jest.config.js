module.exports = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text'],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  testEnvironment: 'node',  
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ]
};
