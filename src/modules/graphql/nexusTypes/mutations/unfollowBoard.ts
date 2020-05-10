import { idArg } from '@nexus/schema';

import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const unfollowBoard: MutationFieldType<'unfollowBoard'> = {
  type: 'Boolean',

  args: {
    userUuid: idArg({
      required: true,
    }),
    boardUuid: idArg({
      required: true,
    }),
    followerUserUuid: idArg({
      required: true,
    }),
  },

  // @ts-ignore
  resolve: async (_parent, { userUuid, boardUuid, followerUserUuid }, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to unfollow the board');
      throw new Error('Not authorized to unfollow the board');
    }

    // Permissions
    if (userUuid !== user.uuid && followerUserUuid !== user.uuid) {
      logger.error('Not permitted to unfollow the board');
      throw new Error('Not permitted to unfollow the board');
    }

    try {
      await boardfactory.unfollow(boardUuid, followerUserUuid);
    } catch (error) {
      logger.error(error);
      return false;
    }

    return true;
  },
};
