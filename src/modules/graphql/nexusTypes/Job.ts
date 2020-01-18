import { objectType } from 'nexus';

import { Board } from './Board';
import { JobStatus } from './enums/JobStatus';
import logger from '../../../utils/logger';
import { IBoard } from '../../../types/types';

export const Job = objectType({
  name: 'Job',

  description: 'Job',

  definition(t) {
    t.id('uuid');

    t.string('company', { nullable: true });

    t.string('duration', { nullable: true });

    t.string('rate', { nullable: true });

    t.string('location', { nullable: true });

    t.string('position', { nullable: true });

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
