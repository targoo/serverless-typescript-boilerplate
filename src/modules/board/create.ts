import { v4 } from 'uuid';
// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import { Board, BoardStatus } from '../../types';
import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const { body = '', requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();
  const { title = '' } = JSON.parse(body);
  const uuid: string = v4();

  const board: Board = {
    id: userId,
    relation: `board-${uuid}`,
    created: new Date().getTime(),
    uuid,
    title,
    status: BoardStatus.ACTIVE,
  };

  await dynamo.saveItem(board);

  const response = successResponse(board);

  callback(null, response);
};
