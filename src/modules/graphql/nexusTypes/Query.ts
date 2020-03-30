import { queryType, stringArg } from 'nexus';

import { board, boards, jobs, me } from './queries';

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (_parent, { name }) => `Hello ${name || 'World'}!!!`,
    });

    t.field('me', me);

    t.field('board', board);

    t.list.field('boards', boards);

    t.list.field('jobs', jobs);

    // // @ts-ignore
    // t.list.field('jobs', jobs);
  },
});

export { Query };
