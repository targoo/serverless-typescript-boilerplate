import { arg } from 'nexus';

import { BoardInputData } from '../args';
import { Board } from '../Board';
import { IBoard } from '../../../../types/types';
import id from '../../../../utils/id';
import { sleep } from '../../../../utils/helper';

export const createBoard = {
  type: Board,

  args: {
    input: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { input: { title } }, { userId, dynamo }) => {
    const uuid = id();

    const board: IBoard = {
      id: `USER#${userId}`,
      relation: `BOAD#${uuid}`,
      uuid,
      title,
      isDeleted: false,
      //      createdAt: new Date(),
    };

    await dynamo.saveItem(board);

    sleep(3000);

    return board;
  },
};
