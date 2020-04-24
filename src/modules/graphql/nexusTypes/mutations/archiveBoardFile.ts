import { idArg, booleanArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { File } from '../File';
import { IFile, IKeyBase } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

export const archiveBoardFile: MutationFieldType<'archiveBoardFile'> = {
  type: File,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    fileUuid: idArg({
      required: true,
    }),
    isDeleted: booleanArg(),
  },

  // @ts-ignore
  resolve: async (_parent, { boardUuid, fileUuid, isDeleted = true }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to archive the board file');
    }

    const key: IKeyBase = {
      id: `USER#${user.uuid}`,
      relation: `FILE#BOARD#${boardUuid}#${fileUuid}`,
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

      const item = prepareResponseDate(Item) as IFile;
      return item;
    } catch (error) {
      logger.error(error);
      throw new Error('Could not archive the file');
    }
  },
};
