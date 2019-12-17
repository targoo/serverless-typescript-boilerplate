import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('uuid');
    t.string('username');
    t.string('email');
  },
});
