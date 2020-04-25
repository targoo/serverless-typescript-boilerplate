import { arg, idArg } from '@nexus/schema';

import { JobInputData } from '../args';
import { Job, jobFormProperties } from '../Job';
import { IJob, IKeyBase, IFollowingJob } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';
import { MutationFieldType } from '../../types';

export const updateJob: MutationFieldType<'updateJob'> = {
  type: Job,

  args: {
    userUuid: idArg({
      required: true,
    }),
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
  resolve: async (_parent, { userUuid, boardUuid, jobUuid, data }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to update the job');
    }

    // Check permissions
    if (userUuid !== user.uuid) {
      const jobKey = {
        id: `USER#${user.uuid}`,
        relation: `FOLLOWING_JOB#BOARD#${boardUuid}#${jobUuid}`,
      };
      const { Item } = await dynamo.getItem(jobKey);

      if (Item) {
        const followingBoard = prepareResponseDate(Item) as IFollowingJob;
        if (followingBoard.isDeleted) {
          throw new Error('Cannot update anymore this job for this board');
        }
      } else {
        throw new Error('Cannot update a job for this board');
      }
    }

    const key: IKeyBase = {
      id: `USER#${userUuid}`,
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

      let { Item: job } = await dynamo.getItem(key);

      job = prepareResponseDate(job) as IJob;
      return job;
    } catch (error) {
      logger.error(error);
      throw new Error('Could not update the job');
    }
  },
};
