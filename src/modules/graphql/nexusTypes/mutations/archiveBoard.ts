import { idArg } from 'nexus';

import { Board } from '../Board';
import { IBoard, IKeyBase } from '../../../../types/types';

export const archiveBoard = {
  type: Board,

  args: {
    uuid: idArg({
      required: true,
    }),
  },

  resolve: async (_parent, { uuid }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `BOAD#${uuid}`,
    };

    const params = {
      UpdateExpression: 'set #isDeleted = :isDeleted, #updated = :updated',
      ExpressionAttributeNames: { '#isDeleted': 'isDeleted', '#updated': 'updated' },
      ExpressionAttributeValues: {
        ':isDeleted': true,
        ':updated': new Date(),
      },
    };

    const { Attributes } = await dynamo.updateItem(params, key);

    return Attributes as IBoard;
  },
};
