import { objectType } from 'nexus';

import {
  createBoard,
  updateBoard,
  archiveBoard,
  createJob,
  archiveJob,
  updateJob,
  uploadFile,
  updateUser,
  passwordlessSignIn,
  passwordlessSignInConfirm,
} from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('passwordlessSignInConfirm', passwordlessSignInConfirm);

    t.field('passwordlessSignIn', passwordlessSignIn);

    t.field('createBoard', createBoard);

    t.field('updateBoard', updateBoard);

    t.field('archiveBoard', archiveBoard);

    t.field('createJob', createJob);

    t.field('archiveJob', archiveJob);

    t.field('updateJob', updateJob);

    t.field('updateUser', updateUser);

    // @ts-ignore
    t.field('uploadFile', uploadFile);
  },
});
