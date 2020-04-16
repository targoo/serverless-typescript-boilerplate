export function prepareFormInput(myObj: any, formProperties: any) {
  const validKeys: string[] = Object.keys(formProperties);

  return Object.keys(myObj)
    .filter((key) => validKeys.includes(key))
    .reduce((result, key) => {
      const currentObject = myObj[key];
      switch (formProperties[key]) {
        case 'date':
          result[key] = JSON.stringify({
            format: 'date',
            value: currentObject ? currentObject.toISOString() : null,
          });
          break;
        case 'datetime':
          result[key] = JSON.stringify({
            format: 'datetime',
            value: currentObject ? currentObject.toISOString() : null,
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
          result[key] = value ? new Date(value) : null;
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
