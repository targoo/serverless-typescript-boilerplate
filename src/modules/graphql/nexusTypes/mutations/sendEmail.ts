import { stringArg } from 'nexus';

import logger from '../../../../utils/logger';

export const sendEmail = {
  type: 'Boolean',

  args: {
    email: stringArg({
      required: true,
    }),
    subject: stringArg({
      required: true,
    }),
    content: stringArg({
      required: true,
    }),
  },

  resolve: async (_parent, { email, subject, content }, { user, emailService }) => {
    // if (!user) {
    //   throw new Error('Not authorized to send an email');
    // }
    // Send email
    try {
      const result = await emailService.sendRawEmail(email, subject, content);
      console.log('result', result);
    } catch (error) {
      console.error('error-------', error);
      return false;
    }

    return true;
  },
};
