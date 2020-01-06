import { queryType, stringArg } from 'nexus';

import { getBoards, getJobs } from './queries';

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (_parent, { name }) => `Hello ${name || 'World'}!!!`,
    });

    t.list.field('getBoards', getBoards);

    t.list.field('getJobs', getJobs);
  },
});

export { Query };
