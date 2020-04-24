import { IUser } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const logout: MutationFieldType<'logout'> = {
  type: 'Boolean',

  // @ts-ignore
  resolve: async (_parent, _arg, { user, dynamo }) => {
    try {
      const key = {
        id: `USER#${user.uuid}`,
        relation: `USER`,
      };

      let { Item } = await dynamo.getItem(key);

      if (Item) {
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
      } else {
        logger.error('Could not find the user');
        return false;
      }
    } catch (error) {
      logger.error(error);
      return false;
    }
  },
};
