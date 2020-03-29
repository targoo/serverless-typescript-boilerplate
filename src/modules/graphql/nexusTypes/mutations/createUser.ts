import { arg } from 'nexus';

import { UserInputData } from '../args';
import { User } from '../User';
import { IUser } from '../../../../types/types';

export const createUser = {
  type: User,

  args: {
    data: arg({
      // @ts-ignore
      type: UserInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { data: { email, name } }, { userId, dynamo }) => {
    const user: IUser = {
      id: `USER#${userId}`,
      relation: `USER`,
      uuid: userId,
      name,
      email,
      isDeleted: false,
      createdAt: new Date(),
    };

    await dynamo.saveItem(user);

    return user;
  },
};
