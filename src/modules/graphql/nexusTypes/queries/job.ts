import { idArg } from 'nexus';

const jobArgs = {
  boardUuid: idArg({
    required: true,
    description: 'The id of the board',
  }),
  uuid: idArg({
    required: true,
    description: 'The id of the job',
  }),
};

export const job = {
  type: 'Job' as 'Job',

  args: jobArgs,

  resolve: async (_parent, { boardUuid, uuid }, { userId, dynamo }) => {
    const key = {
      id: `USER#${userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
    };

    const { Item = {} } = await dynamo.getItem(key);

    return Item;
  },
};