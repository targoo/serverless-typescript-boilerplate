const AWS = require('aws-sdk');
const { getFromSSM } = require('../../../src/utils/ssm');

describe('getFromSSM', () => {
  beforeEach(() => {
    const ssmGetParameterPromise = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Parameter: {
          Name: 'NAME',
          Type: 'SecureString',
          Value: 'VALUE',
          Version: 1,
          LastModifiedDate: 1546551668.495,
          ARN: 'arn:aws:ssm:ap-southeast-2:123:NAME',
        },
      }),
    });

    AWS.SSM = jest.fn().mockImplementation(() => ({
      getParameter: ssmGetParameterPromise,
    }));
  });

  it('should decrypt string from ssm', async () => {
    // Arrange
    const data = await getFromSSM('NAME');
    // Assert
    expect.assertions(1);
    expect(data).toBe('VALUE');
  });
});
