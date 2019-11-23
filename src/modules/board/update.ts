// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  console.log('event', event);
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

  const {
    pathParameters: { relation = '' } = {},
    body = '',
    requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {},
  } = event;

  const id = cognitoAuthenticationProvider.split(':').pop();
  const { title } = JSON.parse(body);

  const key = {
    id,
    relation,
  };
  console.log('key', key);

  const params = {
    UpdateExpression: 'set #title = :title, #updated = :updated',
    ExpressionAttributeNames: { '#title': 'title', '#updated': 'updated' },
    ExpressionAttributeValues: {
      ':title': title,
      ':updated': new Date().getTime(),
    },
  };

  const { Attributes } = await dynamo.updateItem(params, key, DYNAMO_TABLE);

  const response = successResponse(Attributes);

  callback(null, response);
};
