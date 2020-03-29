import { idArg } from 'nexus';

const boardArgs = {
  uuid: idArg({
    required: true,
    description: 'The id of the board',
  }),
};

export const board = {
  type: 'Board' as 'Board',

  args: boardArgs,

  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    const key = {
      id: `USER#${userId}`,
      relation: `BOARD#${uuid}`,
    };

    const { Item = {} } = await dynamo.getItem(key);

    return Item;
  },
};
