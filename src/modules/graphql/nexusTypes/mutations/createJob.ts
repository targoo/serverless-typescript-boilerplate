import { arg, idArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { JobInputData } from '../args';
import { Job, jobFormProperties } from '../Job';
import { IJob, JobStatus, Feeling } from '../../../../types/types';
import id from '../../../../utils/id';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const createJob: MutationFieldType<'createJob'> = {
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

  // @ts-ignore
  resolve: async (_parent, { boardUuid, data }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to create a new job');
    }

    const uuid = id();

    const job = ({
      ...prepareFormInput(data, jobFormProperties),
      id: `USER#${user.uuid}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
      uuid: JSON.stringify({ format: 'string', value: uuid }),
      status: JSON.stringify({ format: 'string', value: JobStatus.STARTED }),
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
