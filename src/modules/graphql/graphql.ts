// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { makeSchema } from 'nexus';
import { join } from 'path';
import { types } from './nexusTypes';
import dynamo from '../../utils/dynamo';
import logger from '../../utils/logger';
import healthcheck from '../../utils/healthcheck';

const schema = makeSchema({
  types,
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  outputs: {
    schema: join(__dirname, '../../../../../src/modules/graphql/generated/schema.graphql'),
    typegen: join(__dirname, '../../../../../src/modules/graphql/generated/nexus.ts'),
  },
});

logger.debug(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
logger.debug(`process.env.ENV: ${process.env.ENV}`);

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
    const { requestContext: { authorizer: { claims: { sub = '', email = '' } = {} } = {} } = {} } = event;
    logger.debug(`Sub: ${sub}`);

    return {
      headers: event.headers,
      functionName: context.functionName,
      dynamo,
      event,
      userId: process.env.ENV === 'local' ? '3b8ef697-536d-4626-a3e0-5e0b7ba4f14e' : sub,
      userEmail: process.env.ENV === 'local' ? 'targoo@gmail.com' : email,
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
