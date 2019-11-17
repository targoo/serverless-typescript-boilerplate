import { arg, inputObjectType } from 'nexus';
import { v4 } from 'uuid';

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
    console.log('userId', userId);

    const uuid = v4();

    const board = {
      id: userId,
      relation: `board-${uuid}`,
      created: new Date().getTime(),
      uuid,
      title,
      status: 'ACTIVE',
    };

    await dynamo.saveItem(board);

    return {
      uuid: uuid,
      title: title,
      status: 'ACTIVE',
    };
  },
};
