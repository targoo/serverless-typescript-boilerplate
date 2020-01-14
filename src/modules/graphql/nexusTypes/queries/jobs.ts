import { arg } from 'nexus';

import { JobInputWhere } from '../args';
import { Job } from '../Job';
import { IJob } from '../../../../types/types';
import logger from '../../../../utils/logger';

export const jobs = {
  type: Job,

  args: {
    where: arg({
      type: JobInputWhere,
    }),
  },

  resolve: async (_parent, args: { where: Partial<IJob> }, { userId, dynamo }) => {
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
        ':relation': 'JOB#BOARD#',
      },
      ProjectionExpression: ['#relation', '#title', '#uuid', '#status', '#createdAt', '#updatedAt', 'isDeleted'],
    };
    logger.debug(JSON.stringify(params));

    let { Items: items }: { Items: IJob[] } = await dynamo.query(params);
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

    logger.debug(JSON.stringify(items));

    return items;
  },
};
