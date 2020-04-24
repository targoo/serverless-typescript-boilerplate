import { inputObjectType } from '@nexus/schema';

export const EmailInputData = inputObjectType({
  name: 'EmailInputData',
  definition(t) {
    t.string('email', { required: true });
    t.string('subject', { required: true });
    t.field('emailTemplate', { type: 'EmailTemplate', required: true });
    t.json('params');
    t.string('replyTo');
  },
});

export const BoardInputData = inputObjectType({
  name: 'BoardInputData',
  definition(t) {
    t.string('title', { required: true });
    t.string('description');
    t.date('availableDate');
    t.string('location');
    t.json('locationCoordinates');
    t.string('locationMain');
    t.string('locationSecondary');
    t.field('educationLevel', { type: 'EducationLevel' });
    t.field('interestLevel', { type: 'InterestLevel' });
    t.boolean('workRightEU');
    t.boolean('workRightUK');
    t.boolean('isDeleted');
  },
});

export const BoardInputWhere = inputObjectType({
  name: 'BoardInputWhere',
  definition(t) {
    t.boolean('isDeleted');
  },
});

export const BoardInputSort = inputObjectType({
  name: 'BoardInputSort',
  definition(t) {
    t.string('field');
    t.field('direction', { type: 'SortDirection' });
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
    t.string('referralFee');
    // Company
    t.string('company');
    t.string('companyWebsite');
    t.string('companyLocation');
    t.json('companyLocationCoordinates');
    t.string('companyLocationMain');
    t.string('companyLocationSecondary');
    // Job
    t.string('jobTitle');
    t.string('jobDescription');
    t.string('jobUrl');
    // Money
    t.field('employmentType', { type: 'EmploymentType' });
    t.field('remoteOption', { type: 'RemoteOption' });
    t.string('duration');
    t.string('rate');
    t.boolean('ir35');
    // Extra
    t.boolean('isDeleted');
    t.field('feeling', { type: 'Feeling' });
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
    t.string('nickname', { required: false });
  },
});

export const EventInputData = inputObjectType({
  name: 'EventInputData',
  definition(t) {
    t.datetime('startAt', { required: false });
    t.datetime('endAt', { required: false });
    t.field('type', { type: 'EventType', required: false });
    t.string('description', { required: false });
  },
});

export const EventInputWhere = inputObjectType({
  name: 'EventInputWhere',
  definition(t) {
    t.boolean('isDeleted');
    t.id('boardUuid', { required: true });
    t.id('jobUuid', { required: true });
  },
});
