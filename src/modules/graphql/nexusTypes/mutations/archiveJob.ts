import { idArg, booleanArg } from '@nexus/schema';
import { MutationFieldType } from '../../types';
import { Job } from '../Job';
import logger from '../../../../utils/logger';

export const archiveJob: MutationFieldType<'archiveJob'> = {
  type: Job,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    jobUuid: idArg({
      required: true,
    }),
    isDeleted: booleanArg(),
  },

  resolve: async (_parent, { boardUuid, jobUuid, isDeleted = true }, { user, utils: { jobfactory } }) => {
    if (!user) {
      logger.error('Not authorized to archive the job');
      throw new Error('Not authorized to archive the job');
    }

    const data = {
      isDeleted,
    };

    try {
      return await jobfactory.update(user.uuid, boardUuid, jobUuid, data);
    } catch (error) {
      logger.error(error);
      throw new Error('Could not archive the board');
    }
  },
};
