import { objectType } from 'nexus';

export const userFormProperties = {
  nickname: 'string',
  email: 'string',
  isDeleted: 'boolean',
};

export const userProperties = {
  ...userFormProperties,
  id: 'key',
  relation: 'key',
  userId: 'string',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('userId', { description: 'Unique Id of the user based on the email' });

    t.string('nickname');

    t.string('email');

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');
  },
});
