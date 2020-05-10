import { objectType } from '@nexus/schema';

export const userFormProperties = {
  nickname: 'string',
  email: 'string',
  state: 'string',
  isDeleted: 'boolean',
};

export const userProperties = {
  ...userFormProperties,
  id: 'key',
  relation: 'key',
  uuid: 'string',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('uuid', { description: 'Unique Id of the user based on the email' });

    t.string('nickname', { nullable: true });

    t.string('name', { nullable: true });

    t.boolean('isEmailVerified');

    t.string('email');

    t.string('state', { nullable: true });

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');
  },
});
