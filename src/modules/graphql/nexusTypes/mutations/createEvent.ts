import { arg, idArg } from 'nexus';

import { EventInputData } from '../args';
import { Event, eventFormProperties } from '../Event';
import { IEvent } from '../../../../types/types';
import id from '../../../../utils/id';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const createEvent = {
  type: Event,

  args: {
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

  resolve: async (_parent, { boardUuid, jobUuid, data }, { userId, dynamo }) => {
    if (!userId) {
      throw new Error('Not authorized to create a new event');
    }

    const uuid = id();

    const event = ({
      ...prepareFormInput(data, eventFormProperties),
      id: `USER#${userId}`,
      relation: `EVENT#BOARD#${boardUuid}#JOB#${jobUuid}#${uuid}`,
      uuid: JSON.stringify({ format: 'string', value: uuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
    } as unknown) as IEvent;

    logger.debug(JSON.stringify(event));
    await dynamo.saveItem(event);

    const response = prepareResponseDate(event);
    logger.debug(JSON.stringify(response));

    return event;
  },
};
