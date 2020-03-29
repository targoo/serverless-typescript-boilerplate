import { enumType } from 'nexus/dist';

export const JobType = enumType({
  name: 'JobType',
  members: ['CONTRACT', 'PERMANENT'],
});
