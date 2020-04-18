import { stringArg } from 'nexus';
import axios from 'axios';
import { Autho0User } from '../Autho0User';

import { sign } from '../../../../utils/jwt';
import logger from '../../../../utils/logger';

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0, 0);
}

export const signInConfirm = {
  type: Autho0User,

  args: {
    accessToken: stringArg({
      required: true,
    }),
  },

  resolve: async (_parent, { accessToken }) => {
    try {
      const { data } = await axios({
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const uuid = hashCode(`${data.email}`.toLowerCase());
      const jwt = sign({ ...data, uuid });
      return { ...data, uuid, jwt };
    } catch (error) {
      logger.error(error.response.data);
      return {};
    }
  },
};
