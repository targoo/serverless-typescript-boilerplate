import { enumType } from 'nexus/dist';

export const BoardStatus = enumType({
  name: 'BoardStatus',
  members: ['ACTIVE', 'ARCHIVED'],
});
