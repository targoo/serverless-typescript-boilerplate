import { objectType } from 'nexus';

import logger from '../../../utils/logger';
import { prepareResponseDate } from './utils/form';
import { IEvent, IUser } from '../../../types/types';
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

    t.list.field('events', {
      type: Event,

      // @ts-ignore
      resolve: async (parent, _args, { user, dynamo }) => {
        // @ts-ignore
        const { relation } = parent;

        // job relation: JOB#BOARD#bja06ihpRpZwrisa#XH0jkiTHTwrdOKS7
        const boardUuid = relation.split('#')[2];
        const jobUuid = relation.split('#')[3];

        const properties = Object.keys(eventProperties);

        const params = {
          KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
          ExpressionAttributeNames: properties.reduce((acc, cur) => {
            acc[`#${cur}`] = cur;
            return acc;
          }, {}),
          ExpressionAttributeValues: {
            ':userUUID': `USER#${user.userId}`,
            ':relation': `EVENT#BOARD#${boardUuid}#JOB#${jobUuid}`,
          },
          ProjectionExpression: properties.map((property) => `#${property}`),
        };
        logger.debug(JSON.stringify(params));

        let { Items: items }: { Items: IEvent[] } = await dynamo.query(params);
        logger.debug(`items: ${JSON.stringify(items)}`);

        items = items.map((item) => prepareResponseDate(item)) as IEvent[];
        logger.debug(`items: ${JSON.stringify(items)}`);

        return items;
      },
      nullable: true,
    });

    t.field('board', {
      type: Board,

      resolve: async (parent, _args, { user, dynamo }) => {
        // @ts-ignore
        const { relation } = parent;

        // job relation: JOB#BOARD#bja06ihpRpZwrisa#XH0jkiTHTwrdOKS7
        const boardUuid = relation.split('#')[2];

        const key = {
          id: `USER#${user.userId}`,
          relation: `BOARD#${boardUuid}`,
        };

        const { Item = {} } = await dynamo.getItem(key);

        return Item;
      },
    });

    t.field('user', {
      type: User,

      // @ts-ignore
      resolve: async ({ id }, _args, { dynamo }) => {
        const key = {
          id,
          relation: 'USER',
        };

        const { Item }: { Item: IUser } = await dynamo.getItem(key);
        logger.info(`item: ${JSON.stringify(Item)}`);

        const item = prepareResponseDate(Item);
        logger.info(`item: ${JSON.stringify(item)}`);

        return item;
      },
    });
  },
});
