// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
  const { requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();

  const params = {
    KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#relation': 'relation',
    },
    ExpressionAttributeValues: {
      ':userUUID': userId,
      ':relation': 'board-',
    },
  };

  const { Items = [] } = await dynamo.query(params, DYNAMO_TABLE);

  const response = successResponse({
    items: Items,
  });

  callback(null, response);
};
