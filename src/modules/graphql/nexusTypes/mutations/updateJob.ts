import { arg, idArg } from 'nexus';

import { JobInputData } from '../args';
import { Job, jobFormProperties } from '../Job';
import { IJob, IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';

export const updateJob = {
  type: Job,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    uuid: idArg({
      required: true,
    }),
    data: arg({
      type: JobInputData,
      required: true,
    }),
  },

  resolve: async (_parent, { boardUuid, uuid, data }, { userId, dynamo }) => {
    const key: IKeyBase = {
      id: `USER#${userId}`,
      relation: `JOB#BOARD#${boardUuid}#${uuid}`,
    };

    const jobFormPropertiesWithUpdateAt = [...jobFormProperties, 'updatedAt'];

    const UpdateExpression = jobFormPropertiesWithUpdateAt.reduce((acc, cur, index) => {
      acc = index === 0 ? `${acc} #${cur} = :${cur}` : `${acc}, #${cur} = :${cur}`;
      return acc;
    }, 'set');

    const ExpressionAttributeNames = jobFormPropertiesWithUpdateAt.reduce((acc, cur) => {
      acc[`#${cur}`] = cur;
      return acc;
    }, {});

    const ExpressionAttributeValues = jobFormPropertiesWithUpdateAt.reduce((acc, cur) => {
      acc[`:${cur}`] = data[cur] || null;
      return acc;
    }, {});

    ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };

    logger.debug(JSON.stringify(params));

    await dynamo.updateItem(params, key);

    const { Item }: { Item: IJob } = await dynamo.getItem(key);
    Item.createdAt = new Date(Item.createdAt);
    Item.updatedAt = new Date(Item.updatedAt);

    return Item;
  },
};
