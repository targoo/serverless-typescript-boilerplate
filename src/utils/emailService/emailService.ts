import { SES, AWSError } from 'aws-sdk';
import { SendEmailRequest, SendEmailResponse } from 'aws-sdk/clients/ses';

import { TAddresses, ISendTemplatedEmailOptions } from './emailService.types';
import logger from '../logger';

const localConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const AWSConfig = {
  region: process.env.AWS_REGION,
};

const sesConfig = process.env.ENV === 'local' ? localConfig : AWSConfig;

const SOURCE_EMAIL: string = process.env.SES_SOURCE_EMAIL;
const sesClient = new SES(sesConfig);

function sendEmail(
  to: TAddresses,
  subject: string,
  content: string,
  options?: ISendTemplatedEmailOptions,
): Promise<SendEmailResponse | AWSError> {
  const cc = options && options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined;
  const bcc = options && options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined;

  const sesParams: SendEmailRequest = {
    Source: (options && options.source) || SOURCE_EMAIL,
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: content,
        },
        Text: {
          Charset: 'UTF-8',
          Data: content,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
      BccAddresses: bcc,
      CcAddresses: cc,
    },
  };

  return sesClient.sendEmail(sesParams).promise();
}

export const emailService = {
  sendRawEmail: (to: TAddresses, subject: string, content: string, options?: ISendTemplatedEmailOptions) => {
    logger.info(`send-raw-email ${to}`);
    return sendEmail(to, subject, content, options);
  },
};
