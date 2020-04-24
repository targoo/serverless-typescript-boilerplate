import { stringArg } from '@nexus/schema';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from '../../../../utils/logger';
import { MutationFieldType } from '../../types';

export const passwordlessSignIn: MutationFieldType<'passwordlessSignIn'> = {
  type: 'Boolean' as 'Boolean',

  args: {
    state: stringArg({
      required: true,
    }),
    email: stringArg({
      required: true,
    }),
    redirectUri: stringArg({
      required: true,
    }),
  },

  resolve: async (_parent, { state, email, redirectUri }) => {
    try {
      const result = await axios({
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        url: `https://${process.env.AUTH0_DOMAIN}/passwordless/start`,
        data: {
          client_id: process.env.AUTH0_CLIENT_ID,
          connection: 'email',
          email,
          send: 'link',
          authParams: {
            scope: 'openid profile email',
            state,
            redirect_uri: redirectUri,
          },
        },
      });
    } catch (error) {
      logger.error(error);
    }

    return true;
  },
};
