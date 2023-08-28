import { ApolloServer } from "@apollo/server";
import { TypicodeAPI } from './datasources/TypicodeAPI.js';
import { startServerAndCreateLambdaHandler, handlers, } from '@as-integrations/aws-lambda';

const typeDefs = `#graphql
  type Query {
    posts: [Post]
  }
  type Post {
    id: ID!
    user: User
    title: String
    body: String
    comments: [Comment]
  }
  type User {
    id: ID!
    name: String
    email: String
  }
  type Comment {
    id: ID!
    postId: ID!
    email: String
    body: String
  }
  type Mutation {
    updatePost(
      id: ID!
      title: String!
      body: String!
      userId: ID!
  ): Post
  }
`;

const resolvers = {
  Query: {
    posts: async (_, __, { dataSources }) => {
      return dataSources.typicodeAPI.getAllPosts();
    },
  },
  Post: {
    user: async ({ userId }, _, { dataSources }) => {
      return await dataSources.typicodeAPI.getUsers.load(userId);
    },
    comments: async({ id }, _, { dataSources }) => {
      return await dataSources.typicodeAPI.getCommentsForPosts.load(id);
    },
  },
  Mutation: {
    updatePost: async (_, postData, { dataSources }) => {
      return dataSources.typicodeAPI.updatePost(postData);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async () => {
      return {
        dataSources: {
          typicodeAPI: new TypicodeAPI()
        }
      }
    }
  }
);