import { QueryFieldType } from '../../types';
import { IUser } from '../../../../types/types';
import { prepareResponseDate } from '../utils/form';
import { User } from '../User';
import logger from '../../../../utils/logger';

export const me: QueryFieldType<'me'> = {
  type: User,

  resolve: async (_parent, _arg, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to get or create a user');
    }
    const { uuid, state } = user;

    const key = {
      id: `USER#${uuid}`,
      relation: `USER`,
    };

    const { Item } = await dynamo.getItem(key);

    if (Item) {
      const response = prepareResponseDate(Item) as IUser;

      if (response.state === state) {
        return response;
      } else {
        logger.error('User has been logout');
        throw new Error('User has been logout');
      }
    } else {
      logger.error('User not found');
      throw new Error('User not found');
    }
  },
};
