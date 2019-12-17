import { queryType, stringArg } from 'nexus';

import { boards, jobs } from './queries';

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (_parent, { name }) => `Hello ${name || 'World'}!!!`,
    });

    t.list.field('boards', boards);

    t.list.field('jobs', jobs);
  },
});

export { Query };
