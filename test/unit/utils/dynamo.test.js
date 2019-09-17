import dynamo from '../../../src/utils/dynamo';

describe('dynamodb library signature', () => {
  it('should have a saveItem() method', () => {
    expect(typeof dynamo).toBe('object');
    expect(dynamo).toHaveProperty('saveItem');
    expect(typeof dynamo.saveItem).toBe('function');
  });

  it('should have a getItem() method', () => {
    expect(typeof dynamo).toBe('object');
    expect(dynamo).toHaveProperty('getItem');
    expect(typeof dynamo.getItem).toBe('function');
  });

  it('should have a removeItem() method', () => {
    expect(typeof dynamo).toBe('object');
    expect(dynamo).toHaveProperty('removeItem');
    expect(typeof dynamo.removeItem).toBe('function');
  });

  it('should have a updateItem() method', () => {
    expect(typeof dynamo).toBe('object');
    expect(dynamo).toHaveProperty('updateItem');
    expect(typeof dynamo.updateItem).toBe('function');
  });
});
