import { enumType } from '@nexus/schema';

export const SortDirection = enumType({
  name: 'SortDirection',
  members: ['ASC', 'DESC'],
});
