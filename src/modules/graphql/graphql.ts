// https://itnext.io/my-experience-with-severless-graphql-2e95e5a8bda7

// eslint-disable-next-line no-unused-vars
import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer, gql } from 'apollo-server-lambda';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  tracing: true,
  playground: {
    endpoint: process.env.ENV === 'local' ? '/graphql' : '/dev/graphql',
  },
  formatError: error => {
    return error;
  },
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

export const handler: Handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   tracing: true,
//   playground: true,
//   context: ({ event, context }) => ({
//     headers: event.headers,
//     functionName: context.functionName,
//     event,
//     context,
//   }),
// });

// export const handler: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
//   const response = server.createHandler({
//     cors: {
//       origin: '*',
//       credentials: true,
//       methods: ['POST', 'GET'],
//       allowedHeaders: ['Content-Type', 'Origin', 'Accept'],
//     },
//   });

//   return response(event, context, callback);
// };
