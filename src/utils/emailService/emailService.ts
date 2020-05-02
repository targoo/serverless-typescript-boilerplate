import { SES, AWSError } from 'aws-sdk';
import { SendEmailRequest, SendEmailResponse } from 'aws-sdk/clients/ses';

import { TAddresses, ISendTemplatedEmailOptions, EmailService } from './emailService.types';
import logger from '../logger';
import { inviteUserOnBoard } from './templates/inviteUserOnBoard';
import { inviteUserOnJob } from './templates/inviteUserOnJob';

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
  const replyTo =
    options && options.replyTo ? (Array.isArray(options.replyTo) ? options.replyTo : [options.replyTo]) : undefined;

  const sesParams: SendEmailRequest = {
    Source: (options && options.source) || SOURCE_EMAIL,
    ReplyToAddresses: replyTo,
    Message: {
      Body: {
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

export const emailService: EmailService = {
  sendRawEmail: (to, subject, content, options) => {
    logger.info(`send-raw-email ${to}`);
    return sendEmail(to, subject, content, options);
  },
  sendTemplateEmail: (to, subject, template, data, options) => {
    let content = '';
    switch (template) {
      case 'INVITE_BOARD_AGENT':
        content = inviteUserOnBoard(data);
        break;
      case 'INVITE_JOB_AGENT':
        content = inviteUserOnJob(data);
        break;
    }
    return sendEmail(to, subject, content, options);
  },
};
