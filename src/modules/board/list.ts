// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const { requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;
  const userId = cognitoAuthenticationProvider.split(':').pop();
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

  const params = {
    TableName: DYNAMO_TABLE,
    KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
    ExpressionAttributeNames: {
      '#uuid': 'uuid',
      '#title': 'title',
      '#status': 'status',
      '#id': 'id',
      '#relation': 'relation',
    },
    ExpressionAttributeValues: {
      ':userUUID': userId,
      ':relation': 'board-',
    },
    ProjectionExpression: ['#title', '#uuid', '#status'],
  };

  const { Items = [] } = await dynamo.query(params);

  const response = successResponse({
    items: Items,
  });

  callback(null, response);
};
