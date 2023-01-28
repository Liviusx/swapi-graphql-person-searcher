import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Swapi } from './datasources/swapi.js';
import { createApolloServer } from './createApolloServer.js';

const { url } = await startStandaloneServer(createApolloServer(), {
  listen: { port: 4002 },
  context: async () => {
    return {
      dataSources: {
        swapi: new Swapi()
      },
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);