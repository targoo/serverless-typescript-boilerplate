module.exports = {
  roots: ['<rootDir>/test/unit'],
  testRegex: '(.*\\.test\\.(jsx?|tsx?))$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
