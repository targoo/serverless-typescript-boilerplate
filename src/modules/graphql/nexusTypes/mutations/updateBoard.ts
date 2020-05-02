import { arg, idArg } from '@nexus/schema';

import { BoardInputData } from '../args';
import { Board, boardFormProperties } from '../Board';
import logger from '../../../../utils/logger';
import { prepareFormInput } from '../utils/form';
import { MutationFieldType } from '../../types';

export const updateBoard: MutationFieldType<'updateBoard'> = {
  type: Board,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    data: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { boardUuid, data }, { user, dynamo, utils: { boardfactory } }) => {
    if (!user) {
      logger.error('Not authorized to update the board');
      throw new Error('Not authorized to update the board');
    }

    const prepData = prepareFormInput(data, boardFormProperties);

    const boardFormPropertiesWithUpdateAt = [...Object.keys(prepData), 'updatedAt'];

    const UpdateExpression = boardFormPropertiesWithUpdateAt.reduce((acc, cur, index) => {
      acc = index === 0 ? `${acc} #${cur} = :${cur}` : `${acc}, #${cur} = :${cur}`;
      return acc;
    }, 'set');

    const ExpressionAttributeNames = boardFormPropertiesWithUpdateAt.reduce((acc, cur) => {
      acc[`#${cur}`] = cur;
      return acc;
    }, {});

    const ExpressionAttributeValues = boardFormPropertiesWithUpdateAt.reduce((acc, cur) => {
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
      await boardfactory.update(user.uuid, boardUuid, params);
      return boardfactory.get(user.uuid, boardUuid);
    } catch (error) {
      logger.error(error);
      throw new Error('Could not update the board');
    }
  },
};
