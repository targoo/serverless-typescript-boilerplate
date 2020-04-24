import { arg, idArg } from '@nexus/schema';

import { JobInputData } from '../args';
import { Job, jobFormProperties } from '../Job';
import { IJob, IKeyBase } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';
import { MutationFieldType } from '../../types';

export const updateJob: MutationFieldType<'updateJob'> = {
  type: Job,

  args: {
    boardUuid: idArg({
      required: true,
    }),
    jobUuid: idArg({
      required: true,
    }),
    data: arg({
      type: JobInputData,
      required: true,
    }),
  },

  // @ts-ignore
  resolve: async (_parent, { boardUuid, jobUuid, data }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to update the job');
    }

    const key: IKeyBase = {
      id: `USER#${user.uuid}`,
      relation: `JOB#BOARD#${boardUuid}#${jobUuid}`,
    };

    const prepData = prepareFormInput(data, jobFormProperties);

    const jobFormPropertiesWithUpdateAt = [...Object.keys(prepData), 'updatedAt'];

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

    try {
      await dynamo.updateItem(params, key);

      const { Item } = await dynamo.getItem(key);
      logger.debug(`item: ${JSON.stringify(Item)}`);

      const item = prepareResponseDate(Item) as IJob;
      logger.debug(`item: ${JSON.stringify(item)}`);
      return item;
    } catch (error) {
      logger.error(error);
      throw new Error('Could not update the job');
    }
  },
};
