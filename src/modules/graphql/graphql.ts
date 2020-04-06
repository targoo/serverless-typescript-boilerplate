// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { makeSchema } from 'nexus';
import { join } from 'path';
import { types } from './nexusTypes';
import dynamo from '../../utils/dynamo';
import logger from '../../utils/logger';
import healthcheck from '../../utils/healthcheck';
import { verify, decode } from '../../utils/jwt';

const schema = makeSchema({
  types,
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  outputs: {
    schema: join(__dirname, '../../../../../src/modules/graphql/generated/schema.graphql'),
    typegen: join(__dirname, '../../../../../src/modules/graphql/generated/nexus.ts'),
  },
});

const graphqlRoutePrefix = process.env.IS_OFFLINE ? '' : `/${process.env.ENV}`;

const server: ApolloServer = new ApolloServer({
  schema,
  tracing: true,
  playground: {
    endpoint: graphqlRoutePrefix + '/graphql',
  },
  formatError: error => {
    return error;
  },
  context: ({ event, context }) => {
    console.log('event.headers', event.headers);
    const {
      headers: { authorization },
    } = event;
    console.log('authorization', authorization);

    const isTokenValid = verify(authorization);
    console.log('isTokenValid', isTokenValid);

    const { sub, email, email_verified, nickname, name } = isTokenValid
      ? decode(authorization)
      : { sub: undefined, email: undefined, email_verified: undefined, nickname: undefined, name: undefined };
    console.log('sub', sub);
    console.log('email', email);

    return {
      headers: event.headers,
      functionName: context.functionName,
      dynamo,
      event,
      userId: sub,
      userEmail: email,
      context,
    };
  },
});

export const handler: Handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
  onHealthCheck: () => {
    return new Promise((resolve, reject) => {
      if (healthcheck()) {
        resolve();
      } else {
        reject();
      }
    });
  },
});
