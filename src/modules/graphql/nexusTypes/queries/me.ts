import { IUser } from '../../../../types/types';
import { prepareFormInput, prepareResponseDate } from '../utils/form';
import { User, userFormProperties } from '../User';
import logger from '../../../../utils/logger';

export const me = {
  type: User,

  resolve: async (_parent, _arg, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to get or create a user');
    }
    const { userId, nickname, email, state } = user;

    const key = {
      id: `USER#${userId}`,
      relation: `USER`,
    };

    const { Item } = await dynamo.getItem(key);

    if (Item) {
      const response = prepareResponseDate(Item);
      logger.debug(JSON.stringify(response));

      return response;
    } else {
      throw new Error('User not found');
    }
    // else {
    //   const user = ({
    //     ...prepareFormInput({ nickname: nickname || email, email }, userFormProperties),
    //     id: `USER#${userId}`,
    //     relation: `USER`,
    //     userId: JSON.stringify({ format: 'string', value: userId }),
    //     state: JSON.stringify({ format: 'string', value: state }),
    //     isDeleted: JSON.stringify({ format: 'boolean', value: false }),
    //     createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
    //   } as unknown) as IUser;

    //   logger.debug(JSON.stringify(user));
    //   await dynamo.saveItem(user);

    //   const response = prepareResponseDate(user);
    //   logger.debug(JSON.stringify(response));

    //   return response;
    // }
  },
};
