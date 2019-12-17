import { idArg } from 'nexus';

import { IBoard } from '../../../../types/types';

export const archiveBoard = {
  type: 'Board' as 'Board',

  args: {
    uuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    const key = {
      id: userId,
      relation: `board-${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updated = :updated',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updated': 'updated' },
      ExpressionAttributeValues: {
        ':isDeleted': true,
        ':updated': new Date().getTime(),
      },
    };

    const { Attributes } = await dynamo.updateItem(params, key);

    return Attributes as IBoard;
  },
};
