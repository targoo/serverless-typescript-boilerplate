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
    t.string('agencyName');
    t.string('agentName');
    t.string('agentEmail');
    t.string('agentPhone');
    t.string('jobTitle');
    t.string('company');
    t.string('companyWebsite');
    t.string('companyLocation');
    t.string('jobDescription');
    // t.field('JobType', {
    //   type: 'jobType',
    //   required: true,
    // });
    t.string('duration');
    t.string('rate');
    t.string('ir35');
    t.id('boardUUID', { required: true });
    t.field('status', {
      type: 'JobStatus',
      required: true,
    });
  },
});

export const JobInputWhere = inputObjectType({
  name: 'JobInputWhere',
  definition(t) {
    t.boolean('isDeleted');
    t.id('boardUUID', { required: true });
  },
});

export const UserInputData = inputObjectType({
  name: 'UserInputData',
  definition(t) {
    t.string('email', { required: false });
    t.string('name', { required: false });
  },
});
