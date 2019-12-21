import { idArg } from 'nexus';

import { Board } from '../Board';
import { IBoard, IKeyBase } from '../../../../types/types';

export const archiveBoard = {
  type: Board,

  args: {
    uuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `BOAD#${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': true,
        ':updatedAt': new Date().toISOString(),
      },
    };

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IBoard } = await dynamo.getItem(key);
    Item.createdAt = new Date(Item.createdAt);
    Item.updatedAt = new Date(Item.updatedAt);

    return Item;
  },
};
