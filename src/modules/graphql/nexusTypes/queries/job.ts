import { idArg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { Job } from '../Job';
import logger from '../../../../utils/logger';

const jobArgs = {
  userUuid: idArg({
    required: true,
    description: 'The id of the user',
  }),
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

  resolve: async (_parent, { userUuid, boardUuid, jobUuid }, { user, utils: { jobfactory } }) => {
    if (!user) {
      logger.error('Not authorized to get the job');
      throw new Error('Not authorized to get the job');
    }

    // Check permissions.
    if (userUuid !== user.uuid) {
      const isFollowing = await jobfactory.isFollowing(boardUuid, jobUuid, user.uuid);
      if (!isFollowing) {
        throw new Error('Cannot view this job');
      }
    }

    const permissions =
      userUuid === user.uuid ? ['VIEW', 'EDIT', 'ARCHIVE', 'INVITE', 'ADD_EVENT'] : ['VIEW', 'EDIT', 'ADD_EVENT'];
    try {
      const job = await jobfactory.get(userUuid, boardUuid, jobUuid);
      return { ...job, permissions };
    } catch (error) {
      logger.error(error);
      throw new Error('The job does not exist');
    }
  },
};
