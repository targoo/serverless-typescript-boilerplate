import * as jwt from 'jsonwebtoken';

import logger from '../logger';

export function decode(token) {
  let decodedToken;
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    logger.error(error);
  }
  return decodedToken;
}

export function sign(user): string {
  // expiresIn
  // audience
  // issuer
  return jwt.sign(
    {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3,
      audience: 'audience',
      issuer: 'https://jobpod.com',
    },
    'shhhhh',
  );
}

export function verify(token): boolean {
  try {
    jwt.verify(token, 'shhhhh', {
      // audience: 'audience',
      // issuer: 'https://jobpod.com',
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
