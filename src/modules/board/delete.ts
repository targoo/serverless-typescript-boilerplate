// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { createResponse } from '../../utils/response';

// curl -X DELETE -H 'Content-Type:application/json' 'http://localhost:3000/board/c2b88132-604b-4645-b506-9208d488dbee'

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
  const { requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();
  const { pathParameters: { id = '' } = {} } = event;

  const key = {
    id: userId,
    relation: `board-${id}`,
  };

  const { Attributes } = await dynamo.removeItem(key, DYNAMO_TABLE);

  const response = createResponse(200, Attributes);

  callback(null, response);
};
