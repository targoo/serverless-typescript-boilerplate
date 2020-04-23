import { objectType } from 'nexus';

import logger from '../../../utils/logger';
import { File, fileProperties } from './File';
import { IFile, IUser } from '../../../types/types';
import { prepareResponseDate } from './utils/form';
import { EducationLevel, InterestLevel } from './enums';
import { User } from './User';

export const boardFormProperties = {
  title: 'string',
  description: 'string',
  availableDate: 'date',
  location: 'string',
  locationCoordinates: 'json',
  locationMain: 'string',
  locationSecondary: 'string',
  isDeleted: 'boolean',
  educationLevel: 'string',
  interestLevel: 'string',
  workRightEU: 'boolean',
  workRightUK: 'boolean',
};

export const boardProperties = {
  ...boardFormProperties,
  id: 'key',
  relation: 'key',
  uuid: 'string',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const followingBoardProperties = {
  id: 'key',
  relation: 'key',
  boardUuid: 'string',
  userId: 'string',
  isDeleted: 'boolean',
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

    t.json('locationCoordinates', { nullable: true });

    t.string('locationMain', { nullable: true });

    t.string('locationSecondary', { nullable: true });

    t.field('educationLevel', { type: EducationLevel, nullable: true });

    t.field('interestLevel', { type: InterestLevel, nullable: true });

    t.boolean('workRightEU', { nullable: true });

    t.boolean('workRightUK', { nullable: true });

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');

    t.list.field('files', {
      type: File,

      // @ts-ignore
      resolve: async ({ uuid }, _args, { user, dynamo }) => {
        const properties = Object.keys(fileProperties);

        const params = {
          KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
          ExpressionAttributeNames: properties.reduce((acc, cur) => {
            acc[`#${cur}`] = cur;
            return acc;
          }, {}),
          ExpressionAttributeValues: {
            ':userUUID': `USER#${user.userId}`,
            ':relation': `FILE#BOARD#${uuid}`,
          },
          ProjectionExpression: properties.map((property) => `#${property}`),
        };
        logger.debug(JSON.stringify(params));

        let { Items: items }: { Items: IFile[] } = await dynamo.query(params);
        logger.debug(`items: ${JSON.stringify(items)}`);

        items = items.map((item) => prepareResponseDate(item)) as IFile[];
        logger.debug(`items: ${JSON.stringify(items)}`);

        items = items.filter((item) => item.isDeleted === false);

        return items;
      },
      nullable: true,
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

    t.list.field('followers', {
      type: User,

      // @ts-ignore
      resolve: async (parents, _args, { dynamo }) => {
        console.log(parents.uuid);

        // const params = {
        //   KeyConditionExpression: '#fid = :fid and begins_with(#relation, :relation)',
        //   ExpressionAttributeNames: {
        //     '#fid': 'fid',
        //     '#id': 'id',
        //   },
        //   ExpressionAttributeValues: {
        //     ':userUUID': `USER#${user.userId}`,
        //     ':relation': 'BOARD#',
        //   },
        //   ProjectionExpression: ['fid'],
        // };

        return [];
      },
    });

    // t.string('locationName', { nullable: true });

    // t.string('locationAddress', { nullable: true });

    // t.string('locationRangekey', { nullable: true });

    // t.string('locationHash', { nullable: true });

    // t.json('locationGeoJson', { nullable: true });

    // t.time('time', { nullable: true });

    // t.date('date', { nullable: true });

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
