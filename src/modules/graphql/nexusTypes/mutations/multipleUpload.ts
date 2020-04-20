import { arg, idArg } from 'nexus';

import { File } from '../File';
import { id } from '../../../../utils';
import { sanitizeFileName } from '../../../../utils/files/files';
import { IFile } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

const UPLOAD_BUCKET_NAME = process.env.AWS_BUCKET_UPLOAD || '';

export const multipleUpload = {
  type: File,

  args: {
    boardUuid: idArg(),
    files: arg({ type: 'Upload', required: true, list: true }),
  },

  resolve: async (_parent, { files, boardUuid }, { user, dynamo, s3 }) => {
    if (!user) {
      throw new Error('Not authorized to upload files');
    }

    const filesData = files as Promise<FileUpload>[];
    console.log('filesData', filesData);
    const result = await Promise.all(files.map((file) => uploadFile(file, user.userId, boardUuid, dynamo, s3)));
    console.log('result', result);
    return result;
  },
};

const uploadFile = async (file, userId, boardUuid, dynamo, s3) => {
  const { filename, mimetype, encoding, createReadStream } = await file;
  console.log('filename', filename);
  console.log('mimetype', mimetype);
  console.log('encoding', encoding);
  console.log('createReadStream', createReadStream);
  const sanitizedFilename = sanitizeFileName(filename);

  const uuid = id();
  const stream = createReadStream();
  const resource = `${uuid}/${sanitizedFilename}`;
  let sanitizedMimetype;
  switch (mimetype) {
    case 'application/pdf':
      sanitizedMimetype = 'PDF';
      break;
    default:
      sanitizedMimetype = 'FILE';
      break;
  }

  const params = {
    Bucket: UPLOAD_BUCKET_NAME,
    Key: resource,
    Body: stream,
    ContentType: mimetype,
  };

  try {
    await s3.upload(params);
    logger.debug(`File uploaded under ${resource}`);

    const file = ({
      id: `USER#${userId}`,
      relation: `FILE#BOARD#${boardUuid}#${uuid}`,
      resource: JSON.stringify({ format: 'string', value: resource }),
      filename: JSON.stringify({ format: 'string', value: sanitizedFilename }),
      mimetype: JSON.stringify({ format: 'string', value: sanitizedMimetype }),
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
