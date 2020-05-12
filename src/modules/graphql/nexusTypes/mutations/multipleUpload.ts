import { arg, idArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { File } from '../File';
import { id } from '../../../../utils';
import { sanitizeFileName } from '../../../../utils/files/files';
import logger from '../../../../utils/logger';
import { FileUtils } from '../../utility/fileFactory';
import { NexusGenRootTypes } from '../../generated/nexus';

const UPLOAD_BUCKET_NAME = process.env.AWS_BUCKET_UPLOAD || '';

export const multipleUpload: MutationFieldType<'multipleUpload'> = {
  type: File,

  args: {
    boardUuid: idArg(),
    jobUuid: idArg(),
    files: arg({ type: 'Upload', required: true, list: true }),
  },

  // @ts-ignore
  resolve: async (_parent, { files, boardUuid, jobUuid }, { user, s3, utils: { filefactory } }) => {
    if (!user) {
      logger.error('Not authorized to upload files');
      throw new Error('Not authorized to upload files');
    }

    const filesData = files as Promise<FileUpload>[];
    const result = await Promise.all(
      filesData.map((file) => uploadFile(user.uuid, boardUuid, jobUuid, file, s3, filefactory)),
    );

    return result;
  },
};

const uploadFile = async (
  userUuid: string,
  boardUuid: string,
  jobUuid: string,
  file: Promise<FileUpload>,
  s3: any,
  filefactory: FileUtils,
): Promise<NexusGenRootTypes['File'] | void> => {
  const { filename, mimetype, encoding, createReadStream } = await file;
  const fileUuid = id();

  const sanitizedFilename = sanitizeFileName(filename);
  const resource = jobUuid
    ? `${userUuid}/${boardUuid}/${jobUuid}/${fileUuid}/${sanitizedFilename}`
    : `${userUuid}/${boardUuid}/${fileUuid}/${sanitizedFilename}`;

  let sanitizedMimetype;
  switch (mimetype) {
    case 'application/pdf':
      sanitizedMimetype = 'PDF';
      break;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
    case 'application/vnd.ms-word.document.macroEnabled.12':
    case 'application/vnd.ms-word.template.macroEnabled.12':
      sanitizedMimetype = 'DOC';
      break;
    default:
      sanitizedMimetype = 'FILE';
      break;
  }

  const params = {
    Bucket: UPLOAD_BUCKET_NAME,
    Key: resource,
    Body: createReadStream(),
    ContentType: mimetype,
  };

  const item: Partial<NexusGenRootTypes['File']> = {
    filename: sanitizedFilename,
    mimetype: sanitizedMimetype,
    encoding,
    resource,
  };

  try {
    await s3.upload(params);
    return await filefactory.boardCreate(userUuid, boardUuid, fileUuid, item);
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
