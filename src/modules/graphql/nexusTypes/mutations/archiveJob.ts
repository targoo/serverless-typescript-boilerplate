import { idArg } from 'nexus';

import { Job } from '../Job';
import { IJob, IKeyBase } from '../../../../types/types';

export const archiveJob = {
  type: Job,

  args: {
    boardUUID: idArg({
      required: true,
    }),
    uuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { boardUUID, uuid }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `JOB#BOARD#${boardUUID}#${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': true,
        ':updatedAt': new Date().toISOString(),
      },
    };

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IJob } = await dynamo.getItem(key);
    Item.createdAt = new Date(Item.createdAt);
    Item.updatedAt = new Date(Item.updatedAt);

    return Item;
  },
};
