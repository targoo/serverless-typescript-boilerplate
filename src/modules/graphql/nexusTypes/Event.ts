import { objectType } from 'nexus';

import { EventType } from './enums/EventType';

export const eventFormProperties = {
  description: 'string',
  type: 'string',
  startAt: 'datetime',
  endAt: 'datetime',
  isDeleted: 'boolean',
};

export const eventProperties = {
  ...eventFormProperties,
  id: 'key',
  relation: 'key',
  uuid: 'string',
  createdAt: 'datetime',
  updatedAt: 'datetime',
};

export const Event = objectType({
  name: 'Event',

  description: 'Event',

  definition(t) {
    t.id('uuid', { description: 'UUID of the board' });

    t.datetime('startAt');

    t.datetime('endAt');

    t.field('type', { type: EventType });

    t.string('description');

    t.boolean('isDeleted');

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });
  },
});
