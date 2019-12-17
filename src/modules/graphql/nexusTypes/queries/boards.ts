import { booleanArg } from 'nexus';

import { Board } from '../Board';
import { IBoard } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { sleep } from '../../../../utils/helper';

export const boards = {
  type: Board,

  args: { isDeleted: booleanArg() },

  resolve: async (_parent, args: Partial<IBoard>, { userId, dynamo }) => {
    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: {
        '#uuid': 'uuid',
        '#title': 'title',
        '#status': 'status',
        '#created': 'created',
        '#updated': 'updated',
        '#id': 'id',
        '#relation': 'relation',
      },
      ExpressionAttributeValues: {
        ':userUUID': userId,
        ':relation': 'board-',
      },
      ProjectionExpression: ['#title', '#uuid', '#status', '#created', '#updated', 'isDeleted'],
    };
    logger.debug(JSON.stringify(params));

    let { Items: items }: { Items: IBoard[] } = await dynamo.query(params);

    if (args.isDeleted !== undefined) {
      items = items.filter(item => item.isDeleted === args.isDeleted);
    }

    sleep(5000);
    logger.debug(JSON.stringify(items));

    return items;
  },
};
