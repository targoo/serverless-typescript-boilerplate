import { v4 } from 'uuid';
// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

// curl -X POST -H 'Content-Type:application/json' 'http://localhost:3000/board' --data '{ "text": "test1" }'

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
  const { body = '', requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();
  const { text = 'text' } = JSON.parse(body);
  const uuid = v4();

  const board = {
    id: userId,
    relation: `board-${uuid}`,
    created: new Date().getTime(),
    uuid,
    text,
  };

  await dynamo.saveItem(board, DYNAMO_TABLE);

  const response = successResponse(board);

  callback(null, response);
};
