import { arg } from 'nexus';

import { IBoard } from '../../../../types/types';
import id from '../../../../utils/id';
import { sleep } from '../../../../utils/helper';

export const createBoard = {
  type: 'Board' as 'Board',

  args: {
    input: arg({
      type: 'BoardInput',
      required: true,
    }),
  },

  resolve: async (_parent, { input: { title } }, { userId, dynamo }) => {
    const uuid = id();

    const board: IBoard = {
      id: userId,
      relation: `board-${uuid}`,
      created: new Date().getTime(),
      uuid,
      title,
      isDeleted: false,
    };

    await dynamo.saveItem(board);

    sleep(5000);

    return {
      uuid: uuid,
      title: title,
      isDeleted: false,
    };
  },
};
