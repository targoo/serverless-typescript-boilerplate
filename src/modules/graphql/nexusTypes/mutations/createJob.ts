import { arg, idArg } from 'nexus';

import { JobInputData } from '../args';
import { Job } from '../Job';
import { IJob, JobStatus } from '../../../../types/types';
import id from '../../../../utils/id';

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

  resolve: async (
    _parent,
    {
      boardUuid,
      data: {
        // Agency
        agencyName,
        agentName,
        agentEmail,
        agentPhone,
        // Job
        jobTitle,
        company,
        companyWebsite,
        companyLocation,
        jobDescription,
        // Money
        employmentType,
        duration,
        rate,
        ir35,
      },
    },
    { userId, dynamo },
  ) => {
    const uuid = id();

    const job: IJob = {
      id: `USER#${userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
      uuid,
      // Agency
      agencyName,
      agentName,
      agentEmail,
      agentPhone,
      // Job
      jobTitle,
      company,
      companyWebsite,
      companyLocation,
      jobDescription,
      // Money
      employmentType,
      duration,
      rate,
      ir35,
      // Extra
      status: JobStatus.ACTIVE,
      isDeleted: false,
      createdAt: new Date(),
    };

    await dynamo.saveItem(job);

    return job;
  },
};
