import { inputObjectType } from 'nexus';

export const BoardInputData = inputObjectType({
  name: 'BoardInputData',
  definition(t) {
    t.string('title', { required: true });
  },
});

export const BoardInputWhere = inputObjectType({
  name: 'BoardInputWhere',
  definition(t) {
    t.boolean('isDeleted');
  },
});

export const JobInputData = inputObjectType({
  name: 'JobInputData',
  definition(t) {
    // Agency
    t.string('agencyName');
    t.string('agentName');
    t.string('agentEmail');
    t.string('agentPhone');
    // Job
    t.string('jobTitle');
    t.string('company');
    t.string('companyWebsite');
    t.string('companyLocation');
    t.string('jobDescription');
    // Money
    // @ts-ignore
    t.field('employmentType', { type: 'EmploymentType' });
    t.string('duration');
    t.string('rate');
    t.string('ir35');
    t.id('boardUuid', { required: true });
    t.field('status', { type: 'JobStatus' });
  },
});

export const JobInputWhere = inputObjectType({
  name: 'JobInputWhere',
  definition(t) {
    t.boolean('isDeleted');
    t.id('boardUuid', { required: true });
  },
});

export const UserInputData = inputObjectType({
  name: 'UserInputData',
  definition(t) {
    t.string('email', { required: false });
    t.string('name', { required: false });
  },
});
