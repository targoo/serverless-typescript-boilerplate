import { createResponse } from '../../../src/utils/response';

describe('createResponse', () => {
  it('creates the response', () => {
    // Acts
    const result = createResponse(200, 'ok');
    // Assert
    expect(result).toEqual({
      body: '"ok"',
      headers: { 'Access-Control-Allow-Origin': '*' },
      statusCode: 200,
    });
  });
});
