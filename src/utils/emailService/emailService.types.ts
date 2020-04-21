import { SES } from 'aws-sdk';

export type TAddresses = SES.Types.Address | SES.Types.Address[];

interface ISendEmailOptions {
  cc?: TAddresses;
  bcc?: TAddresses;
  replyTo?: TAddresses;
}

export interface ISendTemplatedEmailOptions extends ISendEmailOptions {
  source?: string;
}
