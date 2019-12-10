import { Board } from '../Board';
import logger from '../../../../utils/logger';

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

export const boards = {
  type: Board,

  resolve: async (_parent, _args, { userId, dynamo }) => {
    const params = {
      KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#relation': 'relation',
      },
      ExpressionAttributeValues: {
        ':userUUID': userId,
        ':relation': 'board-',
      },
    };
    logger.debug(JSON.stringify(params));

    const { Items = [] } = await dynamo.query(params);
    sleep(5000);

    return Items;
  },
};
