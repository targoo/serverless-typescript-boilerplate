module.exports = {
  roots: ['<rootDir>/test/integration'],
  testRegex: '(.*\\.test\\.(jsx?|tsx?))$',
  transform: {
    '^.+\\.(jsx?|tsx?)?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
