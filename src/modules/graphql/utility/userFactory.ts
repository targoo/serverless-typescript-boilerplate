import * as crypto from 'crypto';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { IUser, IFollowingBoard, IFollowingJob } from '../../../types/types';
import { prepareResponseDate } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';
import { NexusGenRootTypes } from '../generated/nexus';
import { followingBoardProperties } from '../nexusTypes/Board';
import { followingJobProperties } from '../nexusTypes/Job';

export interface UserUtils {
  get: (userUuid: string) => Promise<NexusGenRootTypes['User'] | null>;
  update: (userUuid: string, params: Omit<DocumentClient.UpdateItemInput, 'Key' | 'TableName'>) => Promise<void>;
  findOrCreateByEmail: (email: string) => Promise<IUser>;
  boardFollowers: (userUuid: string, boardUuid: string) => Promise<NexusGenRootTypes['User'][]>;
  jobFollowers: (userUuid: string, boardUuid: string, jobUuid: string) => Promise<NexusGenRootTypes['User'][]>;
}

export type UtilityFactory<UtilityShape> = (context: Partial<GraphQLContext>) => UtilityShape;

export const UserUtilityFactory: UtilityFactory<UserUtils> = ({ dynamo }) => ({
  async get(userUuid) {
    const key = {
      id: `USER#${userUuid}`,
      relation: `USER`,
    };
    const { Item } = await dynamo.getItem(key);

    if (Item) {
      return prepareResponseDate(Item) as IUser;
    } else {
      return null;
    }
  },

  async update(userUuid, params) {
    const key = {
      id: `USER#${userUuid}`,
      relation: `USER`,
    };

    await dynamo.updateItem(params, key);
  },

  async findOrCreateByEmail(email) {
    const userUuid = crypto
      .createHmac('sha1', process.env.SIGNIN_USER_SECRET)
      .update(`${email}`.toLowerCase())
      .digest('hex');

    const user = await this.get(userUuid);

    if (user) {
      return user;
    } else {
      const userParams = ({
        id: `USER#${userUuid}`,
        relation: `USER`,
        uuid: JSON.stringify({ format: 'string', value: userUuid }),
        email: JSON.stringify({ format: 'string', value: `${email}`.toLowerCase() }),
        isEmailVerified: JSON.stringify({ format: 'boolean', value: false }),
        isDeleted: JSON.stringify({ format: 'boolean', value: false }),
        createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
      } as unknown) as IUser;

      await dynamo.saveItem(userParams);

      return await this.get(userUuid);
    }
  },

  async boardFollowers(userUuid, boardUuid) {
    const properties = Object.keys(followingBoardProperties);

    const params = {
      IndexName: 'followers',
      KeyConditionExpression: '#fid = :fid and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':fid': `USER#${userUuid}`,
        ':relation': `FOLLOWING_BOARD#${boardUuid}`,
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };
    const { Items } = await dynamo.query(params);

    const followingUsers = Items.map((item) => prepareResponseDate(item)).filter(
      (item) => item.isDeleted === false,
    ) as IFollowingBoard[];

    return (await Promise.all(
      followingUsers.map(({ followingUserUuid }) => this.get(followingUserUuid)),
    )) as NexusGenRootTypes['User'][];
  },

  async jobFollowers(userUuid, boardUuid, jobUuid) {
    const properties = Object.keys(followingJobProperties);

    const params = {
      IndexName: 'followers',
      KeyConditionExpression: '#fid = :fid and begins_with(#relation, :relation)',
      ExpressionAttributeNames: properties.reduce((acc, cur) => {
        acc[`#${cur}`] = cur;
        return acc;
      }, {}),
      ExpressionAttributeValues: {
        ':fid': `USER#${userUuid}`,
        ':relation': `FOLLOWING_JOB#BOARD#${boardUuid}#${jobUuid}`,
      },
      ProjectionExpression: properties.map((property) => `#${property}`),
    };
    const { Items } = await dynamo.query(params);

    const followingUsers = Items.map((item) => prepareResponseDate(item)).filter(
      (item) => item.isDeleted === false,
    ) as IFollowingJob[];

    return (await Promise.all(
      followingUsers.map(({ followingUserUuid }) => this.get(followingUserUuid)),
    )) as NexusGenRootTypes['User'][];
  },
});
