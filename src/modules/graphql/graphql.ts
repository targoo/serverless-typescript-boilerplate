// https://itnext.io/my-experience-with-severless-graphql-2e95e5a8bda7

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { makeSchema } from 'nexus';
// import { join } from 'path';

import { types } from './nexusTypes';
import dynamo from '../../utils/dynamo';

/**
 * When the schema starts and `process.env.NODE_ENV !== "production"`,
 * artifact files are auto-generated containing the .graphql definitions of
 * the schema under .webpack/service/src/modules/graphql.
 */
const schema = makeSchema({
  types,
  // outputs: {
  //   schema: join(__dirname, './generated/schema.graphql'),
  //   typegen: join(__dirname, './generated/nexus.ts'),
  // },
});

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.ENV', process.env.ENV);
console.log('process.env.ENVIRONMENT', process.env.ENVIRONMENT);

const server = new ApolloServer({
  schema,
  tracing: true,
  playground: {
    endpoint: process.env.ENV === 'local' ? '/graphql' : '/dev/graphql',
  },
  formatError: error => {
    return error;
  },
  context: ({ event, context }) => {
    const { requestContext: { identity: { cognitoAuthenticationProvider = '' } = {} } = {} } = event;
    const userId = cognitoAuthenticationProvider.split(':').pop();

    return {
      headers: event.headers,
      functionName: context.functionName,
      dynamo,
      event,
      userId,
      context,
    };
  },
});

export const handler: Handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
