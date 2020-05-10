import { arg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { JobInputWhere } from '../args';
import { Job } from '../Job';
import logger from '../../../../utils/logger';

export const jobs: QueryFieldType<'jobs'> = {
  type: Job,

  args: {
    where: arg({
      type: JobInputWhere,
      required: true,
    }),
  },

  resolve: async (_parent, { where: { userUuid, boardUuid, isDeleted } = {} }, { user, utils: { jobfactory } }) => {
    if (!user) {
      logger.error('Not authorized to list the jobs');
      throw new Error('Not authorized to list the jobs');
    }

    if (userUuid === user.uuid) {
      let jobs = await jobfactory.list(userUuid, boardUuid);

      const permissions = ['VIEW', 'EDIT', 'ARCHIVE', 'INVITE', 'ADD_EVENT'];

      jobs = jobs.map((item) => ({ ...item, permissions })).filter((item) => item.isDeleted === isDeleted || false);

      return jobs;
    } else {
      let jobs = await jobfactory.followingList(user.uuid, boardUuid);

      const permissions = ['VIEW', 'EDIT', 'ADD_EVENT'];

      jobs = jobs.map((item) => ({ ...item, permissions })).filter((item) => item.isDeleted === isDeleted || false);

      return jobs;
    }
  },
};
