import { objectType, enumType } from 'nexus';

import { Job } from './Job';

const BoardStatus = enumType({
  name: 'BoardStatus',
  members: ['ACTIVE', 'ARCHIVED'],
});

export const Board = objectType({
  name: 'Board',
  description: 'This is a description of a Board',
  definition(t) {
    t.id('uuid');
    t.string('title');
    t.field('status', { type: BoardStatus });
    t.list.field('jobs', {
      type: Job,
      nullable: true,
    });
  },
});
