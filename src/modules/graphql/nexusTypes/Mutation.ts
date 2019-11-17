import { objectType } from 'nexus';

import { createBoard } from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createBoard', createBoard);
  },
});
