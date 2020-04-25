import { idArg, booleanArg } from '@nexus/schema';

import { IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const unfollowBoard: MutationFieldType<'unfollowBoard'> = {
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
      id: `USER#${user.uuid}`,
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

    try {
      await dynamo.updateItem(params, key);
    } catch (error) {
      logger.error(error);
      throw new Error('Could not un-follow the board');
    }

    return true;
  },
};
