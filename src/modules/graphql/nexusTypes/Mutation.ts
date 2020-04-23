import { objectType } from 'nexus';

import {
  createBoard,
  updateBoard,
  archiveBoard,
  createJob,
  archiveJob,
  updateJob,
  createEvent,
  singleUpload,
  multipleUpload,
  archiveBoardFile,
  updateUser,
  passwordlessSignIn,
  signInConfirm,
  sendEmail,
  unfollowBoard,
  logout,
} from './mutations';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // @ts-ignore
    t.field('signInConfirm', signInConfirm);

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
    t.field('createEvent', createEvent);

    // @ts-ignore
    t.field('singleUpload', singleUpload);

    // @ts-ignore
    t.list.field('multipleUpload', multipleUpload);

    // @ts-ignore
    t.field('archiveBoardFile', archiveBoardFile);

    // @ts-ignore
    t.field('sendEmail', sendEmail);

    // @ts-ignore
    t.field('unfollowBoard', unfollowBoard);

    // @ts-ignore
    t.field('logout', logout);
  },
});
