import { enumType } from '@nexus/schema';

export const MimeType = enumType({
  name: 'MimeType',
  members: ['PDF', 'DOC', 'FILE'],
});
