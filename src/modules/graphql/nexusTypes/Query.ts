import { queryType, stringArg } from 'nexus';

import { board, boards, getJobs } from './queries';

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (_parent, { name }) => `Hello ${name || 'World'}!!!`,
    });

    t.field('board', board);

    t.list.field('boards', boards);

    t.list.field('getJobs', getJobs);
  },
});

export { Query };
