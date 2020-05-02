import { arg, idArg } from '@nexus/schema';

import { EmailInputData } from '../args';
import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const inviteUserOnBoard: MutationFieldType<'inviteUserOnBoard'> = {
  type: 'Boolean',

  args: {
    userUuid: idArg({
      required: true,
    }),
    boardUuid: idArg({
      required: true,
    }),
    data: arg({
      type: EmailInputData,
      required: true,
    }),
  },

  resolve: async (
    _parent,
    { userUuid, boardUuid, data },
    { user, emailService, utils: { userfactory, boardfactory } },
  ) => {
    // Authorization
    if (!user) {
      logger.error('Not authorized to invite a user on a board');
      throw new Error('Not authorized to invite a user on a board');
    }

    // Permissions
    if (userUuid !== user.uuid) {
      throw new Error('Not permitted to invite a user on a board that does not belong to you');
    }

    const { email, subject, emailTemplate, params, replyTo } = data;

    const followingUser = await userfactory.findOrCreateByEmail(email);

    await boardfactory.follow(userUuid, boardUuid, followingUser.uuid);

    try {
      await emailService.sendTemplateEmail(email, subject, emailTemplate, params, { replyTo });
    } catch (error) {
      logger.error(error);
      return false;
    }

    return true;
  },
};
