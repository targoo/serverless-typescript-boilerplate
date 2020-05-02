import { idArg } from '@nexus/schema';

import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const unfollowBoard: MutationFieldType<'unfollowBoard'> = {
  type: 'Boolean',

  args: {
    boardUuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { boardUuid }, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to unfollow the board');
      throw new Error('Not authorized to unfollow the board');
    }

    try {
      await boardfactory.unfollow(boardUuid, user.uuid);
    } catch (error) {
      logger.error(error);
      return false;
    }

    return true;
  },
};
