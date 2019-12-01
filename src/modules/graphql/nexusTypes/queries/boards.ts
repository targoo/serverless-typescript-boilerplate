import { Board } from '../Board';

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

    const { Items = [] } = await dynamo.query(params);

    return Items;
  },
};
