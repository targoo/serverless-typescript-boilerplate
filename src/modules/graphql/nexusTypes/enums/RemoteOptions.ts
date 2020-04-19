import { enumType } from 'nexus/dist';

export const RemoteOptions = enumType({
  name: 'RemoteOptions',
  members: ['NO_REMOTE', 'FLEXIBLE', 'ONEDAY', 'TWODAYS', 'THREEDAYS', 'FOURDAYS', 'FULLY_REMOTE'],
});
