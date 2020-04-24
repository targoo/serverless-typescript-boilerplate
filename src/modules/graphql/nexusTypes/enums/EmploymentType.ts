import { enumType } from '@nexus/schema';

export const EmploymentType = enumType({
  name: 'EmploymentType',
  members: ['CONTRACT', 'PERMANENT'],
});
