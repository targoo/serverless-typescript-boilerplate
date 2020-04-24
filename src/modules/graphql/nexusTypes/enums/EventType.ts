import { enumType } from '@nexus/schema';

export const EventType = enumType({
  name: 'EventType',
  members: ['FACE2FACE', 'VIDEO_CALL', 'VIDEO_CALL', 'PHONE_CALL'],
});
