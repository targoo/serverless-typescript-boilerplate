import { Board } from '../Board';

export const board = {
  type: 'Board',
  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    const key = {
      id: userId,
      relation: `board-${uuid}`,
    };

    const { Item = {} } = await dynamo.getItem(key);

    return Item;
  },
};
