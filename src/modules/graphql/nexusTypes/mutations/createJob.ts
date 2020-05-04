import { arg, idArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { JobInputData } from '../args';
import { Job } from '../Job';
import { JobStatus, Feeling } from '../../../../types/types';
import logger from '../../../../utils/logger';

export const createJob: MutationFieldType<'createJob'> = {
  type: Job,

  args: {
    userUuid: idArg({
      required: true,
    }),
    boardUuid: idArg({
      required: true,
    }),
    data: arg({
      type: JobInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { userUuid, boardUuid, data }, { user, utils: { boardfactory, jobfactory } }) => {
    if (!user) {
      logger.error('Not authorized to create a new job');
      throw new Error('Not authorized to create a new job');
    }

    // Check permissions.
    if (userUuid !== user.uuid) {
      const isFollowing = await boardfactory.isFollowing(boardUuid, user.uuid);
      if (!isFollowing) {
        logger.error('Cannot create a job for this board');
        throw new Error('Cannot create a job for this board');
      }
    }

    const job = await jobfactory.create(userUuid, boardUuid, {
      ...data,
      status: JobStatus.STARTED,
      feeling: Feeling.NORMAL,
    });

    // If a user create a job for someone else, we need to record that permission.
    if (userUuid !== user.uuid) {
      jobfactory.follow(userUuid, boardUuid, job.uuid, user.uuid);
    }

    return job;
  },
};
