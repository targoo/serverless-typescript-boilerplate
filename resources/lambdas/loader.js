module.exports = () => {
  const fs = require('fs');
  const path = require('path');
  const YAML = require('yamljs');

  const currentPath = path.resolve(__dirname);
  const files = fs.readdirSync(currentPath);

  const merged = files
    .filter(f => f.endsWith('yml'))
    .map(f => {
      return fs.readFileSync(`${currentPath}/${f}`, 'utf8');
    })
    .map(raw => YAML.parse(raw))
    .reduce((result, handler) => Object.assign(result, handler), {});

  return merged;
};
