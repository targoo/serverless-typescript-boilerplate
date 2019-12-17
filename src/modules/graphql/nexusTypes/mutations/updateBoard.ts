import { arg, idArg } from 'nexus';

import { IBoard } from '../../../../types/types';

export const updateBoard = {
  type: 'Board' as 'Board',

  args: {
    uuid: idArg({
      required: true,
    }),
    input: arg({
      type: 'BoardInput',
      required: true,
    }),
  },

  resolve: async (_parent, { uuid, input: { title } }, { userId, dynamo }) => {
    const key: Pick<IBoard, 'id' | 'relation'> = {
      id: userId,
      relation: `board-${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #title = :title, #updated = :updated',
      ExpressionAttributeNames: { '#title': 'title', '#updated': 'updated' },
      ExpressionAttributeValues: {
        ':title': title,
        ':updated': new Date().getTime(),
      },
    };

    const { Attributes } = await dynamo.updateItem(params, key);

    return Attributes as IBoard;
  },
};
