import { objectType } from 'nexus';

export const Job = objectType({
  name: 'Job',
  description: 'This is a description of a Job',
  definition(t) {
    t.id('uuid');
  },
});
