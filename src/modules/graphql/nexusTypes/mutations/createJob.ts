import { arg, idArg } from 'nexus';

import { JobInputData } from '../args';
import { Job, jobFormProperties } from '../Job';
import { IJob, JobStatus } from '../../../../types/types';
import id from '../../../../utils/id';

function validedFormInput(myObj: string, validKeys: string[]) {
  return Object.keys(myObj)
    .filter(key => validKeys.includes(key))
    .reduce((result, current) => {
      result[current] = myObj[current] || null;
      return result;
    }, {});
}

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
    const uuid = id();

    const job = {
      ...validedFormInput(data, jobFormProperties),
      id: `USER#${userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
      uuid,
      status: JobStatus.ACTIVE,
      isDeleted: false,
      createdAt: new Date(),
    } as IJob;

    await dynamo.saveItem(job);

    return job;
  },
};
