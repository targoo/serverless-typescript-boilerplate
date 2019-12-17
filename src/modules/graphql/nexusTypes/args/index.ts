import { inputObjectType } from 'nexus';

export const BoardInput = inputObjectType({
  name: 'BoardInput',
  definition(t) {
    t.string('title', { required: true });
  },
});

export const JobInput = inputObjectType({
  name: 'BoardInput',
  definition(t) {
    t.string('title', { required: true });
  },
});
