import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { TypicodeAPI } from './datasources/TypicodeAPI.js';

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

const { url } = await startStandaloneServer(server, {
  listen: { port: 8080 },
  context: async () => {
    return {
      dataSources: {
        typicodeAPI: new TypicodeAPI()
      }
    }
  }
});

console.log(`🚀  Server ready at: ${url}`);
