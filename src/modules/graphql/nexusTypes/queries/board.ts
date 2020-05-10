import { idArg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { Board } from '../Board';
import logger from '../../../../utils/logger';

const boardArgs = {
  userUuid: idArg({
    required: true,
    description: 'The unique id of the user',
  }),
  boardUuid: idArg({
    required: true,
    description: 'The unique id of the board',
  }),
};

export const board: QueryFieldType<'board'> = {
  type: Board,

  args: boardArgs,

  resolve: async (_parent, { userUuid, boardUuid }, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to get the board');
      throw new Error('Not authorized to get the board');
    }

    const permissions = ['VIEW'];
    if (userUuid === user.uuid) {
      permissions.push(...['EDIT', 'ADD_JOB']);
    } else {
      const isFollowing = await boardfactory.isFollowing(boardUuid, user.uuid);
      if (isFollowing) {
        permissions.push(...['UNFOLLOW', 'ADD_JOB']);
      }
    }

    try {
      const board = await boardfactory.get(userUuid, boardUuid);
      return { ...board, permissions };
    } catch (error) {
      logger.error(error);
      throw new Error('The board does not exist');
    }
  },
};
