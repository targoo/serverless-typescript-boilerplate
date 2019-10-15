// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

// curl -X GET -H 'Content-Type:application/json' 'http://localhost:3000/board/7c2b82d1-8468-4af7-860d-c49bc621d922'

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  console.log('event', event);
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
  const {
    pathParameters: { relation = '' } = {},
    requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {},
  } = event;

  const id = cognitoAuthenticationProvider.split(':').pop();

  const key = {
    id,
    relation,
  };
  console.log('key', key);

  const { Item = {} } = await dynamo.getItem(key, DYNAMO_TABLE);
  console.log('Item', Item);

  const response = successResponse(Item);

  callback(null, response);
};
