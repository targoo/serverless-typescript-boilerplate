import { objectType } from 'nexus';

export const File = objectType({
  name: 'File',
  definition(t) {
    t.id('id');

    t.string('filename');

    t.string('mimetype');

    t.string('encoding');
  },
});
