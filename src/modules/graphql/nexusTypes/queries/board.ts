import { idArg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { Board } from '../Board';
import { IBoard, IFollowingJob, IFollowingBoard } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';

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

  resolve: async (_parent, { userUuid, boardUuid }, { user, dynamo, utils: { boardfactory } }) => {
    if (!user) {
      throw new Error('Not authorized to get the board');
    }

    // Check permissions.
    if (userUuid !== user.uuid) {
      const isFollowing = await boardfactory.isFollowing(boardUuid, user.uuid);
      if (!isFollowing) {
        throw new Error('Cannot view this board');
      }
    }

    const permissions = userUuid !== user.uuid ? ['VIEW', 'UNFOLLOW', 'ADD_JOB'] : ['VIEW', 'EDIT', 'ADD_JOB'];

    try {
      let board = await boardfactory.get(userUuid, boardUuid);
      return { ...board, permissions };
    } catch (error) {
      logger.error(error);
      throw new Error('The board does not exist');
    }
  },
};
