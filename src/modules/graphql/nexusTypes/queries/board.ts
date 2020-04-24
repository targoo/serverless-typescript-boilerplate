import { idArg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { Board } from '../Board';
import { IBoard } from '../../../../types/types';
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
  resolve: async (_parent, { uuid, boardUuid }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to get the board');
    }

    let isOwner = true;

    // Check permissions if the user tried to access someone else board.
    if (uuid !== user.uuid) {
      try {
        const followingKey = {
          id: `USER#${user.uuid}`,
          relation: `FOLLOWING_BOARD#${boardUuid}`,
        };

        await dynamo.getItem(followingKey);
        isOwner = false;
      } catch (error) {
        logger.error(error);
        throw new Error('Not permitted to get the board');
      }
    }

    try {
      const key = {
        id: `USER#${uuid}`,
        relation: `BOARD#${boardUuid}`,
      };

      let { Item: item } = await dynamo.getItem(key);

      item = prepareResponseDate(item) as IBoard;

      return { ...item, isOwner };
    } catch (error) {
      logger.error(error);
      throw new Error('The board does not exist');
    }
  },
};
