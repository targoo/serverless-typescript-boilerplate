import logger from '../../utils/logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { verify, decode } from '../../utils/jwt';
import dynamo from '../../utils/dynamo';
import s3 from '../../utils/s3';
import { emailService } from '../../utils/emailService';

// Infers the resolve type of a promise
type ThenArg<T> = T extends Promise<infer U> ? U : T;

export interface ContextParameters {
  event: APIGatewayProxyEvent;
  context: Context;
}

interface GraphQLContext extends ContextParameters {
  dynamo: any;
  s3: any;
  emailService: any;
  user: {
    sub: string;
    userId: string;
    email: string;
    email_verified: boolean;
    nickname: string;
    name: string;
    state: string;
    picture: string;
    iat: number;
    exp: number;
    audience: String;
    issuer: string;
  } | null;
}

export type ContextType = ThenArg<ReturnType<typeof getContext>>;

export const getContext = async ({ event, context }: ContextParameters): Promise<GraphQLContext> => {
  const {
    headers: { Authorization },
  } = event;
  logger.debug(`Authorization: ${Authorization}`);

  const isTokenValid = verify(Authorization);

  const user = isTokenValid ? decode(Authorization) : null;

  // Check with the DB is the session is still valid.

  // We should memo by user.

  logger.debug(JSON.stringify(user));

  return {
    event,
    context,
    dynamo,
    s3,
    user,
    emailService,
  };
};
