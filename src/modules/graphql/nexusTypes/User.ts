import { objectType } from 'nexus';

export const userFormProperties = {
  name: 'string',
  isDeleted: 'boolean',
};

export const userProperties = {
  ...userFormProperties,
  id: 'key',
  relation: 'key',
  email: 'email',
  uuid: 'string',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('name');

    t.string('email');

    t.id('uuid', { description: 'UUID of the user (Cognito Sub)' });

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');
  },
});
