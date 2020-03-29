import { IUser } from '../../../../types/types';

export const me = {
  type: 'User' as 'User',

  resolve: async (_parent, _arg, { userId, userEmail, dynamo }) => {
    const key = {
      id: `USER#${userId}`,
      relation: `USER`,
    };

    const { Item } = await dynamo.getItem(key);

    if (Item) {
      if (Item.createdAt) {
        Item.createdAt = new Date(Item.createdAt);
      }
      if (Item.updatedAt) {
        Item.updatedAt = new Date(Item.updatedAt);
      }
      return Item;
    } else {
      const user: IUser = {
        id: `USER#${userId}`,
        relation: `USER`,
        uuid: userId,
        name: userEmail,
        email: userEmail,
        isDeleted: false,
        createdAt: new Date(),
      };

      await dynamo.saveItem(user);

      const { Item } = await dynamo.getItem(key);
      if (Item.createdAt) {
        Item.createdAt = new Date(Item.createdAt);
      }
      if (Item.updatedAt) {
        Item.updatedAt = new Date(Item.updatedAt);
      }
      return Item;
    }
  },
};
