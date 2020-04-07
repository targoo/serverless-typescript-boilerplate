import { objectType } from 'nexus';

import { EventType } from './enums/EventType';

export const eventFormProperties = ['date', 'type', 'description'];

export const eventProperties = [
  ...eventFormProperties,
  'id',
  'relation',
  'uuid',
  'isDeleted',
  'createdAt',
  'updatedAt',
];

export const Event = objectType({
  name: 'Event',

  description: 'Event',

  definition(t) {
    t.id('uuid', { description: 'UUID of the board' });

    t.datetime('date');

    t.field('type', { type: EventType });

    t.string('description');

    t.datetime('createdAt');

    t.datetime('updatedAt', { nullable: true });

    t.boolean('isDeleted');
  },
});
