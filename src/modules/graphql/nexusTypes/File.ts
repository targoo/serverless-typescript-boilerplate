import { objectType } from 'nexus';

export const fileFormProperties = {
  filename: 'string',
  mimetype: 'string',
  encoding: 'date',
  resource: 'string',
};

export const fileProperties = {
  ...fileFormProperties,
  id: 'key',
  relation: 'key',
  uuid: 'string',
  createdAt: 'datetime',
};

export const File = objectType({
  name: 'File',
  definition(t) {
    t.id('uuid', { description: 'UUID of the job' });

    t.string('filename');

    t.string('mimetype');

    t.string('encoding');

    t.string('resource');

    t.datetime('createdAt');

    t.boolean('isDeleted');
  },
});
