import { arg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { BoardInputData } from '../args';
import { Board, boardFormProperties } from '../Board';
import { IBoard } from '../../../../types/types';
import id from '../../../../utils/id';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const createBoard: MutationFieldType<'createBoard'> = {
  type: Board,

  args: {
    data: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  // @ts-ignore
  resolve: async (_parent, { data }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to create a new board');
    }

    const uuid = id();

    const board = ({
      ...prepareFormInput(data, boardFormProperties),
      id: `USER#${user.uuid}`,
      relation: `BOARD#${uuid}`,
      uuid: JSON.stringify({ format: 'string', value: uuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      createdBy: JSON.stringify({ format: 'string', value: user.uuid }),
    } as unknown) as IBoard;

    await dynamo.saveItem(board);

    const response = prepareResponseDate(board) as IBoard;

    return response;
  },
};
