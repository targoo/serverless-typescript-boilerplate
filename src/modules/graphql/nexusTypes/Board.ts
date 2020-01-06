import { objectType } from 'nexus';

import { Job } from './Job';

export const Board = objectType({
  name: 'Board',

  description: 'Board',

  definition(t) {
    t.id('uuid', { description: 'UUID of the user' });
    t.string('title');
    t.datetime('createdAt');
    t.datetime('updatedAt', { nullable: true });
    t.boolean('isDeleted');
    t.time('time', { nullable: true });
    t.date('date', { nullable: true });
    t.json('json', { nullable: true });
    t.list.field('jobs', {
      type: Job,
      // resolve: (character) => getFriends(character),
      resolve(root, _args, _ctx) {
        // console.log('root', root);
        return null;
      },
      nullable: true,
    });
  },
});
