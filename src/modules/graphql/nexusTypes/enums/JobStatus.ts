import { enumType } from 'nexus/dist';

export const JobStatus = enumType({
  name: 'JobStatus',
  members: [
    'STARTED',
    'PHONE_CALL',
    'FIRST_STAGE_INTERVIEW',
    'SECOND_STAGE_INTERVIEW',
    'LAST_STAGE_INTERVIEW',
    'FACE2FACE',
    'TECH_TEST',
    'OFFER',
    'ARCHIVED',
  ],
});
