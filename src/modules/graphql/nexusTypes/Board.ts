import { objectType } from 'nexus';

// import { Job } from './Job';
// import logger from '../../../utils/logger';
// import { IJob } from '../../../types/types';

export const boardFormProperties = {
  title: 'string',
  description: 'string',
  availableDate: 'date',
  location: 'string',
  isDeleted: 'boolean',
  // 'locationName',
  // 'locationAddress',
  // 'locationRangeKey',
  // 'locationHash',
  // 'locationGeoJson',
};

export const boardProperties = {
  ...boardFormProperties,
  id: 'key',
  relation: 'key',
  uuid: 'string',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const Board = objectType({
  name: 'Board',

  description: 'Board',

  definition(t) {
    t.id('uuid', { description: 'UUID of the board' });

    t.string('title');

    t.string('description', { nullable: true });

    t.date('availableDate', { nullable: true });

    t.string('location', { nullable: true });

    t.boolean('isDeleted');

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    // t.string('locationName', { nullable: true });

    // t.string('locationAddress', { nullable: true });

    // t.string('locationRangekey', { nullable: true });

    // t.string('locationHash', { nullable: true });

    // t.json('locationGeoJson', { nullable: true });

    // t.time('time', { nullable: true });

    // t.date('date', { nullable: true });

    // t.json('json', { nullable: true });

    // t.list.field('jobs', {
    //   type: Job,
    //   resolve: async ({ uuid }, _args, { userId, dynamo }) => {
    //     const params = {
    //       KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
    //       ExpressionAttributeNames: {
    //         '#uuid': 'uuid',
    //         '#title': 'title',
    //         '#status': 'status',
    //         '#createdAt': 'createdAt',
    //         '#updatedAt': 'updatedAt',
    //         '#id': 'id',
    //         '#relation': 'relation',
    //       },
    //       ExpressionAttributeValues: {
    //         ':userUUID': `USER#${userId}`,
    //         ':relation': `JOB#BOARD#${uuid}`,
    //       },
    //       ProjectionExpression: ['#relation', '#title', '#uuid', '#status', '#createdAt', '#updatedAt', 'isDeleted'],
    //     };
    //     logger.debug(JSON.stringify(params));

    //     let { Items: items }: { Items: IJob[] } = await dynamo.query(params);

    //     logger.debug(`items: ${JSON.stringify(items)}`);

    //     items = items.map(item => {
    //       if (item.createdAt) {
    //         item.createdAt = new Date(item.createdAt);
    //       }
    //       if (item.updatedAt) {
    //         item.updatedAt = new Date(item.updatedAt);
    //       }
    //       return item;
    //     });

    //     logger.debug(JSON.stringify(items));

    //     return items;
    //   },
    //   nullable: true,
    // });
  },
});
