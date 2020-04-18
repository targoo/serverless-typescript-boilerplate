import { objectType } from 'nexus';
import * as AWS from 'aws-sdk';

import { MimeType } from './enums';

export const fileFormProperties = {
  filename: 'string',
  mimetype: 'string',
  encoding: 'date',
  resource: 'string',
};

export const fileProperties = {
  ...fileFormProperties,
  id: 'key',
  relation: 'key',
  uuid: 'string',
  temporaryUrl: 'string',
  isDeleted: true,
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

const UPLOAD_BUCKET_NAME = process.env.AWS_BUCKET_UPLOAD || '';
const s3 = new AWS.S3();

if (process.env.ENV === 'local') {
  AWS.config.update({
    signatureVersion: 'v4',
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketEndpoint: false,
    //@ts-ignore
    endpoint: 'https://s3.amazonaws.com',
  });
} else {
  AWS.config.update({
    signatureVersion: 'v4',
    region: process.env.AWS_REGION,
  });
}

export const File = objectType({
  name: 'File',
  definition(t) {
    t.id('uuid', { description: 'UUID of the job' });

    t.string('temporaryUrl', async ({ resource }) => {
      return await s3.getSignedUrl('getObject', {
        Bucket: UPLOAD_BUCKET_NAME,
        Key: resource,
        Expires: 3600,
      });
    });

    t.string('filename');

    t.field('mimetype', { type: MimeType });

    t.string('encoding');

    t.string('resource');

    t.boolean('isDeleted');

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });
  },
});
