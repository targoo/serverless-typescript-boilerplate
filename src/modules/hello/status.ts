// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import { successResponse } from '../../utils';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const test = 1;
  const t = 1;
  const response = successResponse({
    message: {
      message: 'Go Serverless v2.0! Your function executed successfully!',
      input: event,
    },
  });

  callback(null, response);
};
