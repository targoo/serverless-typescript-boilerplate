import { arg, idArg } from '@nexus/schema';

import { MutationFieldType } from '../../types';
import { JobInputData } from '../args';
import { Job, jobFormProperties } from '../Job';
import { IJob, JobStatus, Feeling, IFollowingBoard } from '../../../../types/types';
import id from '../../../../utils/id';
import logger from '../../../../utils/logger';
import { prepareFormInput, prepareResponseDate } from '../utils/form';

export const createJob: MutationFieldType<'createJob'> = {
  type: Job,

  args: {
    userUuid: idArg({
      required: true,
    }),
    boardUuid: idArg({
      required: true,
    }),
    data: arg({
      type: JobInputData,
      required: true,
    }),
  },

  // @ts-ignore
  resolve: async (_parent, { userUuid, boardUuid, data }, { user, dynamo }) => {
    if (!user) {
      throw new Error('Not authorized to create a new job');
    }

    // Check permissions
    if (userUuid !== user.uuid) {
      const boardKey = {
        id: `USER#${user.uuid}`,
        relation: `FOLLOWING_BOARD#${boardUuid}`,
      };
      const { Item } = await dynamo.getItem(boardKey);

      if (Item) {
        const followingBoard = prepareResponseDate(Item) as IFollowingBoard;
        if (followingBoard.isDeleted) {
          throw new Error('Cannot create anymore a job for this board');
        }
      } else {
        throw new Error('Cannot create a job for this board');
      }
    }

    const jobUuid = id();

    // If a user create a job for someone else, we need to record that permission.
    if (userUuid !== user.uuid) {
      const followingJob = {
        id: `USER#${user.uuid}`,
        relation: `FOLLOWING_JOB#BOARD#${boardUuid}#${jobUuid}`,
        fid: `USER#${userUuid}`,
        userUuid: JSON.stringify({ format: 'string', value: userUuid }),
        boardUuid: JSON.stringify({ format: 'string', value: boardUuid }),
        jobUuid: JSON.stringify({ format: 'string', value: jobUuid }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      };
      await dynamo.saveItem(followingJob);
    }

    let job = ({
      ...prepareFormInput(data, jobFormProperties),
      id: `USER#${userUuid}`,
      relation: `JOB#BOARD#${boardUuid}#${jobUuid}`,
      uuid: JSON.stringify({ format: 'string', value: jobUuid }),
      status: JSON.stringify({ format: 'string', value: JobStatus.STARTED }),
      feeling: JSON.stringify({ format: 'string', value: Feeling.NORMAL }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      createdBy: JSON.stringify({ format: 'string', value: user.uuid }),
    } as unknown) as IJob;

    logger.debug(JSON.stringify(job));
    await dynamo.saveItem(job);

    job = prepareResponseDate(job) as IJob;

    return job;
  },
};
