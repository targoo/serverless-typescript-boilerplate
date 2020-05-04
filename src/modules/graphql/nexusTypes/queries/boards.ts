import { arg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { BoardInputWhere, BoardInputSort } from '../args';
import { Board } from '../Board';
import logger from '../../../../utils/logger';

export const boards: QueryFieldType<'boards'> = {
  type: Board,

  args: {
    where: arg({
      type: BoardInputWhere,
    }),
    sort: arg({
      type: BoardInputSort,
    }),
  },

  resolve: async (_parent, args, { user, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to list the boards');
      throw new Error('Not authorized to list the boards');
    }

    const permissions = ['VIEW', 'EDIT', 'ARCHIVE', 'ADD_JOB', 'INVITE'];

    // Get boards
    let boards = await boardfactory.list(user.uuid);

    // Add permissions
    boards = boards.map((item) => ({ ...item, permissions }));

    // Filter
    if (args.where && args.where.isDeleted !== undefined) {
      boards = boards.filter((item) => item.isDeleted === args.where.isDeleted);
    }

    // Sort
    if (args.sort) {
      boards.sort((a, b) => {
        const aProp = a[args.sort.field];
        const bProp = b[args.sort.field];
        let comparison = 0;
        if (aProp > bProp) {
          comparison = 1;
        } else if (aProp < bProp) {
          comparison = -1;
        }
        return args.sort.direction === 'ASC' ? comparison : -1 * comparison;
      });
    }

    return boards;
  },
};
