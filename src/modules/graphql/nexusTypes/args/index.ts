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

export const JobInputData = inputObjectType({
  name: 'JobInputData',
  definition(t) {
    t.string('title', { required: true });
    t.id('boardUUID', { required: true });
  },
});

export const JobInputWhere = inputObjectType({
  name: 'JobInputWhere',
  definition(t) {
    t.boolean('isDeleted');
  },
});
