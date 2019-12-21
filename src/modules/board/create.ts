import { v4 } from 'uuid';
// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import { IBoard } from '../../types/types';
import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const { body = '', requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();
  const { title = '' } = JSON.parse(body);
  const uuid: string = v4();

  const board: IBoard = {
    id: userId,
    relation: `board-${uuid}`,
    createdAt: new Date(),
    uuid,
    title,
    isDeleted: true,
  };

  await dynamo.saveItem(board);

  const response = successResponse(board);

  callback(null, response);
};
