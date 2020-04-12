import { stringArg } from 'nexus';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Autho0User } from '../Autho0User';

import { sign, decode } from '../../../../utils/jwt';
import logger from '../../../../utils/logger';

// Return the a memorized token until it expires
const memo = (() => {
  let authData: { jwt: string } | undefined;
  return (state: string | undefined, newAuthData = undefined) => {
    if (newAuthData) {
      authData = newAuthData;
      return newAuthData;
    }

    if (!authData) {
      return;
    }

    if (!authData.jwt) {
      return;
    }

    // Decode and check the token
    const decodeJwt = decode(authData.jwt);

    if (decodeJwt.state !== state) {
      return;
    }

    const now = new Date().getTime();
    if (decodeJwt.exp * 1000 < now) {
      return;
    }

    return authData;
  };
})();

export const passwordlessSignInConfirm = {
  type: Autho0User,

  args: {
    accessToken: stringArg({
      required: true,
    }),
    state: stringArg({
      required: true,
    }),
  },

  resolve: async (_parent, { accessToken, state }) => {
    try {
      const authData = memo(state);
      if (authData) {
        logger.debug(`return memo auth0 token`);
        return authData;
      } else {
        logger.debug(`return fresh auth0 token`);
        const { data } = await axios({
          method: 'post',
          url: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const jwt = sign({ ...data, state });
        return memo(state, { ...data, uuid: data.sub, jwt });
      }
    } catch (error) {
      console.log('error', error);
      return {};
    }
  },
};

// curl --request GET \
//   --url 'https://YOUR_DOMAIN/userinfo' \
//   --header 'Authorization: Bearer {ACCESS_TOKEN}' \
//   --header 'Content-Type: application/json'

// data:
//    { sub: 'email|5e8a10e976c85367281dab70',
//      nickname: 'targoo',
//      name: 'targoo@gmail.com',
//      picture:
//       'https://s.gravatar.com/avatar/49ffc0355eab75ca40a8c526bbf2941c?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fta.png',
//      updated_at: '2020-04-05T17:22:19.289Z',
//      email: 'targoo@gmail.com',
//      email_verified: true } }
