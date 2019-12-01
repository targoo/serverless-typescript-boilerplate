import { stringArg } from 'nexus';

const boardArgs = {
  uuid: stringArg({
    required: true,
    description: 'The id of the board',
  }),
};

export const board = {
  type: 'Board',
  args: boardArgs,
  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    const key = {
      id: userId,
      relation: `board-${uuid}`,
    };

    const { Item = {} } = await dynamo.getItem(key);

    return Item;
  },
};
