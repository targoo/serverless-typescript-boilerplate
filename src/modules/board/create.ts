import { v4 } from 'uuid';
// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
  const { body = '', requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();
  const { title = '' } = JSON.parse(body);
  const uuid = v4();

  const board = {
    id: userId,
    relation: `board-${uuid}`,
    created: new Date().getTime(),
    uuid,
    title,
  };

  await dynamo.saveItem(board, DYNAMO_TABLE);

  const response = successResponse(board);

  callback(null, response);
};
