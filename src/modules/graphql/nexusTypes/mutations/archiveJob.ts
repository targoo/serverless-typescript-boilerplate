import { idArg } from 'nexus';

import { Job } from '../Job';
import { IJob, IKeyBase } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

export const archiveJob = {
  type: Job,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    uuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { boardUuid, uuid }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to archive the job');
    }

    const key: IKeyBase = {
      id: `USER#${user.userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': JSON.stringify({ format: 'boolean', value: true }),
        ':updatedAt': JSON.stringify({ format: 'date', value: new Date().toISOString() }),
      },
    };

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IJob } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
