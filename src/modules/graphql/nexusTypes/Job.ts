import { objectType } from 'nexus';

import { JobStatus } from './enums/JobStatus';
export const Job = objectType({
  name: 'Job',

  description: 'Job',

  definition(t) {
    t.id('uuid');
    t.string('title');
    t.field('status', { type: JobStatus });
    t.datetime('createdAt');
    t.datetime('updatedAt', { nullable: true });
    t.boolean('isDeleted');
  },
});
