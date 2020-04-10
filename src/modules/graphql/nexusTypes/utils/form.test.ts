import { prepareFormInput, prepareResponseDate } from './form';

describe('prepareFormInput', () => {
  it('should return the right format', async () => {
    // Arrange
    const formProperties = {
      title: 'string',
      createAt: 'datetime',
      available: 'date',
      isSelected: 'boolean',
      location: 'string',
    };
    const data = {
      title: 'title',
      title2: 'title2',
      createAt: new Date('2010-01-01T00:00:00.000Z'),
      available: new Date('2010-01- 01'),
      isSelected: false,
    };
    const expected = {
      title: '{"format":"string","value":"title"}',
      createAt: '{"format":"datetime","value":"2010-01-01T00:00:00.000Z"}',
      available: '{"format":"date","value":"2010-01-01T00:00:00.000Z"}',
      isSelected: '{"format":"boolean","value":false}',
    };

    // Act
    const result = prepareFormInput(data, formProperties);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe('prepareResponseDate', () => {
  it('should return the right format', async () => {
    // Arrange
    const data = {
      title: '{"format":"string","value":"title"}',
      createAt: '{"format":"datetime","value":"2010-01-01T00:00:00.000Z"}',
      available: '{"format":"date","value":"2010-01-01T00:00:00.000Z"}',
      isSelected: '{"format":"boolean","value":false}',
    };
    const expected = {
      title: 'title',
      createAt: new Date('2010-01-01T00:00:00.000Z'),
      available: new Date('2010-01-01T00:00:00.000Z'),
      isSelected: false,
    };

    // Act
    const result = prepareResponseDate(data);

    // Assert
    expect(result).toEqual(expected);
  });
});
