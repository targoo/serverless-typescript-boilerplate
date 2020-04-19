import { stringArg } from 'nexus';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import generateID from '../../../../utils/id';

export const passwordlessSignIn = {
  type: 'Boolean' as 'Boolean',

  args: {
    email: stringArg({
      required: true,
    }),
    redirectUri: stringArg({
      required: true,
    }),
  },

  resolve: async (_parent, { email, redirectUri }) => {
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
            state: generateID(),
            redirect_uri: redirectUri,
          },
        },
      });
      console.log(result.data);
    } catch (error) {
      console.log('error', error);
    }

    return true;
  },
};
