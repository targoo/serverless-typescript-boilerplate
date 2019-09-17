module.exports = {
  roots: ['<rootDir>/test/unit'],
  testRegex: '(.*\\.test\\.(jsx?|tsx?))$',
  transform: {
    '^.+\\.(jsx?|tsx?)?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
