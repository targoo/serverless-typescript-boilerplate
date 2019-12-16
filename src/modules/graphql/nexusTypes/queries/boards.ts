import { Board } from '../Board';
import logger from '../../../../utils/logger';
import { sleep } from '../../../../utils/helper';

export const boards = {
  type: Board,

  resolve: async (_parent, _args, { userId, dynamo }) => {
    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: {
        '#uuid': 'uuid',
        '#title': 'title',
        '#status': 'status',
        '#id': 'id',
        '#relation': 'relation',
      },
      ExpressionAttributeValues: {
        ':userUUID': userId,
        ':relation': 'board-',
      },
      ProjectionExpression: ['#title', '#uuid', '#status'],
    };

    logger.debug(JSON.stringify(params));

    const { Items = [] } = await dynamo.query(params);

    sleep(5000);
    logger.debug(JSON.stringify(Items));

    return Items;
  },
};
