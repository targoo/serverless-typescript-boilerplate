import { arg } from '@nexus/schema';

import { QueryFieldType } from '../../types';
import { JobInputWhere } from '../args';
import { Job, jobProperties } from '../Job';
import { IJob } from '../../../../types/types';
import logger from '../../../../utils/logger';
import { prepareResponseDate } from '../utils/form';

const getJob = async (dynamo, id, relation) => {
  const key = {
    id,
    relation,
  };
  const { Item } = await dynamo.getItem(key);
  return prepareResponseDate(Item);
};

export const jobs: QueryFieldType<'jobs'> = {
  type: Job,

  args: {
    where: arg({
      type: JobInputWhere,
      required: true,
    }),
  },

  resolve: async (_parent, { where: { userUuid, boardUuid, isDeleted } = {} }, { user, utils: { jobfactory } }) => {
    if (!user) {
      logger.error('Not authorized to list the jobs');
      throw new Error('Not authorized to list the jobs');
    }

    if (userUuid === user.uuid) {
      let jobs = await jobfactory.list(userUuid, boardUuid);

      const permissions = ['VIEW', 'EDIT', 'ARCHIVE', 'INVITE', 'ADD_EVENT'];

      jobs = jobs.map((item) => ({ ...item, permissions })).filter((item) => item.isDeleted === isDeleted || false);

      return jobs;
    } else {
      return [];
      // const permissions = ['VIEW', 'EDIT', 'ADD_EVENT'];
      // const params = {
      //   KeyConditionExpression: '#id = :userUUID and begins_with(#relation, :relation)',
      //   ExpressionAttributeNames: {
      //     '#userUuid': 'userUuid',
      //     '#boardUuid': 'boardUuid',
      //     '#jobUuid': 'jobUuid',
      //     '#isDeleted': 'isDeleted',
      //     '#id': 'id',
      //     '#relation': 'relation',
      //   },
      //   ExpressionAttributeValues: {
      //     ':userUUID': `USER#${user.uuid}`,
      //     ':relation': `FOLLOWING_JOB#BOARD#${boardUuid}#`,
      //   },
      //   ProjectionExpression: ['#userUuid', '#boardUuid', '#jobUuid', '#isDeleted', '#id', '#relation'],
      // };
      // console.log('params', params);
      // let { Items: items } = await dynamo.query(params);
      // items = items.map((item) => prepareResponseDate(item)).filter((item) => item.isDeleted === false) as IJob[];
      // items = (await Promise.all(
      //   items.map((item) => getJob(dynamo, `USER#${item.userUuid}`, `JOB#BOARD#${item.boardUuid}#${item.jobUuid}`)),
      // )) as IJob[];
      // items = items.map((item) => ({ ...item, permissions })).filter((item) => item.isDeleted === false) as IJob[];
      // return items;
    }
  },
};
