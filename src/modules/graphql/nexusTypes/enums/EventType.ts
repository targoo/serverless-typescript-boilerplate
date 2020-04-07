import { enumType } from 'nexus/dist';

export const EventType = enumType({
  name: 'EventType',
  members: ['FACE2FACE', 'ONLINETEST', 'VIDEOCALL', 'CALL'],
});
