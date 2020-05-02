import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const logout: MutationFieldType<'logout'> = {
  type: 'Boolean',

  resolve: async (_parent, _arg, { user, utils: { userfactory } }) => {
    try {
      const userExist = await userfactory.get(user.uuid);

      if (userExist) {
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
        await userfactory.update(user.uuid, params);
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
