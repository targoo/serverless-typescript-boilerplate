import { objectType } from 'nexus';

import { Board } from './Board';
import { JobStatus } from './enums/JobStatus';
import { EmploymentType } from './enums/EmploymentType';
import { Feeling } from './enums/Feeling';

export const jobFormProperties = {
  agencyName: 'string',
  agentName: 'string',
  agentEmail: 'string',
  agentPhone: 'string',
  jobTitle: 'string',
  company: 'string',
  companyWebsite: 'string',
  companyLocation: 'string',
  jobDescription: 'string',
  employmentType: 'string',
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
  updatedAt: 'datetime',
};

export const Job = objectType({
  name: 'Job',

  description: 'Job',

  definition(t) {
    t.id('uuid', { description: 'UUID of the job' });

    // Agency
    t.string('agencyName', { nullable: true });

    t.string('agentName', { nullable: true });

    t.string('agentEmail', { nullable: true });

    t.string('agentPhone', { nullable: true });

    // Job
    t.string('jobTitle', { nullable: true });

    t.string('company', { nullable: true });

    t.string('companyWebsite', { nullable: true });

    t.string('companyLocation', { nullable: true });

    t.string('jobDescription', { nullable: true });

    // Money
    t.field('employmentType', { type: EmploymentType, nullable: true });

    t.string('duration', { nullable: true });

    t.string('rate', { nullable: true });

    t.boolean('ir35', { nullable: true });

    // Extra
    t.field('feeling', { type: Feeling });

    t.field('status', { type: JobStatus });

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');

    // t.field('board', {
    //   type: Board,
    //   resolve: async (parent, _args, { userId, dynamo }) => {
    //     // @ts-ignore
    //     const { uuid, relation } = parent;

    //     const key = {
    //       id: `USER#${userId}`,
    //       relation: `BOARD#${relation.split('#')[2]}`,
    //     };

    //     const { Item = {} } = await dynamo.getItem(key);

    //     return Item;
    //   },
    // });
  },
});
