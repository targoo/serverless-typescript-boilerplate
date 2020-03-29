import { arg } from 'nexus';

import { BoardInputWhere } from '../args';
import { Board } from '../Board';
import { IBoard } from '../../../../types/types';
import logger from '../../../../utils/logger';

export const boards = {
  type: Board,

  args: {
    where: arg({
      type: BoardInputWhere,
    }),
  },

  resolve: async (_parent, args: { where: Partial<IBoard> }, { userId, dynamo }) => {
    const properties = ['id', 'relation', 'uuid', 'title', 'status', 'createdAt', 'isDeleted', 'updatedAt'];

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
      ProjectionExpression: properties.map(property => `#${property}`),
    };
    logger.debug(JSON.stringify(params));

    let { Items: items }: { Items: IBoard[] } = await dynamo.query(params);
    logger.debug(`items: ${JSON.stringify(items)}`);

    items = items.map(item => {
      if (item.createdAt) {
        item.createdAt = new Date(item.createdAt);
      }
      if (item.updatedAt) {
        item.updatedAt = new Date(item.updatedAt);
      }
      return item;
    });

    logger.debug(`items: ${JSON.stringify(items)}`);

    if (args.where && args.where.isDeleted !== undefined) {
      items = items.filter(item => item.isDeleted === args.where.isDeleted);
    }

    logger.debug(`items: ${JSON.stringify(items)}`);

    return items;
  },
};
