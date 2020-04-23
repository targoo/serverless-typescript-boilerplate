import { queryType, stringArg } from 'nexus';

import { board, boards, followingBoards, job, jobs, me } from './queries';

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (_parent, { name }) => `Hello ${name || 'World'}!!!`,
    });

    // @ts-ignore
    t.field('me', me);

    // @ts-ignore
    t.field('board', board);

    // @ts-ignore
    t.list.field('boards', boards);

    // @ts-ignore
    t.list.field('followingBoards', followingBoards);

    // @ts-ignore
    t.field('job', job);

    // @ts-ignore
    t.list.field('jobs', jobs);
  },
});

export { Query };
