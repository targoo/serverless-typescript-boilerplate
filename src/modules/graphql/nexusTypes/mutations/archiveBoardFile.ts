import { idArg } from 'nexus';

import { File } from '../File';
import { IFile, IKeyBase } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

export const archiveBoardFile = {
  type: File,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    uuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { boardUuid, uuid }, { userId, dynamo }) => {
    if (!userId) {
      throw new Error('Not authorized to archive the job');
    }

    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `FILE#BOARD#${boardUuid}#${uuid}`,
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

    const { Item }: { Item: IFile } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
