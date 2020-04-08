import { arg } from 'nexus';

import { JobInputWhere } from '../args';
import { Job, jobProperties } from '../Job';
import { IJob } from '../../../../types/types';
import logger from '../../../../utils/logger';

interface JobInputWhere {
  isDeleted?: boolean;
  boardUuid?: string;
}

export const jobs = {
  type: Job,

  args: {
    where: arg({
      type: JobInputWhere,
      required: true,
    }),
  },

  resolve: async (_parent, args: { where: JobInputWhere }, { userId, dynamo }) => {
    const properties = jobProperties;

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${userId}`,
        ':relation': args.where.boardUuid ? `JOB#BOARD#${args.where.boardUuid}` : 'JOB#BOARD#',
      },
      ProjectionExpression: properties.map(property => `#${property}`),
    };

    let { Items: items }: { Items: IJob[] } = await dynamo.query(params);

    items = items.map(item => {
      if (item.createdAt) {
        item.createdAt = new Date(item.createdAt);
      }
      if (item.updatedAt) {
        item.updatedAt = new Date(item.updatedAt);
      }
      return item;
    });

    if (args.where && args.where.isDeleted !== undefined) {
      items = items.filter(item => item.isDeleted === args.where.isDeleted);
    }

    return items;
  },
};
