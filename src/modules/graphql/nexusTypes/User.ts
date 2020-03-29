import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('uuid', { description: 'UUID of the user (Cognito Sub)' });

    t.string('email');

    t.string('name');

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');
  },
});
