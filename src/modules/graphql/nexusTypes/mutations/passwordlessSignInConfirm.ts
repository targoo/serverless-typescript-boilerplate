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

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0, 0);
}

export const passwordlessSignInConfirm = {
  type: Autho0User,

  args: {
    code: stringArg(),
    accessToken: stringArg(),
    state: stringArg({
      required: true,
    }),
  },

  resolve: async (_parent, { code, accessToken, state }) => {
    console.log('-------------------------------------');
    console.log('---------------------code----------------', code);
    console.log('---------------------accessToken----------------', accessToken);
    console.log('---------------------state----------------', state);
    let newAccessToken = accessToken;
    try {
      //const authData = memo(state);
      //const authData = null;
      //if (authData) {
      //  logger.debug(`return memo auth0 token`);
      //  return authData;
      //} else {
      // If code is passed, we will get the access token.
      // if (code) {
      //   const { data: dataToken } = await axios({
      //     method: 'post',
      //     url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      //     data: {
      //       client_id: process.env.AUTH0_CLIENT_ID,
      //       client_secret: process.env.AUTH0_CLIENT_SECRET,
      //       grant_type: 'authorization_code',
      //       code,
      //       redirect_uri: 'http://localhost:3001',
      //       scope: 'openid profile email',
      //     },
      //     headers: {
      //       'content-type': 'application/json',
      //     },
      //   });
      //   newAccessToken = dataToken.access_token;
      // }

      const { data } = await axios({
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
      console.log('data', data);
      const uuid = hashCode(data.email);
      console.log('hash - uuid', uuid);
      const jwt = sign({ ...data, state, uuid });
      console.log('data2', { ...data, uuid, jwt });
      return { ...data, uuid, jwt };
      //}
    } catch (error) {
      console.log('error', error.response.data);
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
