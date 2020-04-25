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

  // @ts-ignore
  resolve: async (_parent, { userUuid, boardUuid }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to get the board');
    }

    // Check permissions
    if (userUuid !== user.uuid) {
      const followingKey = {
        id: `USER#${user.uuid}`,
        relation: `FOLLOWING_BOARD#${boardUuid}`,
      };
      const { Item } = await dynamo.getItem(followingKey);

      if (Item) {
        const followingBoard = prepareResponseDate(Item) as IFollowingBoard;
        if (followingBoard.isDeleted) {
          throw new Error('Cannot view this board anymore');
        }
      } else {
        throw new Error('Cannot view this board');
      }
    }

    const permissions = userUuid !== user.uuid ? ['VIEW', 'UNFOLLOW', 'ADD_JOB'] : ['VIEW', 'EDIT', 'ADD_JOB'];

    try {
      const key = {
        id: `USER#${userUuid}`,
        relation: `BOARD#${boardUuid}`,
      };

      let { Item: item } = await dynamo.getItem(key);

      item = prepareResponseDate(item) as IBoard;

      console.log({ ...item, permissions });

      return { ...item, permissions };
    } catch (error) {
      logger.error(error);
      throw new Error('The board does not exist');
    }
  },
};
