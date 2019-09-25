// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

// curl -X GET -H 'Content-Type:application/json' 'http://localhost:3000/board/7c2b82d1-8468-4af7-860d-c49bc621d922'

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
  const { requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();
  const { pathParameters: { id = '' } = {} } = event;

  const key = {
    id: userId,
    relation: `board-${id}`,
  };

  const { Item } = await dynamo.getItem(key, DYNAMO_TABLE);

  const response = successResponse(Item);

  callback(null, response);
};
