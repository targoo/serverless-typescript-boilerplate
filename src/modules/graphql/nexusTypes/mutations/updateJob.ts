import { arg, idArg } from 'nexus';

import { JobInputData } from '../args';
import { IJob, IKeyBase } from '../../../../types/types';

export const updateJob = {
  type: 'Job' as 'Job',

  args: {
    boardUuid: idArg({
      required: true,
    }),
    uuid: idArg({
      required: true,
    }),
    data: arg({ type: JobInputData }),
  },

  resolve: async (_parent, { boardUuid, uuid, data }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
    };

    // const params = {
    //   UpdateExpression: 'set #jobTitle = :jobTitle, #updatedAt = :updatedAt',
    //   ExpressionAttributeNames: { '#jobTitle': 'jobTitle', '#updatedAt': 'updatedAt' },
    //   ExpressionAttributeValues: {
    //     ':jobTitle': jobTitle,
    //     ':updatedAt': new Date().toISOString(),
    //   },
    // };

    // await dynamo.updateItem(params, key);

    const { Item }: { Item: IJob } = await dynamo.getItem(key);
    Item.createdAt = new Date(Item.createdAt);
    Item.updatedAt = new Date(Item.updatedAt);

    return Item;
  },
};
