export default {
  clearMocks: true,
  coverageProvider: 'v8',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'jsdom'
};
