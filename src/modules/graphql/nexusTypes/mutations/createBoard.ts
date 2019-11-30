import { arg } from 'nexus';

import { Board, BoardStatus } from '../../../../types/types';
import id from '../../../../utils/id';

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

    const board: Board = {
      id: userId,
      relation: `board-${uuid}`,
      created: new Date().getTime(),
      uuid,
      title,
      status: BoardStatus.ACTIVE,
    };

    await dynamo.saveItem(board);

    return {
      uuid: uuid,
      title: title,
      status: BoardStatus.ACTIVE,
    };
  },
};
