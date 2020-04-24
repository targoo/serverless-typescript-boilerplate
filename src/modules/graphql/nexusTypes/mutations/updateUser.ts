import { arg } from '@nexus/schema';

import { UserInputData } from '../args';
import { User, userFormProperties } from '../User';
import { IUser, IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';
import { MutationFieldType } from '../../types';

export const updateUser: MutationFieldType<'updateUser'> = {
  type: User,

  args: {
    data: arg({
      type: UserInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { data }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to update the user');
    }

    const key: IKeyBase = {
      id: `USER#${user.uuid}`,
      relation: `USER`,
    };

    const prepData = prepareFormInput(data, userFormProperties);

    const userFormPropertiesWithUpdateAt = [...Object.keys(prepData), 'updatedAt'];

    const UpdateExpression = userFormPropertiesWithUpdateAt.reduce((acc, cur, index) => {
      acc = index === 0 ? `${acc} #${cur} = :${cur}` : `${acc}, #${cur} = :${cur}`;
      return acc;
    }, 'set');

    const ExpressionAttributeNames = userFormPropertiesWithUpdateAt.reduce((acc, cur) => {
      acc[`#${cur}`] = cur;
      return acc;
    }, {});

    const ExpressionAttributeValues = userFormPropertiesWithUpdateAt.reduce((acc, cur) => {
      acc[`:${cur}`] = prepData[cur] || null;
      return acc;
    }, {});

    ExpressionAttributeValues[':updatedAt'] = JSON.stringify({ format: 'date', value: new Date().toISOString() });

    const params = {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };

    try {
      await dynamo.updateItem(params, key);
      const { Item } = await dynamo.getItem(key);
      const item = prepareResponseDate(Item) as IUser;

      return item;
    } catch (error) {
      logger.error(error);
      throw new Error('could not update the user');
    }
  },
};
