import { enumType } from '@nexus/schema';

export const EmailTemplate = enumType({
  name: 'EmailTemplate',
  members: ['INVITE_JOB_AGENT', 'INVITE_BOARD_AGENT'],
});
