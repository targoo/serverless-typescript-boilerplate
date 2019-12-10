import { objectType } from 'nexus';

import { createBoard, updateBoard, archiveBoard } from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createBoard', createBoard);
    t.field('updateBoard', updateBoard);
    t.field('archiveBoard', archiveBoard);
  },
});
