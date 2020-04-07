import { enumType } from 'nexus/dist';

export const Feeling = enumType({
  name: 'Feeling',
  members: ['ECSTATIC', 'HAPPY', 'NORMAL', 'SAD'],
});
