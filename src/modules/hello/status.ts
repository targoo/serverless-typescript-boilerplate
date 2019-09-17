// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import { createResponse } from '../../utils/response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const response = createResponse(200, {
    message: {
      message: 'Go Serverless v2.0! Your function executed successfully!',
      input: event,
    },
  });

  callback(null, response);
};
