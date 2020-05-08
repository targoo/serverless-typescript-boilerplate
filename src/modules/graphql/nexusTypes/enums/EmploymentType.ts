import { enumType } from '@nexus/schema';

export const EmploymentType = enumType({
  name: 'EmploymentType',
  members: ['CONTRACT', 'PERMANENT_PART_TIME', 'PERMANENT_FULL_TIME', 'INTERNSHIP', 'TEMPORARY'],
});
