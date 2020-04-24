import { stringArg } from '@nexus/schema';
import axios from 'axios';
import * as crypto from 'crypto';

import { MutationFieldType } from '../../types';
import { Autho0User } from '../Autho0User';
import { sign } from '../../../../utils/jwt';
import logger from '../../../../utils/logger';
import { IUser, IAuth } from '../../../../types/types';

export const signInConfirm: MutationFieldType<'signInConfirm'> = {
  type: Autho0User,

  args: {
    accessToken: stringArg({
      required: true,
    }),
    state: stringArg({
      required: true,
    }),
  },

  resolve: async (_parent, { accessToken, state }, { dynamo }) => {
    try {
      const { data }: { data: IAuth } = await axios({
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const uuid = crypto
        .createHmac('sha1', process.env.SIGNIN_USER_SECRET)
        .update(`${data.email}`.toLowerCase())
        .digest('hex');

      const key = {
        id: `USER#${uuid}`,
        relation: `USER`,
      };

      const { Item } = await dynamo.getItem(key);

      if (Item) {
        const params = {
          UpdateExpression:
            'set #isEmailVerified = :isEmailVerified, #state = :state, #sub = :sub, #nickname = :nickname, #name = :name, #updated = :updated',
          ExpressionAttributeNames: {
            '#isEmailVerified': 'isEmailVerified',
            '#state': 'state',
            '#nickname': 'nickname',
            '#name': 'name',
            '#sub': 'sub',
            '#updated': 'updated',
          },
          ExpressionAttributeValues: {
            ':isEmailVerified': JSON.stringify({ format: 'boolean', value: data.email_verified }),
            ':state': JSON.stringify({ format: 'string', value: state }),
            ':nickname': Item.nickname
              ? Item.nickname
              : JSON.stringify({ format: 'string', value: data.nickname || data.email }),
            ':name': JSON.stringify({ format: 'string', value: data.name }),
            ':sub': JSON.stringify({ format: 'string', value: data.sub }),
            ':updated': JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
          },
        };
        await dynamo.updateItem(params, key);
      } else {
        const createUser = ({
          id: `USER#${uuid}`,
          relation: `USER`,
          email: JSON.stringify({ format: 'string', value: data.email }),
          isEmailVerified: JSON.stringify({ format: 'boolean', value: data.email_verified }),
          nickname: JSON.stringify({ format: 'string', value: data.nickname || data.email }),
          name: JSON.stringify({ format: 'string', value: data.name }),
          sub: JSON.stringify({ format: 'string', value: data.sub }),
          uuid: JSON.stringify({ format: 'string', value: uuid }),
          state: JSON.stringify({ format: 'string', value: state }),
          isDeleted: JSON.stringify({ format: 'boolean', value: false }),
          createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
        } as unknown) as IUser;
        await dynamo.saveItem(createUser);
      }

      const jwt = sign({ ...data, uuid, state });
      return { ...data, uuid, state, jwt };
    } catch (error) {
      logger.error(error.response.data);
      throw new Error('Could not sign in the user');
    }
  },
};
