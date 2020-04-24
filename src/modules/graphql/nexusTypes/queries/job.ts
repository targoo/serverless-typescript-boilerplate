import { idArg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { Job } from '../Job';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';
import { IJob } from '../../../../types/types';

const jobArgs = {
  boardUuid: idArg({
    required: true,
    description: 'The id of the board',
  }),
  jobUuid: idArg({
    required: true,
    description: 'The id of the job',
  }),
};

export const job: QueryFieldType<'job'> = {
  type: Job,

  args: jobArgs,

  // @ts-ignore
  resolve: async (_parent, { boardUuid, jobUuid }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to get the board');
    }

    const key = {
      id: `USER#${user.uuid}`,
      relation: `JOB#BOARD#${boardUuid}#${jobUuid}`,
    };

    const { Item } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item) as IJob;
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
