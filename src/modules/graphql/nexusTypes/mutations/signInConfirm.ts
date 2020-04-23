import { stringArg } from 'nexus';
import axios from 'axios';

import { Autho0User } from '../Autho0User';
import { sign } from '../../../../utils/jwt';
import logger from '../../../../utils/logger';
import { hashCode } from '../utils/secret/secret';
import { IUser, IAuth } from '../../../../types/types';

export const signInConfirm = {
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

      const userId = hashCode(`${data.email}`.toLowerCase());

      const key = {
        id: `USER#${userId}`,
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
          id: `USER#${userId}`,
          relation: `USER`,
          email: JSON.stringify({ format: 'string', value: data.email }),
          isEmailVerified: JSON.stringify({ format: 'boolean', value: data.email_verified }),
          nickname: JSON.stringify({ format: 'string', value: data.nickname || data.email }),
          name: JSON.stringify({ format: 'string', value: data.name }),
          sub: JSON.stringify({ format: 'string', value: data.sub }),
          userId: JSON.stringify({ format: 'string', value: userId }),
          state: JSON.stringify({ format: 'string', value: state }),
          isDeleted: JSON.stringify({ format: 'boolean', value: false }),
          createdAt: JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
        } as unknown) as IUser;
        await dynamo.saveItem(createUser);
      }

      const jwt = sign({ ...data, userId, state });
      return { ...data, userId, state, jwt };
    } catch (error) {
      logger.error(error.response.data);
      return {};
    }
  },
};
