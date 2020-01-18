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
    t.string('company', { required: false });
    t.string('duration', { required: false });
    t.string('rate', { required: false });
    t.string('location', { required: false });
    t.string('position', { required: false });
    t.id('boardUUID', { required: true });
    t.field('status', {
      type: 'JobStatus',
      required: true,
    });
  },
});

export const JobInputWhere = inputObjectType({
  name: 'JobInputWhere',
  definition(t) {
    t.boolean('isDeleted');
    t.id('boardUUID', { required: true });
  },
});
