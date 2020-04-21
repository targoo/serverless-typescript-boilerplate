import { enumType } from 'nexus/dist';

export const RemoteOption = enumType({
  name: 'RemoteOption',
  members: ['NO_REMOTE', 'FLEXIBLE', 'ONEDAY', 'TWODAYS', 'THREEDAYS', 'FOURDAYS', 'FULLY_REMOTE'],
});
