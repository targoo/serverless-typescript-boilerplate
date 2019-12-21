import { inputObjectType } from 'nexus';

export const BoardInputData = inputObjectType({
  name: 'BoardInputData',
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
