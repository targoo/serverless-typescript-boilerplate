import { arg, idArg } from '@nexus/schema';

import { BoardInputData } from '../args';
import { Board, boardFormProperties } from '../Board';
import logger from '../../../../utils/logger';
import { prepareFormInput } from '../utils/form';
import { MutationFieldType } from '../../types';

export const updateBoard: MutationFieldType<'updateBoard'> = {
  type: Board,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    data: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { boardUuid, data }, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to update the board');
      throw new Error('Not authorized to update the board');
    }

    try {
      return await boardfactory.update(user.uuid, boardUuid, data);
    } catch (error) {
      logger.error(error);
      throw new Error('Could not update the board');
    }
  },
};
