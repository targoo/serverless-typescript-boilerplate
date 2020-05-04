import { stringArg } from '@nexus/schema';
import axios from 'axios';

import { MutationFieldType } from '../../types';
import { Autho0User } from '../Autho0User';
import { sign } from '../../../../utils/jwt';
import logger from '../../../../utils/logger';
import { IAuth } from '../../../../types/types';

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

  resolve: async (_parent, { accessToken, state }, { utils: { userfactory } }) => {
    try {
      const { data }: { data: IAuth } = await axios({
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Find user
      const { uuid, nickname } = await userfactory.findOrCreateByEmail(data.email);

      // Update user.
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
          ':nickname': nickname ? nickname : JSON.stringify({ format: 'string', value: data.nickname || data.email }),
          ':name': JSON.stringify({ format: 'string', value: data.name }),
          ':sub': JSON.stringify({ format: 'string', value: data.sub }),
          ':updated': JSON.stringify({ format: 'datetime', value: new Date().toISOString() }),
        },
      };
      await userfactory.update(uuid, params);

      const jwt = sign({ ...data, uuid, state });
      return { ...data, uuid, state, jwt };
    } catch (error) {
      logger.error(error.response.data);
      throw new Error('Could not sign in the user');
    }
  },
};
