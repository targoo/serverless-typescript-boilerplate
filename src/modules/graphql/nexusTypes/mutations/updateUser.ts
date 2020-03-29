import { arg } from 'nexus';

import { UserInputData } from '../args';
import { IUser, IKeyBase } from '../../../../types/types';

export const updateUser = {
  type: 'User' as 'User',

  args: {
    data: arg({
      // @ts-ignore
      type: UserInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { data: { name } }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `USER`,
    };

    const params = {
      UpdateExpression: 'set #name = :name, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#name': 'name', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':name': name,
        ':updatedAt': new Date().toISOString(),
      },
    };

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IUser } = await dynamo.getItem(key);
    Item.createdAt = new Date(Item.createdAt);
    Item.updatedAt = new Date(Item.updatedAt);

    return Item;
  },
};
