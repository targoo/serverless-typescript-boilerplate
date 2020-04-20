import { S3 } from 'aws-sdk';

import logger from './logger';

const UPLOAD_BUCKET_NAME = process.env.AWS_BUCKET_UPLOAD || '';

const localConfig = {
  signatureVersion: 'v4',
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3BucketEndpoint: false,
  //@ts-ignore
  endpoint: 'https://s3.amazonaws.com',
};

const AWSConfig = {
  signatureVersion: 'v4',
  region: process.env.AWS_REGION,
};

const s3Config = process.env.ENV === 'local' ? localConfig : AWSConfig;

const s3Client = new S3(s3Config);

const client = {
  upload: (params: any) => {
    return s3Client.upload(params).promise();
  },

  getSignedUrl: (operation, params) =>
    new Promise((resolve, reject) => {
      s3Client.getSignedUrl(operation, params, (err, url) => {
        err ? reject(err) : resolve(url);
      });
    }),
};

export default client;
