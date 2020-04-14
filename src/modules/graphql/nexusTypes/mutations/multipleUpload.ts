import * as AWS from 'aws-sdk';
import { arg, idArg } from 'nexus';

import { File } from '../File';
import { id } from '../../../../utils';
import { sanitizeFileName } from '../../../../utils/files/files';
import { IFile } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

const UPLOAD_BUCKET_NAME = process.env.AWS_BUCKET_UPLOAD || '';

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

const s3 = new AWS.S3();

export const multipleUpload = {
  type: File,

  args: {
    boardUuid: idArg(),
    files: arg({ type: 'Upload', required: true, list: true }),
  },

  resolve: async (_parent, { files, boardUuid }, { userId = 'unknown', dynamo }) => {
    const filesData = files as Promise<FileUpload>[];
    console.log('filesData', filesData);
    const result = await Promise.all(files.map((file) => uploadFile(file, userId, boardUuid, dynamo)));
    console.log('result', result);
    return result;
  },
};

const uploadFile = async (file, userId, boardUuid, dynamo) => {
  const { filename, mimetype, encoding, createReadStream } = await file;
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
    logger.debug(`File uploaded under ${resource}`);

    const file = ({
      id: `USER#${userId}`,
      relation: `FILE#BOARD#${boardUuid}#${uuid}`,
      resource: JSON.stringify({ format: 'string', value: resource }),
      filename: JSON.stringify({ format: 'string', value: sanitizedFilename }),
      mimetype: JSON.stringify({ format: 'string', value: mimetype }),
      encoding: JSON.stringify({ format: 'string', value: encoding }),
      uuid: JSON.stringify({ format: 'string', value: uuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
    } as unknown) as IFile;

    logger.debug(JSON.stringify(file));
    await dynamo.saveItem(file);

    return prepareResponseDate(file);
  } catch (error) {
    logger.error(error);
  }
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
