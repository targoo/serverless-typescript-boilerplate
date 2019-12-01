import { queryType, stringArg } from 'nexus';
import { Board } from './Board';

import { board, boards } from './queries';

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (_parent, { name }) => `Hello ${name || 'World'}!!!`,
    });

    // t.field('board', board);

    t.list.field('boards', boards);
  },
});

export { Query };
