import { arg, idArg } from '@nexus/schema';

import { JobInputData } from '../args';
import { Job } from '../Job';
import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const updateJob: MutationFieldType<'updateJob'> = {
  type: Job,

  args: {
    userUuid: idArg({
      required: true,
    }),
    boardUuid: idArg({
      required: true,
    }),
    jobUuid: idArg({
      required: true,
    }),
    data: arg({
      type: JobInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { userUuid, boardUuid, jobUuid, data }, { user, utils: { jobfactory } }) => {
    if (!user) {
      logger.error('Not authorized to update the job');
      throw new Error('Not authorized to update the job');
    }

    // Check permissions
    if (userUuid !== user.uuid) {
      const isFollowing = await jobfactory.isFollowing(boardUuid, jobUuid, user.uuid);
      if (!isFollowing) {
        logger.error('Cannot update a job for this board');
        throw new Error('Cannot update a job for this board');
      }
    }

    try {
      return await jobfactory.update(userUuid, boardUuid, jobUuid, data);
    } catch (error) {
      logger.error(error);
      throw new Error('Could not update the board');
    }
  },
};
