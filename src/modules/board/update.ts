// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

// curl -X PUT -H 'Content-Type:application/json' 'http://localhost:3000/board/3d6f5084-d2ca-458b-9ca2-f69f17560966' --data '{ "text": "Learn Serverless" }'

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
  console.log('title', title);

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
  console.log('params', params);

  const { Attributes } = await dynamo.updateItem(params, key, DYNAMO_TABLE);
  console.log('Attributes', Attributes);

  const response = successResponse(Attributes);

  callback(null, response);
};
