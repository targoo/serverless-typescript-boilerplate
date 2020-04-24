import { idArg, booleanArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { Job } from '../Job';
import { IJob, IKeyBase } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
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

  // @ts-ignore
  resolve: async (_parent, { boardUuid, jobUuid, isDeleted = true }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to archive the job');
    }

    const key: IKeyBase = {
      id: `USER#${user.uuid}`,
      relation: `JOB#BOARD#${boardUuid}#${jobUuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': JSON.stringify({ format: 'boolean', value: isDeleted }),
        ':updatedAt': JSON.stringify({ format: 'date', value: new Date().toISOString() }),
      },
    };

    try {
      await dynamo.updateItem(params, key);
      const { Item } = await dynamo.getItem(key);

      const item = prepareResponseDate(Item) as IJob;
      return item;
    } catch (error) {
      logger.error(error);
      throw new Error('Could not archive the job');
    }
  },
};
