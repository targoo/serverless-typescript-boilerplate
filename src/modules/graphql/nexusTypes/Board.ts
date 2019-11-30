import { objectType } from 'nexus';

import { Job } from './Job';

export const Board = objectType({
  name: 'Board',
  description: 'This is a description of a Board',
  definition(t) {
    t.id('uuid');
    t.string('title');
    t.field('status', { type: 'BoardStatus' });
    t.list.field('jobs', {
      type: Job,
      nullable: true,
    });
  },
});
