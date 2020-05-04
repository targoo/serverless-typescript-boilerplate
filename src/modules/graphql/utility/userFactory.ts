import * as crypto from 'crypto';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { IUser } from '../../../types/types';
import { prepareResponseDate } from '../nexusTypes/utils/form';
import { GraphQLContext } from '../index';
import { NexusGenRootTypes } from '../generated/nexus';

export interface UserUtils {
  get: (userUuid: string) => Promise<NexusGenRootTypes['User'] | null>;
  update: (userUuid: string, params: Omit<DocumentClient.UpdateItemInput, 'Key' | 'TableName'>) => Promise<void>;
  findOrCreateByEmail: (email: string) => Promise<IUser>;
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
});
