import { arg, idArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { EventInputData } from '../args';
import { Event, eventFormProperties } from '../Event';
import { IEvent } from '../../../../types/types';
import id from '../../../../utils/id';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const createEvent: MutationFieldType<'createEvent'> = {
  type: Event,

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
      type: EventInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { userUuid, boardUuid, jobUuid, data }, { user, utils: { jobfactory, eventfactory } }) => {
    if (!user) {
      logger.error('Not authorized to create a new event');
      throw new Error('Not authorized to create a new event');
    }

    // Check permissions.
    if (userUuid !== user.uuid) {
      const isFollowing = await jobfactory.isFollowing(boardUuid, jobUuid, user.uuid);
      if (!isFollowing) {
        logger.error('Cannot create an event for this job');
        throw new Error('Cannot create an event for this job');
      }
    }

    return await eventfactory.create(userUuid, boardUuid, jobUuid, data, user.uuid);
  },
};
