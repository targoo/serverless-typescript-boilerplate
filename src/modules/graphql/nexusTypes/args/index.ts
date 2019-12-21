import { inputObjectType } from 'nexus';

export const BoardInput = inputObjectType({
  name: 'BoardInput',
  definition(t) {
    t.string('title', { required: true });
  },
});

export const BoardInputWhere = inputObjectType({
  name: 'BoardInputWhere',
  definition(t) {
    t.boolean('isDeleted');
  },
});

export const JobInput = inputObjectType({
  name: 'JobInput',
  definition(t) {
    t.string('title', { required: true });
  },
});
