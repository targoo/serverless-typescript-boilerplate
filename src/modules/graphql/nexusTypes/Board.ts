import { objectType } from 'nexus';

import { Job } from './Job';

export const Board = objectType({
  name: 'Board',

  description: 'This is a description of a Board',

  definition(t) {
    t.id('uuid', { description: 'UUID of the user' });
    t.string('title');
    t.boolean('isDeleted');
    t.list.field('jobs', {
      type: Job,
      resolve(root, _args, _ctx) {
        console.log('root', root);
        return null;
      },
      nullable: true,
    });
  },
});
