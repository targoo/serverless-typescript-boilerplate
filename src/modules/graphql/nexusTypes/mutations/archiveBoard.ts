import { idArg } from 'nexus';

import { Board } from '../Board';
import { IBoard, IKeyBase } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

export const archiveBoard = {
  type: Board,

  args: {
    uuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    if (!userId) {
      throw new Error('cannot archive the board');
    }

    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `BOARD#${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': JSON.stringify({ format: 'boolean', value: true }),
        ':updatedAt': JSON.stringify({ format: 'date', value: new Date().toISOString() }),
      },
    };

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IBoard } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
