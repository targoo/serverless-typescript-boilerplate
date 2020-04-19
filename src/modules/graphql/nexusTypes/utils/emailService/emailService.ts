import { SES, AWSError } from 'aws-sdk';
import { SendEmailRequest, SendEmailResponse } from 'aws-sdk/clients/ses';
import { TAddresses, ISendTemplatedEmailOptions } from './emailService.types';

const SOURCE_EMAIL: string = process.env.SES_SOURCE_EMAIL;
const REGION: string = process.env.AWS_REGION;
const ses = new SES({ region: REGION });

export function sendRawEmail(to: TAddresses, subject: string, content: string, options?: ISendTemplatedEmailOptions) {
  console.log(`send-raw-email ${to}`);
  return sendEmail(to, subject, content, options);
}

// Composes an email message using an email template and immediately queues it for sending.
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
  return ses.sendEmail(sesParams).promise();
}
