import { arg, idArg } from 'nexus';

import { Board, BoardStatus } from '../../../../types/types';

export const cancelBoard = {
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
      UpdateExpression: 'set #status = :status, #updated = :updated',
      ExpressionAttributeNames: { '#status': 'status', '#updated': 'updated' },
      ExpressionAttributeValues: {
        ':status': BoardStatus.ARCHIVED,
        ':updated': new Date().getTime(),
      },
    };

    const { Attributes } = await dynamo.updateItem(params, key);

    return Attributes as Board;
  },
};
