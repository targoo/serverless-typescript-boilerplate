import { objectType } from 'nexus';

import { createBoard, updateBoard, archiveBoard } from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createBoard', createBoard);
    // @ts-ignore
    //t.field('updateBoard', updateBoard);
    // @ts-ignore
    //t.field('archiveBoard', archiveBoard);
  },
});
