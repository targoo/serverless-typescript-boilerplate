// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  console.log('event', event);
  const {
    pathParameters: { relation = '' } = {},
    requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {},
  } = event;

  const id = cognitoAuthenticationProvider.split(':').pop();

  const key = {
    id,
    relation,
  };

  const { Item = {} } = await dynamo.getItem(key);

  const response = successResponse(Item);

  callback(null, response);
};
