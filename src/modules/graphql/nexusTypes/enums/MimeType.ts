import { enumType } from 'nexus/dist';

export const MimeType = enumType({
  name: 'MimeType',
  members: ['PDF', 'DOC', 'FILE'],
});
