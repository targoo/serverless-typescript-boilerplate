import { interfaceType } from 'nexus';

export const Node = interfaceType({
  name: 'Node',
  description: 'This is a description of a Node',
  definition(t) {
    t.id('id');
    t.resolveType(() => null);
  },
});
