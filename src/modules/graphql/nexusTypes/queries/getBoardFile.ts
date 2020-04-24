import { idArg, booleanArg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { Board } from '../Board';
import { IKeyBase } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import logger from '../../../../utils/logger';

export const getBoardFile: QueryFieldType<'archiveBoard'> = {
  type: Board,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    isDeleted: booleanArg(),
  },

  resolve: async (_parent, { boardUuid, isDeleted = true }, { user, dynamo }) => {
    if (!user) {
      throw new Error("Not authorized to get the board's files");
    }

    const key: IKeyBase = {
      id: `USER#${user.uuid}`,
      relation: `BOARD#${boardUuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updatedAt': 'updatedAt' },
      ExpressionAttributeValues: {
        ':isDeleted': JSON.stringify({ format: 'boolean', value: isDeleted }),
        ':updatedAt': JSON.stringify({ format: 'date', value: new Date().toISOString() }),
      },
    };

    await dynamo.updateItem(params, key);

    const { Item } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
