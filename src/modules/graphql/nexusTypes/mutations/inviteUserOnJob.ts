import { arg, idArg } from '@nexus/schema';

import { EmailInputData } from '../args';
import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const inviteUserOnJob: MutationFieldType<'inviteUserOnJob'> = {
  type: 'Boolean',

  args: {
    userUuid: idArg({
      required: true,
    }),
    boardUuid: idArg({
      required: true,
    }),
    jobUuid: idArg({
      required: true,
    }),
    data: arg({
      type: EmailInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { userUuid, boardUuid, jobUuid, data }, { user, emailService, utils: { userfactory } }) => {
    // Authorization
    if (!user) {
      logger.error('Not authorized to invite a user on a job');
      throw new Error('Not authorized to invite a user on a job');
    }

    // Permissions
    if (userUuid !== user.uuid) {
      throw new Error('Not permitted to invite a user on a job that does not belong to you');
    }

    const { email, subject, emailTemplate, params, replyTo } = data;

    const followingUser = await userfactory.findOrCreateByEmail(email);

    // await boardfactory.follow(userUuid, boardUuid, followingUser.uuid);

    try {
      await emailService.sendTemplateEmail(email, subject, emailTemplate, params, { replyTo });
    } catch (error) {
      logger.error(error);
      return false;
    }

    return true;
  },
};
