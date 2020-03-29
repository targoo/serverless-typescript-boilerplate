import { arg } from 'nexus';

import { JobInputData } from '../args';
import { Job } from '../Job';
import { IJob, JobStatus } from '../../../../types/types';
import id from '../../../../utils/id';

export const createJob = {
  type: Job,

  args: {
    data: arg({
      type: JobInputData,
      required: true,
    }),
  },

  resolve: async (
    _parent,
    {
      data: {
        boardUUID,
        agency_name,
        agent_name,
        agent_email,
        agent_phone,
        job_title,
        type,
        company,
        company_website,
        company_location,
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
      relation: `JOB#BOARD#${boardUUID}#${uuid}`,
      uuid,
      agency_name,
      agent_name,
      agent_email,
      agent_phone,
      job_title,
      type,
      company,
      company_website,
      company_location,
      duration,
      rate,
      ir35,
      status: JobStatus.ACTIVE,
      isDeleted: false,
      createdAt: new Date(),
    };

    await dynamo.saveItem(job);

    return job;
  },
};
