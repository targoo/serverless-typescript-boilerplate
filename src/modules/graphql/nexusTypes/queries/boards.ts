import { arg } from 'nexus';

import { BoardInputWhere } from '../args';
import { Board } from '../Board';
import { IBoard } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { sleep } from '../../../../utils/helper';

export const boards = {
  type: Board,

  args: {
    where: arg({
      type: BoardInputWhere,
    }),
  },

  resolve: async (_parent, args: { where: Partial<IBoard> }, { userId, dynamo }) => {
    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: {
        '#uuid': 'uuid',
        '#title': 'title',
        '#status': 'status',
        '#createdAt': 'createdAt',
        '#updatedAt': 'updatedAt',
        '#id': 'id',
        '#relation': 'relation',
      },
      ExpressionAttributeValues: {
        ':userUUID': `USER#${userId}`,
        ':relation': 'BOAD#',
      },
      ProjectionExpression: ['#title', '#uuid', '#status', '#createdAt', '#updatedAt', 'isDeleted'],
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

    sleep(3000);
    logger.debug(JSON.stringify(items));

    return items;
  },
};
