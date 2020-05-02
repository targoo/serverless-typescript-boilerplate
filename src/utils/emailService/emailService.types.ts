import { SES, AWSError } from 'aws-sdk';
import { SendEmailResponse } from 'aws-sdk/clients/ses';

import { NexusGenEnums } from '../../modules/graphql/generated/nexus';

export interface EmailService {
  sendRawEmail: (
    to: TAddresses,
    subject: string,
    content: string,
    options?: ISendTemplatedEmailOptions,
  ) => Promise<SendEmailResponse | AWSError>;
  sendTemplateEmail: (
    to: string,
    subject: string,
    template: NexusGenEnums['EmailTemplate'],
    params: any,
    options?: ISendTemplatedEmailOptions,
  ) => Promise<SendEmailResponse | AWSError>;
}

export type TAddresses = SES.Types.Address | SES.Types.Address[];

interface ISendEmailOptions {
  cc?: TAddresses;
  bcc?: TAddresses;
  replyTo?: TAddresses;
}

export interface ISendTemplatedEmailOptions extends ISendEmailOptions {
  source?: string;
}
