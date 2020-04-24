import { interfaceType } from '@nexus/schema';

export const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('uuid', { description: 'Unique identifier for the resource' });
  },
});
