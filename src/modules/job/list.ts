// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

// curl -X GET -H 'Content-Type:application/json' 'http://localhost:3000/board'

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  console.log('event', event);
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
  const {
    pathParameters: { relation = '' } = {},
    requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {},
  } = event;
  console.log('relation', relation);

  const userId = cognitoAuthenticationProvider.split(':').pop();
  console.log('userId', userId);

  const params = {
    KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#relation': 'relation',
    },
    ExpressionAttributeValues: {
      ':userUUID': userId,
      ':relation': `job-${relation}-`,
    },
  };
  console.log('params', params);

  const { Items = [] } = await dynamo.query(params, DYNAMO_TABLE);

  const response = successResponse({
    items: Items,
  });

  callback(null, response);
};
