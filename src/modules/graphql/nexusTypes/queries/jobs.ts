import { booleanArg } from 'nexus';

import { Job } from '../Job';
import { IJob } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { sleep } from '../../../../utils/helper';

export const jobs = {
  type: Job,

  args: { isDeleted: booleanArg() },

  resolve: async (_parent, args: Partial<IJob>, { userId, dynamo }) => {
    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: {
        '#uuid': 'uuid',
        '#title': 'title',
        '#status': 'status',
        '#created': 'created',
        '#updated': 'updated',
        '#id': 'id',
        '#relation': 'relation',
      },
      ExpressionAttributeValues: {
        ':userUUID': userId,
        ':relation': 'job-',
      },
      ProjectionExpression: ['#title', '#uuid', '#status', '#created', '#updated', 'isDeleted'],
    };
    logger.debug(JSON.stringify(params));

    let { Items: items }: { Items: IJob[] } = await dynamo.query(params);

    if (args.isDeleted !== undefined) {
      items = items.filter(item => item.isDeleted === args.isDeleted);
    }

    sleep(5000);
    logger.debug(JSON.stringify(items));

    return items;
  },
};
