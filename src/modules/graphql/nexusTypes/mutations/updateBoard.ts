import { arg, idArg } from 'nexus';

import { BoardInputData } from '../args';
import { Board, boardFormProperties } from '../Board';
import { IBoard, IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const updateBoard = {
  type: Board,

  args: {
    uuid: idArg({
      required: true,
    }),
    data: arg({
      type: BoardInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { uuid, data }, { userId, dynamo }) => {
    if (!userId) {
      throw new Error('cannot archive the board');
    }

    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `BOARD#${uuid}`,
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

    logger.debug(JSON.stringify(params));

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IBoard } = await dynamo.getItem(key);
    logger.debug(`item: ${JSON.stringify(Item)}`);

    const item = prepareResponseDate(Item);
    logger.debug(`item: ${JSON.stringify(item)}`);

    return item;
  },
};
