import { successResponse, errorResponse } from '../../../src/utils';

describe('createResponse', () => {
  it('creates a successful response', () => {
    // Acts
    const result = successResponse('ok');
    // Assert
    expect(result).toEqual({
      body: '"ok"',
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true },
      statusCode: 200,
    });
  });
  it('creates an unsuccessful response', () => {
    // Acts
    const result = errorResponse('notok');
    // Assert
    expect(result).toEqual({
      body: '"notok"',
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true },
      statusCode: 500,
    });
  });
});
