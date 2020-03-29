import { arg, idArg } from 'nexus';

import { BoardInputData } from '../args';
import { IBoard, IKeyBase } from '../../../../types/types';
import { sleep } from '../../../../utils/helper';

export const updateBoard = {
  type: 'Board' as 'Board',

  args: {
    uuid: idArg({
      required: true,
    }),
    data: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { uuid, data: { title } }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `BOARD#${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #title = :title, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#title': 'title', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':title': title,
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
