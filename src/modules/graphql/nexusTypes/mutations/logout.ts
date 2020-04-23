export const logout = {
  type: 'Boolean',

  resolve: async (_parent, _arg, { user, dynamo }) => {
    try {
      const key = {
        id: `USER#${user.userId}`,
        relation: `USER`,
      };

      const params = {
        UpdateExpression: 'set #state = :state, #updated = :updated',
        ExpressionAttributeNames: {
          '#state': 'state',
          '#updated': 'updated',
        },
        ExpressionAttributeValues: {
          ':state': JSON.stringify({ format: 'string', value: '' }),
          ':updated': JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
        },
      };
      await dynamo.updateItem(params, key);
      return true;
    } catch (error) {
      return false;
    }
  },
};
