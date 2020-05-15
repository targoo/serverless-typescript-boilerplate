import { arg } from '@nexus/schema';
import { MutationFieldType } from '../../types';
import { BoardInputData } from '../args';
import { Board, boardFormProperties } from '../Board';
import logger from '../../../../utils/logger';

export const createBoard: MutationFieldType<'createBoard'> = {
  type: Board,

  args: {
    data: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { data }, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to create a new board');
      throw new Error('Not authorized to create a new board');
    }

    return await boardfactory.create(user.uuid, data);
  },
};
