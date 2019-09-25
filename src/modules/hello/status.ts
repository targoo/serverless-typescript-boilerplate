// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  const response = successResponse({
    message: {
      message: 'Go Serverless v2.0! Your function executed successfully',
      input: event,
    },
  });

  callback(null, response);
};
