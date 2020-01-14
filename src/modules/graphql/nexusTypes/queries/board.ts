import { stringArg } from 'nexus';

import { sleep } from '../../../../utils/helper';

const boardArgs = {
  uuid: stringArg({
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

    sleep(5000);

    return Item;
  },
};
