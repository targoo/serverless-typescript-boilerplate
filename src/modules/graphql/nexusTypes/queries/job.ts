import { idArg } from 'nexus';

import { Job } from '../Job';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';
import { IJob } from '../../../../types/types';

const jobArgs = {
  boardUuid: idArg({
    required: true,
    description: 'The id of the board',
  }),
  uuid: idArg({
    required: true,
    description: 'The id of the job',
  }),
};

export const job = {
  type: Job,

  args: jobArgs,

  resolve: async (_parent, { boardUuid, uuid }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to get the board');
    }

    const key = {
      id: `USER#${user.userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
    };

    const { Item }: { Item: IJob } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
