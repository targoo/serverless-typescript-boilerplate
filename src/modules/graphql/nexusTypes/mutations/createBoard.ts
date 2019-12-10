import { arg } from 'nexus';

import { Board, BoardStatus } from '../../../../types/types';
import id from '../../../../utils/id';
import logger from '../../../../utils/logger';

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

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
    sleep(5000);

    return {
      uuid: uuid,
      title: title,
      status: BoardStatus.ACTIVE,
    };
  },
};
