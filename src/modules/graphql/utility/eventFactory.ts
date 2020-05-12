import { prepareResponseDate, prepareFormInput } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';
import { NexusGenRootTypes } from '../generated/nexus';
import { fileProperties, fileFormProperties } from '../nexusTypes/File';
import { IKeyBase } from '../../../types/types';
import { eventFormProperties } from '../nexusTypes/Event';
import id from '../../../utils/id';

export interface EventUtils {
  key: (userUuid: string, boardUuid: string, jobUuid: string, eventUuid: string) => IKeyBase;
  create: (
    userUuid: string,
    boardUuid: string,
    jobUuid: string,
    event: Partial<NexusGenRootTypes['Event']>,
    createByUuid: string,
  ) => Promise<NexusGenRootTypes['Event']>;
  get: (
    userUuid: string,
    boardUuid: string,
    jobUuid: string,
    eventUuid: string,
  ) => Promise<NexusGenRootTypes['Event'] | null>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const EventUtilityFactory: UtilityFactory<EventUtils> = ({ dynamo }) => ({
  key(userUuid, boardUuid, jobUuid, eventUuid) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `EVENT#BOARD#${boardUuid}#JOB#${jobUuid}#${eventUuid}`,
    };
    return key;
  },

  async create(userUuid, boardUuid, jobUuid, event, createByUuid) {
    const eventUuid = id();

    await dynamo.saveItem({
      ...prepareFormInput(event, eventFormProperties),
      ...this.key(userUuid, boardUuid, jobUuid, eventUuid),
      uuid: JSON.stringify({ format: 'string', value: eventUuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      createdBy: JSON.stringify({ format: 'string', value: createByUuid }),
    });

    return this.get(userUuid, boardUuid, jobUuid, eventUuid);
  },

  async get(userUuid, boardUuid, jobUuid, eventUuid) {
    const { Item } = await dynamo.getItem(this.key(userUuid, boardUuid, jobUuid, eventUuid));
    if (Item) {
      return prepareResponseDate(Item) as NexusGenRootTypes['Event'];
    } else {
      return null;
    }
  },
});
