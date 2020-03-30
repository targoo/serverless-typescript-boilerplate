import { objectType } from 'nexus';

import { Board } from './Board';
import { JobStatus } from './enums/JobStatus';
import { EmploymentType } from './enums/EmploymentType';

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
    t.field('employmentType', { type: EmploymentType });

    t.string('duration', { nullable: true });

    t.string('rate', { nullable: true });

    t.string('ir35', { nullable: true });

    t.field('status', { type: JobStatus });

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');

    t.field('board', {
      type: Board,
      resolve: async (parent, _args, { userId, dynamo }) => {
        // @ts-ignore
        const { uuid, relation } = parent;

        const key = {
          id: `USER#${userId}`,
          relation: `BOARD#${relation.split('#')[2]}`,
        };

        const { Item = {} } = await dynamo.getItem(key);

        return Item;
      },
    });
  },
});
