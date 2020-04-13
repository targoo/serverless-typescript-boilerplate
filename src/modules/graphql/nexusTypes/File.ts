import { objectType } from 'nexus';

export const File = objectType({
  name: 'File',
  definition(t) {
    t.string('filename');

    t.string('mimetype');

    t.string('encoding');

    t.string('resource');
  },
});
