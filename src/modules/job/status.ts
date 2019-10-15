import { successResponse } from '../../utils/lambda-response';

export const handler = async (event, _context, callback) => {
  const { requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  // Cognito authentication provider looks like:
  // cognito-idp.eu-west-1.amazonaws.com/eu-west-1_hZKjWiSMb,cognito-idp.eu-west-1.amazonaws.com/eu-west-1_hZKjWiSMb:CognitoSignIn:8e978455-86f9-4a18-bcd4-e307115961ca
  // Where us-east-1_aaaaaaaaa is the User Pool id
  // And qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr is the User Pool User Id
  // https://serverless-stack.com/chapters/mapping-cognito-identity-id-and-user-pool-id.html
  const userId = cognitoAuthenticationProvider.split(':').pop();

  const identity = {
    userId,
  };

  const response = successResponse({ identity: identity });

  callback(null, response);
};
