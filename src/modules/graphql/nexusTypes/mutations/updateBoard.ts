import { arg, idArg } from 'nexus';

import { BoardInputData } from '../args';
import { IBoard, IKeyBase } from '../../../../types/types';

export const updateBoard = {
  type: 'Board' as 'Board',

  args: {
    uuid: idArg({
      required: true,
    }),
    input: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { uuid, input: { title } }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `BOAD#${uuid}`,
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
