import { enumType } from 'nexus/dist';

export const EmploymentType = enumType({
  name: 'EmploymentType',
  members: ['CONTRACT', 'PERMANENT'],
});
