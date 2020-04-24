import { enumType } from '@nexus/schema';

export const Feeling = enumType({
  name: 'Feeling',
  members: ['ECSTATIC', 'HAPPY', 'NORMAL', 'SAD'],
});
