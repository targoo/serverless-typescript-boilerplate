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

    t.string('title');

    t.field('status', { type: JobStatus });

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');

    t.field('board', {
      type: Board,
      resolve: async (parent, _args, { userId, dynamo }) => {
        console.log('parent', parent);
        // @ts-ignore
        const { uuid, relation } = parent;
        console.log('uuid', uuid);
        console.log('relation', relation.split('#')[2]);
        console.log('userId', userId);

        const key = {
          id: `USER#${userId}`,
          relation: `BOARD#${relation.split('#')[2]}`,
        };

        console.log('key', key);

        const { Item = {} } = await dynamo.getItem(key);

        console.log('Item', Item);

        return Item;
      },
      nullable: true,
    });
  },
});
