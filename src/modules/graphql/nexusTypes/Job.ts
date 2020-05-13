import { objectType } from '@nexus/schema';

import logger from '../../../utils/logger';
import { prepareResponseDate } from './utils/form';
import { IEvent } from '../../../types/types';
import { Event, eventProperties } from './Event';
import { Board } from './Board';
import { EmploymentType, Feeling, JobStatus, RemoteOption } from './enums';
import { User } from './User';

export const jobFormProperties = {
  agencyName: 'string',
  agentName: 'string',
  agentEmail: 'string',
  agentPhone: 'string',
  referralFee: 'string',
  jobTitle: 'string',
  company: 'string',
  companyWebsite: 'string',
  companyLocation: 'string',
  companyLocationCoordinates: 'json',
  companyLocationMain: 'string',
  companyLocationSecondary: 'string',
  jobDescription: 'string',
  jobUrl: 'string',
  employmentType: 'string',
  remoteOption: 'string',
  duration: 'string',
  rate: 'string',
  ir35: 'boolean',
  feeling: 'string',
  status: 'string',
  isDeleted: 'boolean',
};

export const jobProperties = {
  ...jobFormProperties,
  id: 'key',
  relation: 'key',
  uuid: 'string',
  createdAt: 'datetime',
  createdBy: 'string',
  updatedAt: 'datetime',
};

export const followingJobProperties = {
  id: 'key',
  fid: 'key',
  relation: 'key',
  userUuid: 'string',
  boardUuid: 'string',
  jobUuid: 'string',
  followingUserUuid: 'string',
  isDeleted: 'boolean',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const Job = objectType({
  name: 'Job',

  description: 'Job',

  definition(t) {
    t.id('id', { description: 'Internal partition key' });

    t.id('relation', { description: 'Internal sort key' });

    t.id('uuid', { description: 'UUID of the job' });

    // Agency
    t.string('agencyName', { nullable: true });

    t.string('agentName', { nullable: true });

    t.string('agentEmail', { nullable: true });

    t.string('agentPhone', { nullable: true });

    t.string('referralFee', { nullable: true });

    // Job
    t.string('jobTitle', { nullable: true });

    t.string('company', { nullable: true });

    t.string('companyWebsite', { nullable: true });

    t.string('companyLocation', { nullable: true });

    t.json('companyLocationCoordinates', { nullable: true });

    t.string('companyLocationMain', { nullable: true });

    t.string('companyLocationSecondary', { nullable: true });

    t.string('jobDescription', { nullable: true });

    t.string('jobUrl', { nullable: true });

    // Money
    t.field('employmentType', { type: EmploymentType, nullable: true });

    t.field('remoteOption', { type: RemoteOption, nullable: true });

    t.string('duration', { nullable: true });

    t.string('rate', { nullable: true });

    t.boolean('ir35', { nullable: true });

    // Extra
    t.field('feeling', { type: Feeling });

    t.field('status', { type: JobStatus });

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');

    t.list.string('permissions');

    t.list.field('events', {
      type: Event,

      // @ts-ignore
      resolve: async ({ id, relation }, _args, { user, dynamo, utils: { eventfactory } }) => {
        // id: USER#a6e02f9fb80b2daa538679cb6e6e26f559f18fa3
        // relation: JOB#BOARD#bja06ihpRpZwrisa#XH0jkiTHTwrdOKS7
        const userUuid = id.split('#')[1];
        const boardUuid = relation.split('#')[2];
        const jobUuid = relation.split('#')[3];

        return await eventfactory.list(userUuid, boardUuid, jobUuid);
      },
      nullable: true,
    });

    t.field('board', {
      type: Board,

      resolve: async ({ relation }, _args, { user, utils: { boardfactory } }) => {
        const boardUuid = relation.split('#')[2];

        return await boardfactory.get(user.uuid, boardUuid);
      },
    });

    t.field('user', {
      type: User,

      resolve: async ({ id }, _args, { utils: { userfactory } }) => {
        const userUuid = id.split('#')[1];
        return await userfactory.get(userUuid);
      },
    });

    t.field('createdBy', {
      type: User,

      // @ts-ignore
      resolve: async ({ createdBy }, _args, { utils: { userfactory } }) => {
        return await userfactory.get(createdBy);
      },
    });

    t.list.field('followers', {
      type: User,

      resolve: async ({ relation }, _args, { user, utils: { userfactory } }) => {
        const boardUuid = relation.split('#')[2];
        const jobUuid = relation.split('#')[3];

        return await userfactory.jobFollowers(user.uuid, boardUuid, jobUuid);
      },
    });
  },
});
