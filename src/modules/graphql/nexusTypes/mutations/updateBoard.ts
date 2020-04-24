import { arg, idArg } from '@nexus/schema';

import { BoardInputData } from '../args';
import { Board, boardFormProperties } from '../Board';
import { IBoard, IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';
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

  // @ts-ignore
  resolve: async (_parent, { boardUuid, data }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to update the board');
    }

    const key: IKeyBase = {
      id: `USER#${user.uuid}`,
      relation: `BOARD#${boardUuid}`,
    };

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
      await dynamo.updateItem(params, key);

      const { Item } = await dynamo.getItem(key);
      logger.debug(`item: ${JSON.stringify(Item)}`);

      const item = prepareResponseDate(Item) as IBoard;
      logger.debug(`item: ${JSON.stringify(item)}`);

      return item;
    } catch (error) {
      logger.error(error);
      throw new Error('Could not update the board');
    }
  },
};
