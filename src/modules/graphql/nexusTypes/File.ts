import { objectType } from 'nexus';

import { MimeType } from './enums';

const UPLOAD_BUCKET_NAME = process.env.AWS_BUCKET_UPLOAD || '';

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

export const File = objectType({
  name: 'File',
  definition(t) {
    t.id('uuid', { description: 'UUID of the job' });

    t.string('temporaryUrl', async ({ resource }, _args, { s3 }) => {
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
