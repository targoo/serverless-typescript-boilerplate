import { objectType } from 'nexus';

import { createBoard, updateBoard } from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createBoard', createBoard);
    // @ts-ignore
    t.field('updateBoard', updateBoard);
  },
});
