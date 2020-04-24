import { arg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { JobInputWhere } from '../args';
import { Job, jobProperties } from '../Job';
import { IJob } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';

export const jobs: QueryFieldType<'jobs'> = {
  type: Job,

  args: {
    where: arg({
      type: JobInputWhere,
      required: true,
    }),
  },

  // @ts-ignore
  resolve: async (_parent, args, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to list the jobs');
    }

    const properties = Object.keys(jobProperties);

    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':userUUID': `USER#${user.uuid}`,
        ':relation': args.where.boardUuid ? `JOB#BOARD#${args.where.boardUuid}` : 'JOB#BOARD#',
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };
    logger.debug(JSON.stringify(params));

    let { Items: items }: { Items: IJob[] } = await dynamo.query(params);
    logger.debug(`items: ${JSON.stringify(items)}`);

    items = items.map((item) => prepareResponseDate(item)) as IJob[];
    logger.debug(`items: ${JSON.stringify(items)}`);

    if (args.where && args.where.isDeleted !== undefined) {
      items = items.filter((item) => item.isDeleted === args.where.isDeleted);
    }

    return items;
  },
};
