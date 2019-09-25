// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import dynamo from '../../utils/dynamo';
import { successResponse } from '../../utils/lambda-response';

// curl -X PUT -H 'Content-Type:application/json' 'http://localhost:3000/board/3d6f5084-d2ca-458b-9ca2-f69f17560966' --data '{ "text": "Learn Serverless" }'

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  console.log('event', event);
  console.log('_context', _context);
  const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

  const {
    pathParameters: { id = '' } = {},
    body = '',
    requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {},
  } = event;

  const userId = cognitoAuthenticationProvider.split(':').pop();
  console.log('body', body);
  const { text } = JSON.parse(body);
  console.log('text', text);

  const key = {
    id: userId,
    relation: `board-${id}`,
  };

  const params = {
    UpdateExpression: 'set #text = :text, #updated = :updated',
    ExpressionAttributeNames: { '#text': 'text', '#updated': 'updated' },
    ExpressionAttributeValues: {
      ':text': text,
      ':updated': new Date().getTime(),
    },
  };

  const { Attributes } = await dynamo.updateItem(params, key, DYNAMO_TABLE);

  const response = successResponse(Attributes);

  callback(null, response);
};
