import * as AWS from 'aws-sdk';
import { arg } from '@nexus/schema';

import { File } from '../File';
import { id } from '../../../../utils';
import { sanitizeFileName } from '../../../../utils/files/files';
import { MutationFieldType } from '../../types';

const UPLOAD_BUCKET_NAME = process.env.AWS_BUCKET_UPLOAD || '';

if (process.env.ENV === 'local') {
  // AWS.config.update({
  //   signatureVersion: 'v4',
  //   region: process.env.AWS_REGION,
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   s3BucketEndpoint: false,
  //   //@ts-ignore
  //   endpoint: 'https://s3.amazonaws.com',
  // });
} else {
  AWS.config.update({
    signatureVersion: 'v4',
    region: process.env.AWS_REGION,
  });
}

const s3 = new AWS.S3();

export const singleUpload: MutationFieldType<'singleUpload'> = {
  type: File,

  args: {
    file: arg({ type: 'Upload', required: true }),
  },

  // @ts-ignore
  resolve: async (_parent, { file }, _context, _info) => {
    const { filename, mimetype, encoding, createReadStream } = (await file) as FileUpload;
    const sanitizedFilename = sanitizeFileName(filename);

    const uuid = id();
    const stream = createReadStream();
    const resource = `${uuid}/${sanitizedFilename}`;

    const params = {
      Bucket: UPLOAD_BUCKET_NAME,
      Key: resource,
      Body: stream,
      ContentType: mimetype,
    };

    try {
      await s3.upload(params).promise();
      console.log(`File uploaded under ${resource}`);
    } catch (error) {
      console.error(error);
    }

    return {
      id: uuid,
      filename,
      mimetype,
      encoding,
      resource,
    };
  },
};
interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  size?: number;
  createReadStream: () => any;
}

const validMimetypes: Map<string, string> = new Map([
  ['image/jpg', 'JPEG'],
  ['image/jpeg', 'JPEG'],
  ['image/png', 'PNG'],
  ['image/tiff', 'TIFF'],
  ['application/pdf', 'PDF'],
]);
