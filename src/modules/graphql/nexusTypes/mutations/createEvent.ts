import { arg, idArg } from 'nexus';

import { EventInputData } from '../args';
import { Event, eventFormProperties } from '../Event';
import { IEvent } from '../../../../types/types';
import id from '../../../../utils/id';

function validedFormInput(myObj: string, validKeys: string[]) {
  return Object.keys(myObj)
    .filter((key) => validKeys.includes(key))
    .reduce((result, current) => {
      result[current] = myObj[current] || null;
      return result;
    }, {});
}

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
    const uuid = id();

    const event = {
      ...validedFormInput(data, eventFormProperties),
      id: `USER#${userId}`,
      relation: `EVENT#JOB#BOARD#${boardUuid}#${jobUuid}#${uuid}`,
      uuid,
      isDeleted: false,
      createdAt: new Date(),
    } as IEvent;

    await dynamo.saveItem(event);

    return event;
  },
};
