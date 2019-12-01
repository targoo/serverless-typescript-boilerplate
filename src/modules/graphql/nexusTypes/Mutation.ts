import { objectType } from 'nexus';

import { createBoard, updateBoard, cancelBoard } from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createBoard', createBoard);
    t.field('updateBoard', updateBoard);
    t.field('cancelBoard', cancelBoard);
  },
});
