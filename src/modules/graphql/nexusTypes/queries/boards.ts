import { arg } from 'nexus';

import { BoardInputWhere } from '../args';
import { Board, boardProperties } from '../Board';
import { IBoard } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';

export const boards = {
  type: Board,

  args: {
    where: arg({
      type: BoardInputWhere,
    }),
  },

  resolve: async (
    _parent,
    args: {
      where: {
        isDeleted?: boolean;
      };
    },
    { userId, dynamo },
  ) => {
    if (!userId) {
      throw new Error('Not authorized to list the boards');
    }

    const properties = Object.keys(boardProperties);

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${userId}`,
        ':relation': 'BOARD#',
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };
    logger.debug(JSON.stringify(params));

    let { Items: items }: { Items: IBoard[] } = await dynamo.query(params);
    logger.debug(`items: ${JSON.stringify(items)}`);

    items = items.map((item) => prepareResponseDate(item)) as IBoard[];
    logger.debug(`items: ${JSON.stringify(items)}`);

    if (args.where && args.where.isDeleted !== undefined) {
      items = items.filter((item) => item.isDeleted === args.where.isDeleted);
    }

    return items;
  },
};
