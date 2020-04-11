import { arg, idArg } from 'nexus';

import { JobInputData } from '../args';
import { Job, jobFormProperties } from '../Job';
import { IJob, JobStatus, Feeling } from '../../../../types/types';
import id from '../../../../utils/id';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const createJob = {
  type: Job,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    data: arg({
      type: JobInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { boardUuid, data }, { userId, dynamo }) => {
    if (!userId) {
      throw new Error('Not authorized to create a new job');
    }

    const uuid = id();

    const job = ({
      ...prepareFormInput(data, jobFormProperties),
      id: `USER#${userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
      uuid: JSON.stringify({ format: 'string', value: uuid }),
      status: JSON.stringify({ format: 'string', value: JobStatus.ACTIVE }),
      feeling: JSON.stringify({ format: 'string', value: Feeling.NORMAL }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
    } as unknown) as IJob;

    logger.debug(JSON.stringify(job));
    await dynamo.saveItem(job);

    const response = prepareResponseDate(job);
    logger.debug(JSON.stringify(response));

    return job;
  },
};
