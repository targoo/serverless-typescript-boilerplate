import { objectType } from 'nexus';

import {
  createBoard,
  updateBoard,
  archiveBoard,
  createJob,
  archiveJob,
  uploadFile,
  createUser,
  updateUser,
} from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createBoard', createBoard);

    t.field('updateBoard', updateBoard);

    t.field('archiveBoard', archiveBoard);

    // // @ts-ignore
    // t.field('uploadFile', uploadFile);
    // // @ts-ignore
    // t.field('createJob', createJob);
    // t.field('archiveJob', archiveJob);
    // t.field('createUser', createUser);
    // t.field('updateUser', updateUser);
  },
});
