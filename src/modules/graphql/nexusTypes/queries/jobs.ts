import { arg } from 'nexus';

import { JobInputWhere } from '../args';
import { Job } from '../Job';
import { IJob } from '../../../../types/types';
import logger from '../../../../utils/logger';

interface JobInputWhere {
  isDeleted?: boolean;
  boardUUID?: string;
}

export const jobs = {
  type: Job,

  args: {
    where: arg({
      type: JobInputWhere,
    }),
  },

  resolve: async (_parent, args: { where: JobInputWhere }, { userId, dynamo }) => {
    const properties = [
      'id',
      'relation',
      'uuid',
      'company',
      'duration',
      'rate',
      'location',
      'position',
      'status',
      'createdAt',
      'isDeleted',
      'updatedAt',
    ];

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${userId}`,
        ':relation': args.where.boardUUID ? `JOB#BOARD#${args.where.boardUUID}` : 'JOB#BOARD#',
      },
      ProjectionExpression: properties.map(property => `#${property}`),
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
