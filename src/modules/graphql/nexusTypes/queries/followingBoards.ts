import { arg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { BoardInputSort } from '../args';
import { Board, followingBoardProperties } from '../Board';
import { IFollowingBoard, IBoard } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';

const getBoard = async (dynamo, id, relation) => {
  const key = {
    id,
    relation,
  };
  const { Item }: { Item: IBoard } = await dynamo.getItem(key);
  return prepareResponseDate(Item);
};

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
