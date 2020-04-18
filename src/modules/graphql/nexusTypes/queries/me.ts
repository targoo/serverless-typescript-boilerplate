import { IUser } from '../../../../types/types';
import { prepareFormInput, prepareResponseDate } from '../utils/form';
import { User, userFormProperties } from '../User';
import logger from '../../../../utils/logger';

export const me = {
  type: User,

  resolve: async (_parent, _arg, { userId, userEmail, userName, dynamo }) => {
    if (!userId || !userEmail) {
      throw new Error('Not authorized to get or create a user');
    }

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
      const nickname = userName ? userName : userEmail;
      const user = ({
        ...prepareFormInput({ nickname, email: userEmail }, userFormProperties),
        id: `USER#${userId}`,
        relation: `USER`,
        uuid: JSON.stringify({ format: 'string', value: userId }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      } as unknown) as IUser;

      logger.debug(JSON.stringify(user));
      await dynamo.saveItem(user);

      const response = prepareResponseDate(user);
      logger.debug(JSON.stringify(response));

      return response;
    }
  },
};
