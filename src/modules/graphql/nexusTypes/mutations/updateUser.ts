import { arg } from 'nexus';

import { UserInputData } from '../args';
import { User, userFormProperties } from '../User';
import { IUser, IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const updateUser = {
  type: User,

  args: {
    data: arg({
      type: UserInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { data }, { userId, dynamo }) => {
    if (!userId) {
      throw new Error('Not authorized to update the user');
    }

    const key: IKeyBase = {
      id: `USER#${userId}`,
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

    logger.debug(JSON.stringify(params));

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IUser } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
