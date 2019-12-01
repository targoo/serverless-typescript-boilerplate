import { enumType } from 'nexus/dist';

export const JobStatus = enumType({
  name: 'JobStatus',
  members: ['ACTIVE', 'ARCHIVED'],
});
