import { idArg, booleanArg } from 'nexus';

import { IBoard, IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';

export const unfollowBoard = {
  type: 'Boolean',

  args: {
    boardUuid: idArg({
      required: true,
    }),
    isDeleted: booleanArg(),
  },

  resolve: async (_parent, { boardUuid, isDeleted = true }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to archive the board');
    }

    const key: IKeyBase = {
      id: `USER#${user.userId}`,
      relation: `FOLLOWING_BOARD#${boardUuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': JSON.stringify({ format: 'boolean', value: isDeleted }),
        ':updatedAt': JSON.stringify({ format: 'date', value: new Date().toISOString() }),
      },
    };

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IBoard } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    return true;
  },
};
