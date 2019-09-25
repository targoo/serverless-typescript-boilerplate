// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import { successResponse } from '../../utils/lambda-response';

export const handler: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const { requestContext: { identity: { cognitoIdentityId = '' } = {} } = {} } = event;
  console.log('event', event);
  console.log('cognitoIdentityId', cognitoIdentityId);

  // fetch(event.image_url)
  //   .then(response => {
  //     if (response.ok) {
  //       return response;
  //     }
  //     return Promise.reject(new Error(`Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
  //   })
  //   .then(response => response.buffer())
  //   .then(buffer =>
  //     s3
  //       .putObject({
  //         Bucket: process.env.BUCKET,
  //         Key: event.key,
  //         Body: buffer,
  //       })
  //       .promise(),
  //   )
  //   .then(v => callback(null, v), callback);

  const response = successResponse({
    result: 'result',
  });

  callback(null, response);
};

// 'use strict';

// const fetch = require('node-fetch');
// const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

// const s3 = new AWS.S3();

// module.exports.save = (event, context, callback) => {
//   fetch(event.image_url)
//     .then(response => {
//       if (response.ok) {
//         return response;
//       }
//       return Promise.reject(new Error(`Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
//     })
//     .then(response => response.buffer())
//     .then(buffer =>
//       s3
//         .putObject({
//           Bucket: process.env.BUCKET,
//           Key: event.key,
//           Body: buffer,
//         })
//         .promise(),
//     )
//     .then(v => callback(null, v), callback);
// };
