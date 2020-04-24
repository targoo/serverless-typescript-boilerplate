import { enumType } from '@nexus/schema';

export const EducationLevel = enumType({
  name: 'EducationLevel',
  members: [
    'A_LEVELS_GNVQ',
    'BTEC',
    'CITY_GUILDS',
    'DIPLOMA',
    'GCSE_GNVQ_O_LEVELS',
    'HND_HNC',
    'MASTER_DEGREE_OR_HIGHER',
    'PHD',
    'SENIOR_BUSINESS_TECH_QUALIFICATION',
    'UNIVERSITY_DEGREE',
  ],
});
