import id from '../../../utils/id';
import { prepareResponseDate, prepareFormInput } from '../nexusTypes/utils/form';
import { IFollowingJob, IKeyBase } from '../../../types/types';
import { GraphQLContext } from '../index';
import { jobFormProperties, jobProperties, followingJobProperties } from '../nexusTypes/Job';
import { NexusGenRootTypes } from '../generated/nexus';

export interface JobUtils {
  key: (userUuid: string, boardUuid: string, jobUuid: string) => IKeyBase;
  create: (
    userUuid: string,
    boardUuid: string,
    job: Partial<NexusGenRootTypes['Job']>,
    createdByUserUuid: string,
  ) => Promise<NexusGenRootTypes['Job']>;
  get: (userUuid: string, boardUuid: string, jobUuid: string) => Promise<NexusGenRootTypes['Job'] | null>;
  list: (userUuid: string, boardUuid: string) => Promise<NexusGenRootTypes['Job'][]>;
  followingList: (userUuid: string, boardUuid: string) => Promise<NexusGenRootTypes['Job'][]>;
  update: (
    userUuid: string,
    boardUuid: string,
    jobUuid: string,
    job: Partial<NexusGenRootTypes['Job']>,
  ) => Promise<NexusGenRootTypes['Job']>;
  isFollowing: (boardUuid: string, jobUuid: string, followingUserUuid: string) => Promise<boolean>;
  follow: (userUuid: string, boardUuid: string, jobUuid: string, followingUserUuid: string) => Promise<void>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const JobUtilityFactory: UtilityFactory<JobUtils> = ({ dynamo }) => ({
  key(userUuid, boardUuid, jobUuid) {
    const key: IKeyBase = {
      id: `USER#${userUuid}`,
      relation: `JOB#BOARD#${boardUuid}#${jobUuid}`,
    };
    return key;
  },

  async create(userUuid, boardUuid, job, createdByUserUuid) {
    const jobUuid = id();

    await dynamo.saveItem({
      ...prepareFormInput(job, jobFormProperties),
      ...this.key(userUuid, boardUuid, jobUuid),
      uuid: JSON.stringify({ format: 'string', value: jobUuid }),
      isDeleted: JSON.stringify({ format: 'boolean', value: false }),
      createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      createdBy: JSON.stringify({ format: 'string', value: createdByUserUuid }),
    });

    return this.get(userUuid, boardUuid, jobUuid);
  },

  async get(userUuid, boardUuid, jobUuid) {
    const { Item } = await dynamo.getItem(this.key(userUuid, boardUuid, jobUuid));
    if (Item) {
      return prepareResponseDate(Item) as NexusGenRootTypes['Job'];
    } else {
      return null;
    }
  },

  async list(userUuid, boardUuid) {
    const properties = Object.keys(jobProperties);

    const params = {
      KeyConditionExpression: '#id = :id and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':id': `USER#${userUuid}`,
        ':relation': `JOB#BOARD#${boardUuid}`,
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };

    let { Items: jobs } = await dynamo.query(params);

    return jobs.map((item) => prepareResponseDate(item)) as NexusGenRootTypes['Job'][];
  },

  async followingList(userUuid, boardUuid) {
    const properties = Object.keys(followingJobProperties);

    const params = {
      KeyConditionExpression: '#id = :id and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':id': `USER#${userUuid}`,
        ':relation': `FOLLOWING_JOB#BOARD#${boardUuid}#`,
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };

    const { Items } = await dynamo.query(params);

    const followingJobs = Items.map((item) => prepareResponseDate(item)).filter(
      (item) => item.isDeleted === false,
    ) as IFollowingJob[];

    return await Promise.all(
      followingJobs.map(({ userUuid, boardUuid, jobUuid }) => this.get(userUuid, boardUuid, jobUuid)),
    );
  },

  async update(userUuid, boardUuid, jobUuid, job) {
    const prepData = prepareFormInput(job, jobFormProperties);

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
      acc[`:${cur}`] = prepData[cur] || null;
      return acc;
    }, {});

    ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };

    await dynamo.updateItem(params, this.key(userUuid, boardUuid, jobUuid));

    return this.get(userUuid, boardUuid, jobUuid);
  },

  async isFollowing(boardUuid, jobUuid, followingUserUuid) {
    const key: IKeyBase = {
      id: `USER#${followingUserUuid}`,
      relation: `FOLLOWING_JOB#BOARD#${boardUuid}#${jobUuid}`,
    };
    const { Item } = await dynamo.getItem(key);

    if (Item) {
      const result = prepareResponseDate(Item) as IFollowingJob;
      return !result.isDeleted;
    } else {
      return false;
    }
  },

  async follow(userUuid, boardUuid, jobUuid, followingUserUuid) {
    const key: IKeyBase = {
      id: `USER#${followingUserUuid}`,
      relation: `FOLLOWING_JOB#BOARD#${boardUuid}#${jobUuid}`,
    };
    const { Item } = await dynamo.getItem(key);

    if (Item) {
      const params = {
        UpdateExpression: 'set #isDeleted = :isDeleted, #updated = :updated',
        ExpressionAttributeNames: {
          '#isDeleted': 'isDeleted',
          '#updated': 'updated',
        },
        ExpressionAttributeValues: {
          ':isDeleted': JSON.stringify({ format: 'boolean', value: false }),
          ':updated': JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
        },
      };
      await dynamo.updateItem(params, key);
    } else {
      await dynamo.saveItem({
        id: `USER#${followingUserUuid}`,
        relation: `FOLLOWING_JOB#BOARD#${boardUuid}#${jobUuid}`,
        fid: `USER#${userUuid}`,
        userUuid: JSON.stringify({ format: 'string', value: userUuid }),
        boardUuid: JSON.stringify({ format: 'string', value: boardUuid }),
        jobUuid: JSON.stringify({ format: 'string', value: jobUuid }),
        followingUserUuid: JSON.stringify({ format: 'string', value: followingUserUuid }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      });
    }
  },
});
