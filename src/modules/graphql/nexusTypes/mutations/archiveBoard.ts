import { idArg, booleanArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { Board } from '../Board';
import logger from '../../../../utils/logger';

export const archiveBoard: MutationFieldType<'archiveBoard'> = {
  type: Board,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    isDeleted: booleanArg(),
  },

  resolve: async (_parent, { boardUuid, isDeleted = true }, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to archive the board');
      throw new Error('Not authorized to archive the board');
    }

    const data = {
      isDeleted,
    };

    try {
      return await boardfactory.update(user.uuid, boardUuid, data);
    } catch (error) {
      logger.error(error);
      throw new Error('Could not archive the board');
    }
  },
};
