import { objectType } from 'nexus';

// import { Node } from './Node';

export const Job = objectType({
  name: 'Job',
  description: 'This is a description of a Job',
  definition(t) {
    t.id('id');
    //    t.implements(Node);
  },
});
