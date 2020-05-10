import { objectType } from '@nexus/schema';

import { File } from './File';
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
  createdBy: 'string',
  updatedAt: 'datetime',
};

export const followingBoardProperties = {
  id: 'key',
  fid: 'key',
  relation: 'key',
  userUuid: 'string',
  boardUuid: 'string',
  followingUserUuid: 'string',
  isDeleted: 'boolean',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const Board = objectType({
  name: 'Board',

  description: 'Board',

  definition(t) {
    t.id('id', { description: 'Internal partition key' });

    t.id('relation', { description: 'Internal sort key' });

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

    t.boolean('isOwner', { nullable: true });

    t.list.string('permissions');

    t.list.field('files', {
      type: File,

      // @ts-ignore
      resolve: async ({ id, uuid }, _args, { utils: { filefactory } }) => {
        const userUuid = id.split('#')[1];
        return await filefactory.list(userUuid, uuid);
      },
    });

    t.field('user', {
      type: User,

      resolve: async ({ id }, _args, { utils: { userfactory } }) => {
        const userUuid = id.split('#')[1];
        return await userfactory.get(userUuid);
      },
    });

    t.list.field('followers', {
      type: User,

      resolve: async (parents, _args, { user, utils: { userfactory } }) => {
        return await userfactory.boardFollowers(user.uuid, parents.uuid);
      },
    });
  },
});
