import { arg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { BoardInputWhere, BoardInputSort } from '../args';
import { Board, followingBoardProperties, boardProperties } from '../Board';
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

  // @ts-ignore
  resolve: async (_parent, _args, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to list the boards');
    }

    const properties = Object.keys(followingBoardProperties);

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${user.uuid}`,
        ':relation': 'FOLLOWING_BOARD#',
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };
    console.log('params', params);

    let { Items: items }: { Items: IFollowingBoard[] } = await dynamo.query(params);
    console.log('items', items);
    items = items.map((item) => prepareResponseDate(item)) as IFollowingBoard[];
    items = items.filter((item) => item.isDeleted === false);

    let results = (await Promise.all(
      items.map((item) => getBoard(dynamo, `USER#${item.uuid}`, `BOARD#${item.boardUuid}`)),
    )) as IBoard[];
    results.filter((result) => result.isDeleted === false);

    return results;
  },
};
