import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import { makeSchema } from '@nexus/schema';
import { types } from './nexusTypes';
import { join } from 'path';
import { getContext, ContextParameters } from '.';

let schema: any = makeSchema({
  types,

  shouldGenerateArtifacts: true,

  outputs: {
    schema: join(__dirname, '../../../../../src/modules/graphql/generated/schema.graphql'),
    typegen: join(__dirname, '../../../../../src/modules/graphql/generated/nexus.ts'),
  },

  prettierConfig: {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
  },

  typegenAutoConfig: {
    sources: [{ source: join(__dirname, '../../../../../src/modules/graphql/index.ts'), alias: 'ctx' }],
    contextType: 'ctx.ContextType',
    debug: true,
  },
});

const graphqlRoutePrefix = process.env.IS_OFFLINE ? '' : `/${process.env.ENV}`;

const server: ApolloServer = new ApolloServer({
  schema,
  tracing: true,
  playground: {
    endpoint: `${graphqlRoutePrefix}/graphql`,
  },
  formatError: (error) => {
    return error;
  },
  context: ({ event, context }: ContextParameters) => getContext({ event, context }),
});

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
