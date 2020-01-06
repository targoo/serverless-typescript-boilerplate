import { arg } from 'nexus';

import { BoardInputData } from '../args';
import { Board } from '../Board';
import { IBoard } from '../../../../types/types';
import id from '../../../../utils/id';

export const createBoard = {
  type: Board,

  args: {
    data: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { data: { title } }, { userId, dynamo }) => {
    const uuid = id();

    const board: IBoard = {
      id: `USER#${userId}`,
      relation: `BOARD#${uuid}`,
      uuid,
      title,
      isDeleted: false,
      createdAt: new Date(),
    };

    await dynamo.saveItem(board);

    return board;
  },
};
