import { objectType } from 'nexus';

import { Job } from './Job';
import { Node } from './Node';
import { BoardStatus } from './enums/BoardStatus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('uuid');
    t.string('username');
    t.string('email');
  },
});
