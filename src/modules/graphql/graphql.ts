import gql from 'graphql-tag';
import { APIGatewayProxyCallback, APIGatewayProxyHandler } from 'aws-lambda';
import { ApolloServer, defaultPlaygroundOptions } from 'apollo-server-lambda';

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    uploads: [File]
    helloWorld: String
  }
  type Mutation {
    singleUpload(file: Upload!): File!
    multiUpload(files: [Upload!]!): [File]!
  }
`;

const resolvers = {
  Query: {
    uploads() {},
    helloWorld() {
      return 'hi';
    },
  },
  Mutation: {
    async singleUpload(_parent: any, { file }: { file: any }) {
      console.log(file);
      return file;
    },
    async multiUpload(_parent: any, { files }: { files: any }) {
      const fileArray = await files;
      fileArray.forEach(async (file: any) => {
        console.log(file);
      });
      return fileArray;
    },
  },
};

const graphqlRoutePrefix = process.env.IS_OFFLINE ? '' : `/${process.env.ENV}`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: graphqlRoutePrefix + '/graphql',
  },
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
