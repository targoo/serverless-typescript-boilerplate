import { idArg, booleanArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { Board } from '../Board';
import { IBoard, IKeyBase } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

export const archiveBoard: MutationFieldType<'archiveBoard'> = {
  type: Board,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    isDeleted: booleanArg(),
  },

  // @ts-ignore
  resolve: async (_parent, { boardUuid, isDeleted = true }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to archive the board');
    }

    const key: IKeyBase = {
      id: `USER#${user.uuid}`,
      relation: `BOARD#${boardUuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': JSON.stringify({ format: 'boolean', value: isDeleted }),
        ':updatedAt': JSON.stringify({ format: 'date', value: new Date().toISOString() }),
      },
    };

    try {
      await dynamo.updateItem(params, key);
      const { Item } = await dynamo.getItem(key);

      const item = prepareResponseDate(Item) as IBoard;
      return item;
    } catch (error) {
      logger.error(error);
      throw new Error('Could not archive the board');
    }
  },
};
