import { idArg } from 'nexus';

import { IBoard } from '../../../../types/types';
import { Board } from '../Board';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';

const boardArgs = {
  uuid: idArg({
    required: true,
    description: 'The unique id of the board',
  }),
};

export const board = {
  type: Board,

  args: boardArgs,

  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    if (!userId) {
      throw new Error('Not authorized to get the board');
    }

    const key = {
      id: `USER#${userId}`,
      relation: `BOARD#${uuid}`,
    };

    const { Item }: { Item: IBoard } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
