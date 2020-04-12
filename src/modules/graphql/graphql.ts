// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback, APIGatewayProxyHandler } from 'aws-lambda';
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
  formatError: (error) => {
    return error;
  },
  context: ({ event, context }) => {
    console.log('event.headers', event.headers);
    const {
      headers: { Authorization },
    } = event;

    const isTokenValid = verify(Authorization);
    console.log('isTokenValid', isTokenValid);

    const { sub, email, email_verified, nickname, name } = isTokenValid
      ? decode(Authorization)
      : { sub: undefined, email: undefined, email_verified: undefined, nickname: undefined, name: undefined };
    console.log('userId', sub);
    console.log('userEmail', email);
    console.log('userName', nickname);

    return {
      headers: event.headers,
      functionName: context.functionName,
      dynamo,
      event,
      userId: sub,
      userEmail: email,
      userName: nickname,
      context,
    };
  },
});

// export const handler: Handler = server.createHandler({
//   cors: {
//     origin: '*',
//     credentials: true,
//   },
// });

export const handler: APIGatewayProxyHandler = (event, context, callback) => {
  if (Object.keys(event.headers).includes('Content-Type')) {
    event.headers['content-type'] = event.headers['Content-Type'];
  }
  const handler = server.createHandler({
    cors: {
      origin: true,
      credentials: true,
    },
  });
  return handler(event, context, callback);
};
