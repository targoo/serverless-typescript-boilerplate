import { arg } from 'nexus';

import { File } from '../File';

// https://Unexpected number in JSON at position 1 at JSON.parsesirmuel.design/working-with-file-uploads-using-altair-graphql-d2f86dc8261f
// https://github.com/apollographql/apollo-server/pull/3676/files

// import * as uuid from 'uuid/v4';
// import * as crypto from 'crypto';
// import * as AWS from 'aws-sdk';

// import { GraphQLContext } from '../../types';
// import PublicError from '../../lib/PublicError';
// import { ErrorCode } from '../../types';

// @todo create uploadFiles
// @todo create renameFile?
// @todo create deleteFile?

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  size: number;
  createReadStream: () => any;
}

export const uploadFile = {
  type: File,
  args: {
    file: arg({ type: 'Upload', required: true }),
  },
  resolve: async (_parent, { file }, _context, _info) => {
    // Validation
    const { filename, mimetype, encoding, createReadStream } = (await file) as FileUpload;

    console.log('filename', filename);
    console.log('mimetype', mimetype);
    console.log('encoding', encoding);

    return {
      id: 'id',
      filename: 'filename',
      mimetype: 'mimetype',
      encoding: 'encoding',
    };
    // const { filename, mimetype, encoding, size, createReadStream } = await file;
    // console.log('filename', filename);
    // console.log('mimetype', mimetype);
    // console.log('encoding', encoding);
    // console.log('size', size);
    // console.log('createReadStream', createReadStream);
    // console.log('process.env.DIGITAL_UPLOAD_BUCKET_NAME', process.env.DIGITAL_UPLOAD_BUCKET_NAME);
    // const AWS_S3_BUCKET_NAME = 'test-upload';
    // const s3 = new AWS.S3();
    // if (process.env.ENVIRONMENT === 'local') {
    //   AWS.config.update({
    //     signatureVersion: 'v4',
    //     region: 'eu-west-1',
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   });
    // } else {
    //   AWS.config.update({
    //     signatureVersion: 'v4',
    //     region: 'eu-west-1',
    //   });
    // }
    // const stream = createReadStream();
    // const params = {
    //   Bucket: AWS_S3_BUCKET_NAME,
    //   Key: `${uuid({ random: crypto.randomBytes(16) })}/${filename}`,
    //   Body: stream,
    //   ContentType: mimetype,
    // };
    // console.log(params);
    // try {
    //   const result = await s3.upload(params).promise();
    // } catch (error) {
    //   console.log(error);
    // }
    // Validation
    // @todo map/check file mimetype
    // @todo check file size?
    // return prisma.createFile({
    //   filename,
    //   mimetype: 'PLAIN_TEXT',
    //   encoding,
    //   // 16 byte crypto token as a uuid
    //   resource: `${uuid({ random: crypto.randomBytes(16) })}`,
    //   scanStatus: 'PENDING',
    //   uploadedBy: { connect: { userId: auth.userId } },
    // });
  },
};

// const uploadFile2 = async file => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Read content from the file
//       // const { filename, mimetype, createReadStream } = await file
//       const { stream, filename, mimetype } = await file;

//       const Body = stream;
//       const Key = uuid() + path.extname(filename);
//       const params = {
//         Bucket, // const defined above
//         Key, // File name you want to save as in S3
//         Body,
//         ContentType: mimetype,
//       };

//       // Uploading files to the bucket
//       s3.upload(params, function(err, data) {
//         if (err) {
//           console.log('s3 upload error');
//           throw err;
//         }
//         console.log(`File uploaded to s3 successfully. ${data.Location}`);
//         resolve(true);
//       });
//     } catch (e) {
//       console.log('UPLOAD ERROR: ', e);
//       reject(e);
//     }
//   });
// };
