import { arg, inputObjectType } from 'nexus';

import { Board, BoardStatus } from '../../../../types';
import id from '../../../../utils/id';

const CreateBoardInput = inputObjectType({
  name: 'CreateBoardInput',
  definition(t) {
    t.string('title', { required: true });
  },
});

export default {
  type: 'Board' as 'Board',
  args: {
    input: arg({
      type: CreateBoardInput,
      required: true,
    }),
  },
  resolve: async (_parent, { input: { title } }, { userId, dynamo }) => {
    const uuid = id();

    const board: Board = {
      id: userId,
      relation: `board-${uuid}`,
      created: new Date().getTime(),
      uuid,
      title,
      status: BoardStatus.ACTIVE,
    };

    await dynamo.saveItem(board);

    return {
      uuid: uuid,
      title: title,
      status: BoardStatus.ACTIVE,
    };
  },
};
