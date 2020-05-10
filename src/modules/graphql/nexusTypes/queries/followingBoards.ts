import { arg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { BoardInputSort } from '../args';
import { Board } from '../Board';
import logger from '../../../../utils/logger';

export const followingBoards: QueryFieldType<'followingBoards'> = {
  type: Board,

  args: {
    sort: arg({
      type: BoardInputSort,
    }),
  },

  resolve: async (_parent, _args, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to list the boards');
      throw new Error('Not authorized to list the boards');
    }

    let boards = await boardfactory.followingList(user.uuid);

    // Permissions
    const permissions = ['VIEW', 'UNFOLLOW', 'ADD_JOB'];

    return boards.filter((result) => result.isDeleted === false).map((item) => ({ ...item, permissions }));
  },
};
