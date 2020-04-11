export function prepareFormInput(myObj: any, formProperties: any) {
  const validKeys: string[] = Object.keys(formProperties);

  return Object.keys(myObj)
    .filter((key) => validKeys.includes(key))
    .reduce((result, key) => {
      const currentObject = myObj[key];
      console.log('key', key);
      console.log('currentObject', currentObject);
      console.log('formProperties[key]', formProperties[key]);
      switch (formProperties[key]) {
        case 'date':
          result[key] = JSON.stringify({
            format: 'date',
            value: currentObject.toISOString(),
          });
          break;
        case 'datetime':
          result[key] = JSON.stringify({
            format: 'datetime',
            value: currentObject.toISOString(),
          });
          break;
        case 'string':
          result[key] = JSON.stringify({
            format: 'string',
            value: currentObject,
          });
          break;
        case 'boolean':
          result[key] = JSON.stringify({
            format: 'boolean',
            value: currentObject,
          });
          break;
      }
      return result;
    }, {});
}

export function prepareResponseDate(myObj: any) {
  return Object.keys(myObj).reduce((result, key) => {
    try {
      const { format, value }: { format: string; value: string } = JSON.parse(myObj[key]);
      switch (format) {
        case 'date':
        case 'datetime':
          result[key] = new Date(value);
          break;
        case 'boolean':
          result[key] = Boolean(value);
          break;
        case 'string':
          result[key] = value;
          break;
        default:
          result[key] = null;
          break;
      }
    } catch (error) {
      result[key] = myObj[key];
    }
    return result;
  }, {});
}
