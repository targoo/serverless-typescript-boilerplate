import { objectType } from 'nexus';

import {
  createBoard,
  updateBoard,
  archiveBoard,
  createJob,
  archiveJob,
  updateJob,
  singleUpload,
  updateUser,
  passwordlessSignIn,
  passwordlessSignInConfirm,
} from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // @ts-ignore
    t.field('passwordlessSignInConfirm', passwordlessSignInConfirm);

    // @ts-ignore
    t.field('passwordlessSignIn', passwordlessSignIn);

    // @ts-ignore
    t.field('createBoard', createBoard);

    // @ts-ignore
    t.field('updateBoard', updateBoard);

    // @ts-ignore
    t.field('archiveBoard', archiveBoard);

    // @ts-ignore
    t.field('createJob', createJob);

    // @ts-ignore
    t.field('archiveJob', archiveJob);

    // @ts-ignore
    t.field('updateJob', updateJob);

    // @ts-ignore
    t.field('updateUser', updateUser);

    // @ts-ignore
    t.field('singleUpload', singleUpload);
  },
});
