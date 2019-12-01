import { objectType } from 'nexus';

import { JobStatus } from './enums/JobStatus';

export const Job = objectType({
  name: 'Job',
  description: 'This is a description of a Job',
  definition(t) {
    t.id('uuid');
    t.field('status', { type: JobStatus });
  },
});
