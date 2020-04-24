import { enumType } from '@nexus/schema';

export const InterestLevel = enumType({
  name: 'InterestLevel',
  members: ['JUST_BROWSING', 'OPEN_TO_OPPORTUNITY', 'ACTIVELY_LOOKING'],
});
